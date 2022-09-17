import json

from flask import jsonify
from flask.wrappers import Response
from ukbo import models
from ukbo.extensions import db

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

    next_page = f"/api?start={start + 1}" if data.has_next else ""
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
    return data
