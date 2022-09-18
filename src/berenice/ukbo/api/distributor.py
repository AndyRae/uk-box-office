from flask import Blueprint, request
from flask.wrappers import Response
from ukbo import services

distributor = Blueprint("distributor", __name__)


@distributor.route("/")
def all() -> Response:
    """
    Main endpoint for box office data
    """
    start = int(request.args.get("start", 1))
    limit = int(request.args.get("limit", 100))
    return services.distributor.list(start, limit)


@distributor.route("/<slug>")
def get(slug: str) -> Response:
    """
    Distributor detailview
    """
    return services.distributor.get(slug)


@distributor.route("/<slug>/films")
def get_films(slug: str) -> Response:
    """
    Distributor detailview with films
    """
    start = int(request.args.get("start", 1))
    limit = int(request.args.get("limit", 100))
    return services.distributor.get_films(slug, start, limit)
