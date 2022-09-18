from flask import Blueprint, request
from flask.wrappers import Response
from ukbo import services

film = Blueprint("film", __name__)


@film.route("/")
def all() -> Response:
    """
    Main endpoint for box office data
    """
    start = int(request.args.get("start", 1))
    limit = int(request.args.get("limit", 100))
    return services.film.list(start, limit)


@film.route("/<slug>")
def get(slug: str) -> Response:
    """
    Film detailview
    """
    return services.film.get(slug)
