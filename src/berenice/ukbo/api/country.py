from flask import Blueprint, request
from flask.wrappers import Response
from ukbo import services

country = Blueprint("country", __name__)


@country.route("/")
def all() -> Response:
    """
    List all countries
    """
    start = int(request.args.get("start", 1))
    limit = int(request.args.get("limit", 100))
    return services.country.list(start, limit)


@country.route("/<slug>")
def get(slug: str) -> Response:
    """
    Country detailview
    """
    return services.country.get(slug)


@country.route("/<slug>/films")
def get_films(slug: str) -> Response:
    """
    Country detailview with films
    """
    start = int(request.args.get("start", 1))
    limit = int(request.args.get("limit", 100))
    return services.country.get_films(slug, start, limit)
