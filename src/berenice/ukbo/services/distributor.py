from typing import Optional

import pandas as pd
from flask import Response, abort, jsonify
from slugify import slugify  # type: ignore
from sqlalchemy.sql import func
from ukbo import models
from ukbo.dto import DistributorSchema, FilmSchemaStrict
from ukbo.extensions import db


def list(page: int = 1, limit: int = 100) -> Response:
    """
    Paginated list of all distributors.

    Args:
        page: Page number
        limit: Number of results per page

    Returns (JSON): Paginated list of distributors.
    """
    query = db.session.query(models.Distributor)
    data = query.order_by(models.Distributor.name.asc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    if data is None:
        abort(404)

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    distributor_schema = DistributorSchema()

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[distributor_schema.dump(ix) for ix in data.items],
    )


def get(slug: str) -> Response:
    """
    Get one distributor based on its slug.

    Args:
        slug: Slug of the distributor to get.

    Returns (JSON): Distributor data.
    """
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    distributor_schema = DistributorSchema()

    return distributor_schema.dump(data)


def get_films(slug: str, page: int = 1, limit: int = 100) -> Response:
    """
    Get a distributor list of films from slug.

    Args:
        slug: Slug of the distributor to get.
        page: Page number
        limit: Number of results per page

    Returns (JSON): Paginated list of films.
    """
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    distributor = query.first()

    query = db.session.query(models.Film).options(
        db.joinedload(models.Film.weeks)
    )
    query = query.join(models.Distributor)

    query = query.filter(models.Distributor.slug == slug)
    data = query.order_by(models.Film.id.asc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    distributor_schema = DistributorSchema()
    film_schema = FilmSchemaStrict()

    return jsonify(
        distributor=distributor_schema.dump(distributor),
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[film_schema.dump(ix) for ix in data.items],
    )


def add_distributor(distributor: str) -> models.Distributor:
    """
    Add a distributor to the database.

    Checks the database if the distributor exists - returns it.
    If not - creates it, adds it to the database and returns it.

    Args:
        distributor: Name of the distributor to add.

    Returns Distributor object.
    """
    distributor = distributor.strip()
    slug = slugify(distributor)

    if instance := models.Distributor.query.filter_by(slug=slug).first():
        return instance
    return models.Distributor.create(name=distributor, commit=False)


def search(search_query: str) -> Response:
    """
    Search distributors by name.

    Args:
        search_query: Search query.

    Returns (JSON): List of distributors.
    """
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.name.ilike(f"%{search_query}%"))
    data = query.limit(10).all()

    distributor_schema = DistributorSchema()

    return [] if data is None else [distributor_schema.dump(ix) for ix in data]


def market_share(year: Optional[str] = None) -> Response:
    """
    Gets the distributor market share for a year

    Args:
        year: Year to get the market share for.

    Returns (JSON): List of distributors and their market share.
    """
    query = db.session.query(
        func.extract("year", models.Film_Week.date),
        models.Distributor,
        func.sum(models.Film_Week.week_gross),
    )

    query = query.join(models.Distributor)
    query = query.group_by(models.Distributor)
    query = query.group_by(func.extract("year", models.Film_Week.date))
    query = query.order_by(func.extract("year", models.Film_Week.date).desc())

    if year is not None:
        query = query.filter(
            func.extract("year", models.Film_Week.date) == year
        )

    data = query.all()

    if data is None:
        abort(404)

    distributor_schema = DistributorSchema()

    return jsonify(
        results=[
            dict(
                year=row[0],
                distributor=distributor_schema.dump(row[1]),
                gross=row[2],
            )
            for row in data
        ]
    )


def market_share_date(start: str, end: str) -> Response:
    """
    Gets the distributor market share for a time period.

    Args:
        start: Start date.
        end: End date.

    Returns (JSON): List of distributors and their market share.
    """
    query = db.session.query(
        models.Distributor,
        func.sum(models.Film_Week.week_gross),
    )

    query = query.join(models.Distributor)
    query = query.filter(models.Film_Week.date >= start)
    query = query.filter(models.Film_Week.date <= end)
    query = query.group_by(models.Distributor)
    query = query.order_by(func.sum(models.Film_Week.week_gross).desc())

    data = query.all()

    if data is None:
        abort(404)

    distributor_schema = DistributorSchema()

    return jsonify(
        results=[
            dict(
                distributor=distributor_schema.dump(row[0]),
                gross=row[1],
            )
            for row in data
        ]
    )


def spellcheck_distributor(distributor: pd.Series) -> str:
    """
    Spellchecks the distributor against a list of common mistakes

    Args:
        distributor: Distributor to check

    Returns:
        str: Cleaned distributor
    """
    distributor = distributor.strip().upper()
    try:
        df = pd.read_csv("./data/distributor_check.csv", header=None)
    except FileNotFoundError:
        return distributor
    df.columns = ["key", "correction"]

    if distributor in df["key"].values:
        df = df[df["key"].str.match(distributor)]
        distributor = df["correction"].iloc[0]
    return distributor
