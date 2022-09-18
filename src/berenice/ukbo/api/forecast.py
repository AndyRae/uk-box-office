from flask import Blueprint
from flask.wrappers import Response
from ukbo import services

forecast = Blueprint("forecast", __name__)


@forecast.route("/")
def get() -> Response:
    """
    Forecast all data
    """
    f = services.forecast.Forecast()
    return f.get()
