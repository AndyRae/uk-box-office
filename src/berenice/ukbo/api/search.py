from flask import Blueprint, request, jsonify
from flask.wrappers import Response
from ukbo import services

search = Blueprint("search", __name__)

@search.route("")
def all() -> Response:
    """
    Main search endpoint for everything
    """
    query = request.args.get("q", "")

    films = services.film.search(query)
    distributors = services.distributor.search(query)
    countries = services.country.search(query)

    return jsonify(
        films=films,
        distributors=distributors,
        countries=countries,
    )



@search.route("/films")
def films() -> Response:
    """
    Search films
    """
    pass