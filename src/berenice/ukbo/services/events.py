from typing import List

from flask import Response, abort, jsonify
from ukbo import models
from ukbo.dto import EventSchema
from ukbo.extensions import db


def overview() -> Response:
    """
    Get an overview of all events.

    Returns (JSON): Overview of events.
    """
    ETLState = (
        db.session.query(models.Event)
        .filter(models.Event.area == models.Area.ETL)
        .order_by(models.Event.date.desc())
        .first()
    )

    ForecastState = (
        db.session.query(models.Event)
        .filter(models.Event.area == models.Area.Forecast)
        .order_by(models.Event.date.desc())
        .first()
    )

    ArchiveState = (
        db.session.query(models.Event)
        .filter(models.Event.area == models.Area.Archive)
        .order_by(models.Event.date.desc())
        .first()
    )

    latest = list(page=1, limit=10).get_json()

    event_schema = EventSchema()  # type: ignore

    return jsonify(
        ETL=event_schema.dump(ETLState),
        Forecast=event_schema.dump(ForecastState),
        Archive=event_schema.dump(ArchiveState),
        latest=latest,
    )


def list(page: int = 1, limit: int = 10) -> Response:
    """
    Get a paginated list of all events.

    Args:
        page: Page number
        limit: Number of results per page

    Returns (JSON): Paginated list of events.
    """
    query = db.session.query(models.Event)
    data = query.order_by(models.Event.date.desc()).paginate(
        page=page, per_page=limit, error_out=False
    )

    if data is None:
        abort(404)

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    event_schema = EventSchema()  # type: ignore

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[event_schema.dump(ix) for ix in data.items],
    )


def get(id: int) -> Response:
    """
    Get one event based on its slug.

    Args:
        id: id of the Event to get.

    Returns (JSON): Event data.
    """
    query = db.session.query(models.Event)
    query = query.filter(models.Event.id == id)
    data = query.first()

    if data is None:
        abort(404)

    event_schema = EventSchema()  # type: ignore

    return event_schema.dump(data)
