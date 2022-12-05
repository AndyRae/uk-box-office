from typing import Tuple

from flask import Blueprint
from ukbo import cache

root = Blueprint("root", __name__)


@root.route("/")
@cache.cached()
def index() -> Tuple[str, int]:
    """
    Root endpoint.
    """
    return (".", 200)
