from flask import Blueprint, jsonify, request
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
    response = services.country.list(start, limit)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@country.route("/<slug>")
def get(slug: str) -> Response:
    """
    Country detailview
    """
    response = jsonify(services.country.get(slug))
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@country.route("/<slug>/films")
def get_films(slug: str) -> Response:
    """
    Country detailview with films
    """
    start = int(request.args.get("start", 1))
    limit = int(request.args.get("limit", 100))
    return services.country.get_films(slug, start, limit)
