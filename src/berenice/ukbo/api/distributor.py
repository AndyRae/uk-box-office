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
    response = services.distributor.list(page, limit)
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
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    response = services.distributor.get_films(slug, page, limit)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
