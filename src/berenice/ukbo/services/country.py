from typing import List

from flask import Response, abort, jsonify
from slugify import slugify  # type: ignore
from ukbo import models
from ukbo.extensions import db

from . import utils


def list(start: int, limit: int = 100) -> Response:
    """
    Paginated list of all countries.
    """
    query = db.session.query(models.Country)
    data = query.order_by(models.Country.name.asc()).paginate(
        page=start, per_page=limit, error_out=False
    )

    if data is None:
        abort(404)

    next_page = f"/api?start={start + 1}" if data.has_next else ""
    previous_page = f"/api?start={start - 1}" if data.has_prev else ""

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[ix.as_dict() for ix in data.items],
    )


def get(slug: str) -> Response:
    """
    Get one country based on its slug.
    """
    query = db.session.query(models.Country)
    query = query.filter(models.Country.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    return data.as_dict()


def get_films(slug: str, start: int = 1, limit: int = 100) -> Response:
    """
    Get a countries list of films from slug.
    """
    query = db.session.query(models.Country)
    query = query.filter(models.Country.slug == slug)
    country = query.first()

    query = db.session.query(models.Film).options(
        db.selectinload(models.Film.weeks)
    )
    query = query.filter(models.Film.countries.contains(country))
    data = query.order_by(models.Film.id.asc()).paginate(start, limit, False)

    next_page = f"/api?start={start + 1}" if data.has_next else ""
    previous_page = f"/api?start={start - 1}" if data.has_prev else ""

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[ix.as_dict() for ix in data.items],
    )


def add_country(country: str) -> List[models.Country]:
    """
    Splits up the string of countries, and one by one.
    Maps it to the full country name.
    Checks the database if the country exists.
    If not - creates it, adds it to the database.
    Returns a list of the countries
    """
    new_countries: List[models.Country] = []
    if type(country) == float:
        return new_countries
    country = country.strip()
    countries = country.split("/")
    for i in countries:
        i = i.strip()
        i = utils.spellcheck_country(i)
        slug = slugify(i)
        db_country = models.Country.query.filter_by(slug=slug).first()

        if db_country and slug == db_country.slug:
            new_countries.append(db_country)
        else:
            new = models.Country.create(name=i, commit=False)
            new_countries.append(new)
    return new_countries
