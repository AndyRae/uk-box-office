from flask import Blueprint, jsonify, request
from flask.wrappers import Response
from ukbo import services

film = Blueprint("film", __name__)


@film.route("/")
def all() -> Response:
    """
    Main endpoint for box office data
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 100))
    return services.film.list(page, limit)


@film.route("/<slug>")
def get(slug: str) -> Response:
    """
    Film detailview
    """
    return jsonify(services.film.get(slug))
