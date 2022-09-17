"""API access"""

from datetime import datetime
from typing import Any

from flask import Blueprint, current_app, jsonify, make_response, request
from flask.wrappers import Response
from ukbo import db, limiter, models, services  # type: ignore
from werkzeug.exceptions import abort

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
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    start = int(request.args.get("start", 1))
    return services.boxoffice.all(start_date, end_date, start)


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
