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
    return services.boxoffice.all(start_date, end_date, start)


@boxoffice.route("/top")
def get() -> Response:
    """
    Top films all time endpoint
    """
    return services.boxoffice.top()
