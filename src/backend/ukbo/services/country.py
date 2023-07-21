import datetime
from typing import List, Optional

import numpy as np
import pandas as pd
from flask import Response, abort, jsonify
from slugify import slugify  # type: ignore
from sqlalchemy import func
from ukbo import models
from ukbo.dto import CountrySchema, FilmSchemaStrict
from ukbo.extensions import db


def list(page: int = 1, limit: int = 100) -> Response:
    """
    Get a paginated list of all countries.

    Args:
        page: Page number
        limit: Number of results per page

    Returns (JSON): Paginated list of countries.
    """
    query = db.session.query(models.Country)
    data = query.order_by(models.Country.name.asc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    if data is None:
        abort(404)

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    country_schema = CountrySchema()

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[country_schema.dump(ix) for ix in data.items],
    )


def get(slug: str) -> Response:
    """
    Get one country based on its slug.

    Args:
        slug: Slug of the country to get.

    Returns (JSON): Country data.
    """
    query = db.session.query(models.Country)
    query = query.filter(models.Country.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    country_schema = CountrySchema()

    return country_schema.dump(data)


def get_films(slug: str, page: int = 1, limit: int = 100) -> Response:
    """
    Get a countries list of films from slug.

    Args:
        slug: Slug of the country to get.
        page: Page number
        limit: Number of results per page

    Returns (JSON): Paginated list of films.
    """
    query = db.session.query(models.Country)
    query = query.filter(models.Country.slug == slug)
    country = query.first()

    query = db.session.query(models.Film).options(
        db.selectinload(models.Film.weeks)
    )
    query = query.filter(models.Film.countries.contains(country))
    data = query.order_by(models.Film.id.desc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    country_schema = CountrySchema()
    film_schema = FilmSchemaStrict()

    return jsonify(
        country=country_schema.dump(country),
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[film_schema.dump(ix) for ix in data.items],
    )


def get_box_office(slug: str, limit: int) -> Response:
    """
    Gets box office summary for a given country, grouped by years.

    Args:
        slug: Slug of the country to get.
        limit: The number of years to go backwards.

    Returns:
        JSON response of the list of years.
    """

    query = db.session.query(
        func.extract("year", models.Film_Week.date),
        func.sum(models.Film_Week.total_gross),
        func.count(models.Film.id),
    ).group_by(func.extract("year", models.Film_Week.date))

    query = query.join(models.Film).join(models.countries).join(models.Country)

    query = query.filter(models.Country.slug == slug)

    # get current year and set limit
    now = datetime.datetime.now().year
    query = query.filter(
        func.extract("year", models.Film_Week.date) >= (now - limit)
    )

    data = query.order_by(
        func.extract("year", models.Film_Week.date).desc()
    ).all()

    return jsonify(
        results=[
            dict(
                year=row[0],
                total=row[1],
                count=row[2],
            )
            for row in data
        ]
    )


def add_country(country: str) -> Optional[List[models.Country]]:
    """
    Add a country to the database.

    Args:
        country: Country to add.

    If the country is a list within a string separated by ``/``
    It is split, and each one mapped to the full country name.
    Checks the database if the country exists.
    If not - creates it, adds it to the database.

    Returns list of Country objects.
    """
    if country is None or (isinstance(country, str) and not country.strip()):
        return None
    new_countries: List[models.Country] = []

    country = country.strip()
    countries = country.split("/")
    for i in countries:
        i = i.strip()
        i = spellcheck_country(i)
        slug = slugify(i)
        db_country = models.Country.query.filter_by(slug=slug).first()

        if db_country and slug == db_country.slug:
            new_countries.append(db_country)
        else:
            new = models.Country.create(name=i, commit=False)
            new_countries.append(new)
    return new_countries


def search(search_query: str) -> Response:
    """
    Search countries by name.

    Args:
        search_query: Search query.

    Returns (JSON): List of countries.
    """
    query = db.session.query(models.Country)
    query = query.filter(models.Country.name.ilike(f"%{search_query}%"))
    data = query.limit(10).all()

    country_schema = CountrySchema()

    return [] if data is None else [country_schema.dump(ix) for ix in data]


def spellcheck_country(country: str) -> str:
    """
    Spellchecks the country against a list of common mistakes

    Args:
        country: Country to check

    Returns:
        str: Cleaned country
    """
    country = country.strip().upper()
    try:
        df = pd.read_csv("./data/country_check.csv", header=None)
    except FileNotFoundError:
        return country
    df.columns = ["key", "correction", "flag"]

    if country in df["key"].values:
        df = df[df["key"].str.match(country)]
        country = df["correction"].iloc[0]
    return country
