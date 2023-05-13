import uuid
from typing import List, Optional

import pandas as pd
from flask import Response, abort, jsonify
from slugify import slugify  # type: ignore
from sqlalchemy import extract, func, select
from sqlalchemy.orm import joinedload, selectinload
from ukbo import models, services
from ukbo.dto import FilmSchema, FilmSchemaStrict, FilmSchemaValues
from ukbo.extensions import db


def list(page: int = 1, limit: int = 100) -> Response:
    """
    Paginated list of all films.

    Args:
        page: Page number
        limit: Number of results per page

    Returns (JSON): Paginated list of films.
    """
    query = db.session.query(models.Film)
    data = query.order_by(models.Film.name.asc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    if data is None:
        abort(404)

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    film_schema = FilmSchemaStrict()

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[film_schema.dump(ix) for ix in data.items],
    )


def get(slug: str) -> Response:
    """
    Get one film based on its slug.

    Args:
        slug: Slug of the film to get.

    Returns (JSON): Film data.
    """
    query = db.session.query(models.Film)
    query = query.filter(models.Film.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    film_schema = FilmSchema()
    return film_schema.dump(data)


def get_by_id(id: int) -> Response:
    """
    Get one film based on its Id.

    Args:
        id: Id of the film to get.

    Returns (JSON): Film data.
    """
    query = db.session.query(models.Film)
    query = query.filter(models.Film.id == id)
    data = query.first()

    if data is None:
        abort(404)

    film_schema = FilmSchema()
    return film_schema.dump(data)


def add_film(
    film: str,
    countries: List[models.Country],
    distributor: Optional[models.Distributor] = None,
) -> models.Film:
    """
    Add a film to the database.

    Checks the database if the film exists - returns the object.
    If not - creates it, adds it to the database and returns it.

    Args:
        film: Name of the film.
        distributor: Distributor object.
        countries: List of country objects.

    Returns Film object.
    """
    film = film.strip()

    if distributor:
        instance = models.Film.query.filter_by(
            name=film, distributor=distributor
        ).first()
    else:
        instance = models.Film.query.filter_by(
            name=film, distributor=None
        ).first()

    if instance:
        return instance

    record = {"name": film, "distributor": distributor, "countries": countries}

    new = models.Film.create(**record, commit=False)

    try:
        new.save()
    except Exception:
        # Film exists but with a different distributor
        db.session.rollback()
        print(f"Duplicate {film}")
        services.events.create(
            models.Area.etl, models.State.warning, f"Duplicate - {film}."
        )
        if distributor:
            slug = slugify(f"{film}-{distributor.name}")
        else:
            slug = slugify(f"{film}-{uuid.uuid4()}")
        new.slug = slug
        new.save()

    return new


def delete_film(id: int) -> bool:
    """
    Delete a film and all its associated data.

    Args:
        id: ID of the film to delete.

    Returns None.
    """
    query = db.session.query(models.Film)
    query = query.filter(models.Film.id == id)
    data = query.first()
    if data is None:
        abort(404)
    try:
        data.delete()
        db.session.commit()
        return True
    except Exception:
        print(f"Failed to delete {data.name}")
        db.session.rollback()
        return False


def search(
    search_query: str,
    query_filter: services.filters.QueryFilter = services.filters.QueryFilter(),
    limit: int = 15,
    page: int = 1,
) -> Response:
    """
    Search films by name.

    Args:
        search_query: Search query.

    Returns (JSON): List of films.
    """
    # main query
    query = db.session.query(models.Film)
    query = query.filter(models.Film.name.ilike(f"%{search_query}%"))

    # apply filters
    if query_filter.distributor_id is not None:
        query = query.filter(
            models.Film.distributor_id.in_(query_filter.distributor_id)
        )

    if query_filter.country_ids is not None:
        query = query.join(models.countries).join(models.Country)
        query = query.filter(models.Country.id.in_(query_filter.country_ids))

    if (
        query_filter.min_year is not None
        or query_filter.max_year is not None
        or query_filter.min_box is not None
    ):
        query = query.join(models.Film_Week).group_by(models.Film.id)

    if query_filter.min_year is not None:
        query = query.filter(
            extract("year", models.Film_Week.date) >= query_filter.min_year
        )

    if query_filter.max_year is not None:
        query = query.filter(
            extract("year", models.Film_Week.date) <= query_filter.max_year
        )

    if query_filter.min_box is not None:
        query = query.having(
            func.max(models.Film_Week.total_gross) >= query_filter.min_box
        )

    if query_filter.max_box is not None:
        query = query.having(
            func.max(models.Film_Week.total_gross) <= query_filter.max_box
        )

    data = query.paginate(page=page, per_page=25, error_out=False)
    if data is None:
        return {"none"}

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    film_schema = FilmSchemaStrict()

    return {
        "count": data.total,
        "next": next_page,
        "previous": previous_page,
        "results": [film_schema.dump(ix) for ix in data],
    }


def partial_search(search_query: str, limit: int = 15) -> Response:
    """
    Search films by name.

    Args:
        search_query: Search query.

    Returns (JSON): List of partial films.
    """
    query = db.session.query(models.Film)
    query = query.filter(models.Film.name.ilike(f"{search_query}%"))
    data = query.limit(limit).all()

    film_schema = FilmSchemaValues()

    return [] if data is None else [film_schema.dump(ix) for ix in data]


def spellcheck_film(film_title: pd.Series) -> str:
    """
    Spellchecks the film title against a list of common mistakes

    Args:
        film_title: Film title to check

    Alo generally cleans up the title

    Returns:
        str: Cleaned title
    """
    film_title = film_title.strip().upper()
    # if film ends with ', the', trim and add to prefix
    if film_title.endswith(", THE"):
        film_title = "THE " + film_title.rstrip(", THE")

    # checks against the list of mistakes
    try:
        df = pd.read_csv("./data/film_check.csv", header=None)
    except FileNotFoundError:
        return film_title
    df.columns = ["key", "correction"]

    if film_title in df["key"].values:
        df = df[df["key"].str.contains(film_title, regex=False)]
        film_title = df["correction"].iloc[0].strip()
    return film_title
