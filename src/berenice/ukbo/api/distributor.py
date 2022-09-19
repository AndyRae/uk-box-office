from flask import Blueprint, jsonify, request
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
    response = services.distributor.list(start, limit)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@distributor.route("/<slug>")
def get(slug: str) -> Response:
    """
    Distributor detailview
    """
    response = jsonify(services.distributor.get(slug))
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@distributor.route("/<slug>/films")
def get_films(slug: str) -> Response:
    """
    Distributor detailview with films
    """
    start = int(request.args.get("start", 1))
    limit = int(request.args.get("limit", 100))
    return services.distributor.get_films(slug, start, limit)
