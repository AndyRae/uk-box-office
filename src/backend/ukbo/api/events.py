from flask import Blueprint, jsonify
from flask.wrappers import Response
from ukbo import cache, services

events = Blueprint("events", __name__)


@events.route("/", methods=["GET"])
def all() -> Response:
    """
    Overview of all events.

    Returns:
        JSON response of events.
    """
    return services.events.overview()


@events.route("/<id>", methods=["GET"])
@cache.cached()
def get(id: int) -> Response:
    """
    Get one event.

    Args:
        id: Event id to return.

    Returns:
        JSON response of an event.
    """
    return jsonify(services.events.get(id))
