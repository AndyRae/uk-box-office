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
        sort (string): Field and order to sort by.

    Returns:
        JSON response of films.
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    sort = request.args.get("sort", None)

    return services.film.list_all(sort, page, limit)


@film.route("slug/<slug>")
@cache.cached()
def get(slug: str) -> Response:
    """
    Get one film detail.

    Args:
        slug: Film slug to return.

    Returns:
        JSON response of a film.
    """
    return jsonify(services.film.get(slug))


@film.route("id/<id>")
@cache.cached()
def get_id(id: int) -> Response:
    """
    Get one film detail.

    Args:
        slug: Film id to return.

    Returns:
        JSON response of a film.
    """
    return jsonify(services.film.get_by_id(id))
