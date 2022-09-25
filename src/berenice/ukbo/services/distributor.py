from flask import Response, abort, jsonify
from slugify import slugify  # type: ignore
from ukbo import models
from ukbo.extensions import db


def list(start: int, limit: int = 100) -> Response:
    """
    Paginated list of all distributors.
    """
    query = db.session.query(models.Distributor)
    data = query.order_by(models.Distributor.name.asc()).paginate(
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
    Get one distributor based on its slug.
    """
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    return data.as_dict()


def get_films(slug: str, start: int = 1, limit: int = 100) -> Response:
    """
    Get a distributor list of films from slug.
    """
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    distributor = query.first()

    query = db.session.query(models.Film).options(
        db.joinedload(models.Film.weeks)
    )
    query = query.join(models.Distributor)

    query = query.filter(models.Distributor.slug == slug)
    data = query.order_by(models.Film.id.asc()).paginate(start, limit, False)

    next_page = f"/api?start={start + 1}" if data.has_next else ""
    previous_page = f"/api?start={start - 1}" if data.has_prev else ""

    return jsonify(
        distributor=distributor.as_dict(),
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[ix.as_dict() for ix in data.items],
    )


def add_distributor(distributor: str) -> models.Distributor:
    """
    Checks the database if the distributor exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    distributor = distributor.strip()
    slug = slugify(distributor)

    if instance := models.Distributor.query.filter_by(slug=slug).first():
        return instance
    return models.Distributor.create(name=distributor, commit=False)
