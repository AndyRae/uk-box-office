import json

from flask import jsonify
from flask.wrappers import Response
from ukbo import models
from ukbo.extensions import db
from sqlalchemy.sql import func

from . import utils


def all(
    start_date: str = None, end_date: str = None, start: int = 1
) -> Response:
    """
    Main API endpoint - returns paginated box office data.
    Can filter on start date, end date - format: 2020-08-31
    """
    query = db.session.query(models.Film_Week)

    if start_date is not None:
        query = query.filter(
            models.Film_Week.date >= utils.to_date(start_date)
        )

    if end_date is not None:
        query = query.filter(models.Film_Week.date <= utils.to_date(end_date))

    data = query.order_by(models.Film_Week.date.desc()).paginate(
        page=start, per_page=150, error_out=False
    )
    if data is None:
        return {"none"}

    next_page = (start + 1) if data.has_next else ""
    previous_page = f"/api?start={start - 1}" if data.has_prev else ""

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[ix.as_dict() for ix in data.items],
    )


def top() -> Response:
    """
    Top films all time
    """
    path = "./data/top_films_data.json"
    with open(path) as json_file:
        data = json.load(json_file)
    return jsonify(data)


def summary(start_date: str = None, end_date: str = None) -> Response:
    """
    Return summarised box office statistics for a time range.
    """
    query = db.session.query(
        func.sum(models.Week.week_gross), 
        func.sum(models.Week.weekend_gross), 
        func.sum(models.Week.number_of_releases), 
        func.max(models.Week.number_of_cinemas)
        )

    if start_date is not None:
        query = query.filter(
            models.Week.date >= utils.to_date(start_date)
        )

    if end_date is not None:
        query = query.filter(models.Week.date <= utils.to_date(end_date))

    data = query.all()

    return jsonify(results=[tuple(row) for row in data])


def topline(start_date: str = None, end_date: str = None, start: int = 1) -> Response:
    """
    Return topline box office data for a time range.
    """
    query = db.session.query(models.Week)

    if start_date is not None:
        query = query.filter(
            models.Week.date >= utils.to_date(start_date)
        )

    if end_date is not None:
        query = query.filter(models.Week.date <= utils.to_date(end_date))

    data = query.order_by(models.Week.date.desc()).paginate(
        page=start, per_page=150, error_out=False
    )
    if data is None:
        return {"none"}

    next_page = (start + 1) if data.has_next else ""
    previous_page = (start - 1) if data.has_prev else ""

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[ix.as_dict() for ix in data.items],
    )
