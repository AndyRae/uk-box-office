from flask import Blueprint, request
from flask.wrappers import Response
from ukbo import services

boxoffice = Blueprint("boxoffice", __name__)


@boxoffice.route("/all")
def all() -> Response:
    """
    Main endpoint for box office data
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    page = int(request.args.get("page", 1))
    return services.boxoffice.all(start, end, page)


@boxoffice.route("/topfilms")
def get() -> Response:
    """
    Top films all time endpoint
    """
    return services.boxoffice.topfilms()


@boxoffice.route("/summary")
def summary() -> Response:
    """
    Get summarised box office statistics for a time period.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    limit = int(request.args.get("limit", None))
    return services.boxoffice.summary(start, end, limit)


@boxoffice.route("/previous")
def previous() -> Response:
    """
    Get previous year box office statistics for a time period.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    return services.boxoffice.previous(start, end)


@boxoffice.route("/topline")
def topline() -> Response:
    """
    Get topline box office data for a time period.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    page = int(request.args.get("page", 1))
    return services.boxoffice.topline(start, end, page)
