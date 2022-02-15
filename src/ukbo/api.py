"""API access"""

from datetime import datetime
from typing import Any

from flask import Blueprint, current_app, jsonify, make_response, request
from flask.wrappers import Response
from werkzeug.exceptions import abort

from ukbo import db, limiter, models

bp = Blueprint("api", __name__)


@bp.errorhandler(404)
def page_not_found(e: Any) -> Response:
    return make_response(jsonify({"error": "Not found"}), 404)


@bp.route("/api")
@limiter.limit(current_app.config.get("RATELIMIT_API"))
def api() -> Response:
    """
    Main API endpoint - returns paginated box office data.
    Can filter on start date, end date - format: 2020-08-31
    """
    query = db.session.query(models.Film_Week)

    start_date = request.args.get("start_date")
    if start_date is not None:
        query = query.filter(models.Film_Week.date >= to_date(start_date))

    end_date = request.args.get("end_date")
    if end_date is not None:
        query = query.filter(models.Film_Week.date <= to_date(end_date))

    start = int(request.args.get("start", 1))

    data = query.order_by(models.Film_Week.date.desc()).paginate(
        page=start, per_page=150, error_out=False
    )
    if data is None:
        abort(404)

    next = f"/api?start={start + 1}" if data.has_next else ""
    previous = f"/api?start={start - 1}" if data.has_prev else ""
    return jsonify(
        count=data.total,
        next=next,
        previous=previous,
        results=[ix.as_dict() for ix in data.items],
    )


@bp.route("/api/films")
def films() -> Response:
    """
    Films endpoint - returns list of films data by title.
    Deprecated
    """
    return jsonify(results="None")
    # query = db.session.query(models.Film)
    # if "title" in request.args:
    #     title = str(request.args["title"])
    #     query = query.filter(models.Film.name == title)
    # data = query.order_by(models.Film.name.asc()).all()
    # if data is None:
    #     abort(404)

    # results = [ix.as_dict() for ix in data]
    # return jsonify(
    #     get_paginated_list(
    #         results,
    #         "/api",
    #         start=int(request.args.get("start", 1)),
    #         limit=int(request.args.get("limit", 20)),
    #     )
    # )


@bp.route("/api/film")
def film() -> Response:
    """
    Film endpoint - returns single film data by title.
    Deprecated
    """
    return jsonify(results="None")
    # if "title" in request.args:
    #     title = str(request.args["title"])

    #     query = db.session.query(models.Film)
    #     query = query.filter(models.Film.name == title)
    #     data = query.first()

    #     if data is None:
    #         abort(404)
    #     return data.as_dict()
    # abort(404)


@bp.route("/api/distributors")
def distributors() -> Response:
    """
    Distributors endpoint - returns list of distributors by name
    Deprecated
    """
    return jsonify(results="None")
    # query = db.session.query(models.Distributor)
    # if "name" in request.args:
    #     name = str(request.args["name"])
    #     query = query.filter(models.Distributor.name == name)
    # data = query.order_by(models.Distributor.name.asc()).all()
    # if data is None:
    #     abort(404)

    # results = [ix.as_dict() for ix in data]
    # return jsonify(
    #     data=get_paginated_list(
    #         results,
    #         "/api/distributor",
    #         start=int(request.args.get("start", 1)),
    #         limit=int(request.args.get("limit", 20)),
    #     )
    # )


def to_date(date_string: str = "2000-01-20") -> datetime:
    """
    Converts date string to a date object.
    Helper function for the main api endpoint.
    """
    return datetime.strptime(date_string, "%Y-%m-%d")
