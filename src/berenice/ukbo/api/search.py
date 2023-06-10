from flask import Blueprint, jsonify, request
from flask.wrappers import Response
from ukbo import services

search = Blueprint("search", __name__)


@search.route("/", methods=["GET"])
def all() -> Response:
    """
    Search everything (films, distributors, countries).

    Request Arguments(optional):
        q (str): Search query.

    Returns:
        JSON response of search results.
    """
    query = request.args.get("q", None)
    page = request.args.get("p", 1)

    if not query:
        return jsonify(
            films=[],
            distributors=[],
            countries=[],
        )

    if len(query) < 3:
        return "Query length is 3 characters or more.", 400

    # Build filters
    distributor = request.args.get("distributor", None)
    country = request.args.get("country", None)
    min_year = request.args.get("min_year", None)
    max_year = request.args.get("max_year", None)
    min_box = request.args.get("min_box", None)
    max_box = request.args.get("max_box", None)

    # Split the comma-separated list of country IDs into a list
    if country is not None:
        country = [int(id) for id in country.split(",")]

    if distributor is not None:
        distributor = [int(id) for id in distributor.split(",")]

    query_filter = services.filters.QueryFilter(
        distributor_id=distributor,
        country_ids=country,
        min_year=min_year,
        max_year=max_year,
        min_box=min_box,
        max_box=max_box,
    )

    films = services.film.search(query, query_filter, page=int(page))
    distributors = services.distributor.search(query)
    countries = services.country.search(query)

    return jsonify(
        films=films,
        distributors=distributors,
        countries=countries,
    )


@search.route("/film", methods=["GET"])
def film_search() -> Response:
    """
    Search endpoint for films.

    Request Arguments(optional):
        q (str): Search query.

    Returns:
        JSON response of search results.
    """
    query = request.args.get("q", None)

    return (
        services.film.partial_search(query, 10)
        if query
        else Response('{"error": "Missing arguments"}', status=400)
    )
