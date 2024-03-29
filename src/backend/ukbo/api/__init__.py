from flask import Blueprint

"""
Blueprints for the API layer of the application.

Blueprints are registered in the app factory.

"""

from . import boxoffice, country, distributor, events, film, root, search

api_bp = Blueprint("api", __name__)

api_bp.register_blueprint(boxoffice.boxoffice, url_prefix="/boxoffice")
api_bp.register_blueprint(film.film, url_prefix="/film")
api_bp.register_blueprint(distributor.distributor, url_prefix="/distributor")
api_bp.register_blueprint(country.country, url_prefix="/country")
api_bp.register_blueprint(search.search, url_prefix="/search")
api_bp.register_blueprint(events.events, url_prefix="/events")


root_bp = Blueprint("root", __name__)

root_bp.register_blueprint(root.root, url_prefix="/")
