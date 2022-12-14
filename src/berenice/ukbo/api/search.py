from flask import Blueprint, jsonify, request
from flask.wrappers import Response
from ukbo import services

search = Blueprint("search", __name__)


@search.route("")
def all() -> Response:
    """
    Search everything (films, distributors, countries).

    Request Arguments(optional):
        q (str): Search query.

    Returns:
        JSON response of search results.
    """
    query = request.args.get("q", None)

    if not query:
        return jsonify(
            films=[],
            distributors=[],
            countries=[],
        )

    films = services.film.search(query)
    distributors = services.distributor.search(query)
    countries = services.country.search(query)

    return jsonify(
        films=films,
        distributors=distributors,
        countries=countries,
    )
