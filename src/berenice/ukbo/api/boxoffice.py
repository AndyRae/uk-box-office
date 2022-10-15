from flask import Blueprint, request
from flask.wrappers import Response
from ukbo import services

boxoffice = Blueprint("boxoffice", __name__)


@boxoffice.route("/all")
def all() -> Response:
    """
    Main endpoint for box office data
    """
    start_date = request.args.get("start_date", None)
    end_date = request.args.get("end_date", None)
    start = int(request.args.get("start", 1))
    response = services.boxoffice.all(start_date, end_date, start)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@boxoffice.route("/top")
def get() -> Response:
    """
    Top films all time endpoint
    """
    response = services.boxoffice.top()
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@boxoffice.route("/summary")
def summary() -> Response:
    """
    Get summarised box office statistics for a time period.
    """
    start_date = request.args.get("start_date", None)
    end_date = request.args.get("end_date", None)
    limit = int(request.args.get("limit", None))
    response = services.boxoffice.summary(start_date, end_date, limit)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@boxoffice.route("/previous")
def previous() -> Response:
    """
    Get previous year box office statistics for a time period.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    response = services.boxoffice.previous(start, end)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@boxoffice.route("/topline")
def topline() -> Response:
    """
    Get topline box office data for a time period.
    """
    start_date = request.args.get("start_date", None)
    end_date = request.args.get("end_date", None)
    start = int(request.args.get("start", 1))
    response = services.boxoffice.topline(start_date, end_date, start)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
