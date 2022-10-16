"""API access"""

from datetime import datetime
from typing import Any

from flask import Blueprint, current_app, jsonify, make_response, request
from flask.wrappers import Response
from ukbo import limiter, services  # type: ignore
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


def to_date(date_string: str = "2000-01-20") -> datetime:
    """
    Converts date string to a date object.
    Helper function for the main api endpoint.
    """
    return datetime.strptime(date_string, "%Y-%m-%d")
