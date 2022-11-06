from flask import Blueprint, jsonify, request
from flask.wrappers import Response
from ukbo import services

distributor = Blueprint("distributor", __name__)


@distributor.route("/")
def all() -> Response:
    """
    Main endpoint for box office data
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    return services.distributor.list(page, limit)


@distributor.route("/marketshare")
def market_share() -> Response:
    """
    Get distributor market share overall.
    """
    return services.distributor.market_share()


@distributor.route("/marketshare/<year>")
def market_share_year(year: str) -> Response:
    """
    Get distributor market share for a year.
    """
    return services.distributor.market_share(year)


@distributor.route("/<slug>")
def get(slug: str) -> Response:
    """
    Distributor detailview
    """
    return jsonify(services.distributor.get(slug))


@distributor.route("/<slug>/films")
def get_films(slug: str) -> Response:
    """
    Distributor detailview with films
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    return services.distributor.get_films(slug, page, limit)
