from flask import Blueprint, jsonify, request
from flask.wrappers import Response
from ukbo import cache, services

country = Blueprint("country", __name__)


@country.route("/", methods=["GET"])
def all() -> Response:
    """
    List all countries.

    Request arguments are passed to the service layer.

    Request Arguments (optional):
        page: Page number to return.
        limit: Number of countries to return.

    Returns:
        JSON response of countries.
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    return services.country.list(page, limit)


@cache.cached()
@country.route("/<slug>", methods=["GET"])
def get(slug: str) -> Response:
    """
    Get one country.

    Args:
        slug: Country slug to return.

    Returns:
        JSON response of a country.
    """
    return jsonify(services.country.get(slug))


@country.route("/<slug>/films", methods=["GET"])
def get_films(slug: str) -> Response:
    """
    Get one country and its films.

    Args:
        slug: Country slug to return.

    Request Arguments (optional):
        page (int): Page number to return.
        limit (int): Number of films to return.

    Returns:
        JSON response of a country and its films.
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    return services.country.get_films(slug, page, limit)
