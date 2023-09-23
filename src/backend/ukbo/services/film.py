import uuid
from typing import Any, Dict, List, Optional

import flask_sqlalchemy
import pandas as pd
from flask import Response, abort, jsonify
from slugify import slugify  # type: ignore
from sqlalchemy import extract, func
from sqlalchemy.orm import joinedload
from ukbo import models, services
from ukbo.dto import (
    CountrySchema,
    DistributorSchema,
    FilmSchema,
    FilmSchemaStrict,
    FilmSchemaValues,
)
from ukbo.extensions import db
from ukbo.services.filters import QueryFilter


def list_all(sort: Optional[str], page: int = 1, limit: int = 100) -> Response:
    """
    Paginated list of all films.

    Args:
        sort: To sort by.
        page: Page number
        limit: Number of results per page

    Returns (JSON): Paginated list of films.
    """
    query = db.session.query(models.Film)

    # Apply sorting
    # Define the sorting options and their corresponding ordering expressions
    sorting_options = {
        "asc_name": models.Film.name.asc(),
        "desc_name": models.Film.name.desc(),
        "asc_box": func.max(models.Film_Week.total_gross).asc(),
        "desc_box": func.max(models.Film_Week.total_gross).desc(),
    }

    if sort is not None:
        sort_option = sorting_options.get(sort)
        if sort_option is None:
            # Handle invalid sorting option
            return jsonify(error="Invalid sorting option"), 400
        # Join the table when sorting by gross
        query = query.join(models.Film_Week).group_by(models.Film.id)
        query = query.order_by(sort_option)
    else:
        query = query.order_by(models.Film.name.asc())

    data = query.paginate(page=page, per_page=limit, error_out=False)

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
    countries: Optional[List[models.Country]],
    distributors: Optional[List[models.Distributor]],
) -> models.Film:
    """
    Add a film to the database.

    Checks the database if the film exists - returns the object.
    If not - creates it, adds it to the database and returns it.

    Args:
        film: Name of the film.
        distributors: List of Distributor objects.
        countries: List of country objects.

    Returns Film object.
    """
    film = film.strip()

    if distributors:
        query = db.session.query(models.Film).filter(models.Film.name == film)
        query = query.join(models.Film.distributors).filter(
            models.Distributor.id.in_(
                [distributor.id for distributor in distributors]
            )
        )
        instance = query.first()
    else:
        instance = (
            db.session.query(models.Film)
            .filter(models.Film.name == film)
            .first()
        )

    if instance:
        return instance

    distributors = distributors if distributors is not None else []
    countries = countries if countries is not None else []

    record = {
        "name": film,
        "distributors": distributors,
        "countries": countries,
    }

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
        if distributors:
            slug = slugify(f"{film}-{distributors[0].name}-{uuid.uuid4()}")
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
    query = add_filters(query, query_filter)

    # Execute the query to retrieve all films
    all_films = query.options(joinedload(models.Film.distributors)).all()

    # # Find the film with the highest total_gross
    if all_films:
        film_with_highest_gross = max(all_films, key=lambda film: film.gross)

        # Retrieve the highest total_gross value
        highest_gross_value = film_with_highest_gross.gross
    else:
        highest_gross_value = 0

    # Get unique search metadata
    distributors = unique_distributors(all_films)
    countries = unique_countries(all_films)

    # query to paginate
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
        "distributors": distributors,
        "countries": countries,
        "max_gross": highest_gross_value,
    }


def add_filters(
    query: flask_sqlalchemy.query.Query, query_filter: QueryFilter
) -> flask_sqlalchemy.query.Query:
    """
    Adds filters and sorting to a query if they are present.

    Args:
        query: The query that will be executed.
        query_filter: The set of filters to apply

    Returns: The query with filters applied.
    """
    if query_filter.distributor_ids is not None:
        query = query.join(models.distributors).join(models.Distributor)
        query = query.filter(
            models.Distributor.id.in_(query_filter.distributor_ids)
        )

    if query_filter.country_ids is not None:
        query = query.join(models.countries).join(models.Country)
        query = query.filter(models.Country.id.in_(query_filter.country_ids))

    if (
        query_filter.min_year is not None
        or query_filter.max_year is not None
        or query_filter.min_box is not None
        or query_filter.max_box is not None
        or query_filter.sort is not None
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

    # Apply sorting
    # Define the sorting options and their corresponding ordering expressions
    sorting_options = {
        "asc_name": models.Film.name.asc(),
        "desc_name": models.Film.name.desc(),
        "asc_box": func.max(models.Film_Week.total_gross).asc(),
        "desc_box": func.max(models.Film_Week.total_gross).desc(),
    }

    if query_filter.sort is not None:
        sort_option = sorting_options.get(query_filter.sort)
        if sort_option is not None:
            query = query.order_by(sort_option)

    return query


def unique_countries(films: List[models.Film]) -> List[Dict[str, Any]]:
    """
    Extract a set of countries from a list of films.
    """
    country_schema = CountrySchema()

    countries: List[Dict[str, Any]] = []
    for film in films:
        if film.countries:
            countries.extend(
                country_schema.dump(country) for country in film.countries
            )

    # Get unique countries and sort them
    unique = [dict(s) for s in {frozenset(d.items()) for d in countries}]
    return sorted(unique, key=lambda c: c["name"])


def unique_distributors(films: List[models.Film]) -> List[Dict[str, Any]]:
    """
    Extract a set of distributors from a list of films.
    """
    distributor_schema = DistributorSchema()

    distributors: List[Dict[str, Any]] = []
    for film in films:
        if film.distributors:
            distributors.extend(
                distributor_schema.dump(distributor)
                for distributor in film.distributors
            )

    # Get unique distributors and sort them.
    unique = [dict(s) for s in {frozenset(d.items()) for d in distributors}]
    return sorted(unique, key=lambda c: c["name"])


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
