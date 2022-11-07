from flask import Response, abort, jsonify
from slugify import slugify  # type: ignore
from ukbo import models
from ukbo.extensions import db
from sqlalchemy.sql import func


def list(page: int = 1, limit: int = 100) -> Response:
    """
    Paginated list of all distributors.
    """
    query = db.session.query(models.Distributor)
    data = query.order_by(models.Distributor.name.asc()).paginate(
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
    Get one distributor based on its slug.
    """
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    return data.as_dict()


def get_films(slug: str, page: int = 1, limit: int = 100) -> Response:
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
    data = query.order_by(models.Film.id.asc()).paginate(page, limit, False)

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

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


def search(search_query: str) -> Response:
    """
    Search distributors by name.
    """
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.name.ilike(f"%{search_query}%"))
    data = query.limit(10).all()

    return [] if data is None else [ix.as_dict() for ix in data]


def market_share(year: str=None) -> Response:
    """
    Gets the distributor market share for a year
    """
    query = db.session.query(
        func.extract('year', models.Film_Week.date),
        models.Distributor,
        func.sum(models.Film_Week.week_gross),
        )
    
    query = query.join(models.Distributor)
    query = query.group_by(models.Distributor)
    query = query.group_by(func.extract('year', models.Film_Week.date))
    query = query.order_by(func.extract('year', models.Film_Week.date).desc())

    if year is not None:
        query = query.filter(func.extract('year', models.Film_Week.date) == year)
    
    data = query.all()

    if data is None:
        abort(404)

    return jsonify(results=[
            dict(
                year=row[0],
                distributor=row[1].as_dict(),
                gross=row[2]
            ) for row in data
        ])
    