from flask import Blueprint, jsonify, request
from flask.wrappers import Response
from ukbo import cache, services

film = Blueprint("film", __name__)


@film.route("/")
def all() -> Response:
    """
    Get a list of all films.

    Request arguments are passed to the service layer.

    Request Arguments (optional):
        page (int): Page number to return.
        limit (int): Number of films to return.

    Returns:
        JSON response of films.
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    return services.film.list(page, limit)


@cache.cached()
@film.route("/<slug>")
def get(slug: str) -> Response:
    """
    Get one film detail.

    Args:
        slug: Film slug to return.

    Returns:
        JSON response of a film.
    """
    return jsonify(services.film.get(slug))
