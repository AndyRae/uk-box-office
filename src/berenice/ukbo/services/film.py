from typing import List

from flask import Response, abort, jsonify
from slugify import slugify  # type: ignore
from ukbo import models
from ukbo.extensions import db, ma


class FilmSchema(ma.SQLAlchemyAutoSchema):
    """
    Schema to dump - currently unused.
    """

    class Meta:
        model = models.Film
        include_fk = True

    distributor_name = ma.Function(lambda obj: obj.distributor.name)


def list(page: int, limit: int = 100) -> Response:
    """
    Paginated list of all films.
    """
    query = db.session.query(models.Film)
    data = query.order_by(models.Film.name.asc()).paginate(
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
        results=[ix.as_dict(weeks=False) for ix in data.items],
    )


def get(slug: str) -> Response:
    """
    Get one film based on its slug.
    """
    query = db.session.query(models.Film)
    query = query.filter(models.Film.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    return data.as_dict()


def add_film(
    film: str,
    distributor: models.Distributor,
    countries: List[models.Country],
) -> models.Film:
    """
    Checks the database if the film exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    film = film.strip()

    if instance := models.Film.query.filter_by(
        name=film, distributor=distributor
    ).first():
        return instance

    new = models.Film(name=film, distributor=distributor, countries=countries)
    try:
        new.save()
    except Exception:
        # Film exists but with a different distributor
        print(f"Duplicate {film}")
        db.session.rollback()
        slug = slugify(f"{film}-{distributor.name}")
        new.slug = slug
        new.save()
    return new


def delete_film(id: int) -> None:
    """
    Delete a film and all its associated data.
    """
    query = db.session.query(models.Film)
    query = query.filter(models.Film.id == id)
    data = query.first()
    if data is None:
        abort(404)
    data.delete()
    db.session.commit()


def search(search_query: str) -> Response:
    """
    Search films by name.
    """
    query = db.session.query(models.Film)
    query = query.filter(models.Film.name.ilike(f"%{search_query}%"))
    data = query.limit(15).all()

    return [] if data is None else [ix.as_dict(weeks=False) for ix in data]
