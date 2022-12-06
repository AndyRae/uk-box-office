from typing import List

import pandas as pd
from flask import Response, abort, jsonify
from slugify import slugify  # type: ignore
from ukbo import models
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

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[ix.as_dict() for ix in data.items],
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

    return data.as_dict()


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
    data = query.order_by(models.Film.id.asc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    return jsonify(
        country=country.as_dict(),
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[ix.as_dict(weeks=False) for ix in data.items],
    )


def add_country(country: str) -> List[models.Country]:
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
    new_countries: List[models.Country] = []
    if type(country) == float:
        return new_countries
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

    return [] if data is None else [ix.as_dict() for ix in data]


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
