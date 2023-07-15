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


@country.route("/<slug>", methods=["GET"])
@cache.cached()
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


@country.route("/<slug>/boxoffice", methods=["GET"])
def get_box_office(slug: str) -> Response:
    """
    Get a countries box office history grouped by year.

    Arguments:
        slug: Country slug to return.

    Request Arguments (optional):
        limit: Number of years to backwards.

    Returns:
        JSON response of a countries box office history.
    """
    limit = request.args.get("limit", 1)

    return services.country.get_box_office(slug, int(limit))
