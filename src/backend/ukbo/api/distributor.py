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


@distributor.route("/marketshare", methods=["GET"])
@cache.cached()
def market_share() -> Response:
    """
    Get distributors market share data for a time period
    If no time period is specified, all data is returned.

    Request Arguments (optional):
        start (str): Start date to filter by (YYYY-MM-DD).
        end (str): End date to filter by (YYYY-MM-DD).

    Returns:
        JSON response of distributors market share data.
    """
    start = request.args.get("start", None)
    end = request.args.get("end", None)
    if None in [start, end]:
        return services.market_share.get_distributor()

    return services.distributor.market_share_date(start, end)


@distributor.route("/marketshare/<year>", methods=["GET"])
def market_share_year(year: str) -> Response:
    """
    Get distributor market share for a year.

    Arguments:
        year: Year number to filter by.

    Returns:
        JSON response of distributors market share data.
    """
    try:
        int(year)
    except ValueError:
        return Response('{"error: "Year must be an integer."}', status=400)

    return services.distributor.market_share(year)


@distributor.route("/<slug>", methods=["GET"])
@cache.cached()
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
    sort = request.args.get("sort", None)

    # build sort filter
    sort_filter = services.filters.SortFilter(sort=sort)
    return services.distributor.get_films(slug, sort_filter, page, limit)


@distributor.route("/<slug>/boxoffice", methods=["GET"])
def get_box_office(slug: str) -> Response:
    """
    Get a distributor box office history grouped by year.

    Arguments:
        slug: Distributor slug to return.

    Request Arguments (optional):
        limit: Number of years to backwards.

    Returns:
        JSON response of a distributor box office history.
    """
    limit = request.args.get("limit", 1)

    return services.distributor.get_box_office(slug, int(limit))
