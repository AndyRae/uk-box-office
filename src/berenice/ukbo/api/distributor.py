from flask import Blueprint, jsonify, request
from flask.wrappers import Response
from ukbo import cache, services

distributor = Blueprint("distributor", __name__)


@distributor.route("/", methods=["GET"])
def all() -> Response:
    """
    Get a list of distributors.

    Request Arguments(optional):
        page (int): Page number to return.
        limit (int): Number of distributors to return.

    Returns:
        JSON response of distributors.
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    return services.distributor.list(page, limit)


@cache.cached()
@distributor.route("/marketshare", methods=["GET"])
def market_share() -> Response:
    """
    Get distributors market share data for all time.

    Returns:
        JSON response of distributors market share data.
    """
    return services.distributor.market_share()


@distributor.route("/marketshare/<year>", methods=["GET"])
def market_share_year(year: str) -> Response:
    """
    Get distributor market share for a year.

    Arguments:
        year: Year number to filter by.

    Returns:
        JSON response of distributors market share data.
    """
    return services.distributor.market_share(year)


@cache.cached()
@distributor.route("/<slug>", methods=["GET"])
def get(slug: str) -> Response:
    """
    Get one distributor details.

    Arguments:
        slug: Distributor slug to return.

    Returns:
        JSON response of a distributor.
    """
    return jsonify(services.distributor.get(slug))


@distributor.route("/<slug>/films", methods=["GET"])
def get_films(slug: str) -> Response:
    """
    Get one distributor and its films.

    Arguments:
        slug: Distributor slug to return.

    Request Arguments (optional):
        page: Page number to return.
        limit: Number of films to return.

    Returns:
        JSON response of a distributor and its films.
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    return services.distributor.get_films(slug, page, limit)
