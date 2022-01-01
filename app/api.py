"""API access"""

from datetime import datetime
from typing import Any, Dict, List

from flask import Blueprint, jsonify, make_response, request
from flask.wrappers import Response
from werkzeug.exceptions import abort

from . import cache, db, models

bp = Blueprint("api", __name__)


@bp.errorhandler(404)
def page_not_found(e: Any) -> Response:
    return make_response(jsonify({"error": "Not found"}), 404)


@bp.route("/api")
def api() -> Response:
    """
    Main API endpoint - returns box office data.
    Can filter on start date, end date - format: 2020-08-31
    """
    query = db.session.query(models.Week)

    start_date = request.args.get("start_date")
    if start_date is not None:
        query = query.filter(models.Week.date >= to_date(start_date))

    end_date = request.args.get("end_date")
    if end_date is not None:
        query = query.filter(models.Week.date <= to_date(end_date))

    data = query.order_by(models.Week.date.desc()).all()
    if data is None:
        abort(404)

    results = [ix.as_dict() for ix in data]
    return jsonify(
        get_paginated_list(
            results,
            "/api",
            start=int(request.args.get("start", 1)),
            limit=int(request.args.get("limit", 20)),
        )
    )


@bp.route("/api/films")
def films() -> Response:
    """
    Films endpoint - returns list of films data by title.
    """
    query = db.session.query(models.Film)
    if "title" in request.args:
        title = str(request.args["title"])
        query = query.filter(models.Film.name == title)
    data = query.order_by(models.Film.name.asc()).all()
    if data is None:
        abort(404)

    results = [ix.as_dict() for ix in data]
    return jsonify(
        get_paginated_list(
            results,
            "/api",
            start=int(request.args.get("start", 1)),
            limit=int(request.args.get("limit", 20)),
        )
    )


@bp.route("/api/film")
def film() -> Response:
    """
    Film endpoint - returns single film data by title.
    """
    if "title" in request.args:
        title = str(request.args["title"])

        query = db.session.query(models.Film)
        query = query.filter(models.Film.name == title)
        data = query.first()

        if data is None:
            abort(404)
        return data.as_dict()
    abort(404)


@bp.route("/api/distributors")
def distributors() -> Response:
    """
    Distributors endpoint - returns list of distributors by name
    """
    query = db.session.query(models.Distributor)
    if "name" in request.args:
        name = str(request.args["name"])
        query = query.filter(models.Distributor.name == name)
    data = query.order_by(models.Distributor.name.asc()).all()
    if data is None:
        abort(404)

    results = [ix.as_dict() for ix in data]
    return jsonify(
        data=get_paginated_list(
            results,
            "/api/distributor",
            start=int(request.args.get("start", 1)),
            limit=int(request.args.get("limit", 20)),
        )
    )


def to_date(date_string: str = "2000-01-01") -> datetime:
    """
    Converts date string to a date object.
    Helper function for the main api endpoint.
    """
    return datetime.strptime(date_string, "%Y-%m-%d")


def get_paginated_list(
    results: List[Any], url: str, start: int, limit: int
) -> Dict[str, Any]:
    """
    Pagination for the API.
    Returns a dict of the results, with additions
    """
    # check if page exists
    count = len(results)

    if count < start:
        abort(404)
    # make response
    obj = {
        "start": start,
        "limit": limit,
        "count": count,
        "previous": str,
        "next": str,
    }
    # make URLs
    # make previous url
    if start == 1:
        obj["previous"] = ""
    else:
        start_copy = max(1, start - limit)
        limit_copy = start - 1
        obj["previous"] = url + "?start=%d&limit=%d" % (start_copy, limit_copy)
    # make next url
    if start + limit > count:
        obj["next"] = ""
    else:
        start_copy = start + limit
        obj["next"] = url + "?start=%d&limit=%d" % (start_copy, limit)
    # finally extract result according to bounds
    obj["results"] = results[(start - 1) : (start - 1 + limit)]
    return obj
