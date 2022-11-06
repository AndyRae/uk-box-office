from flask import Blueprint

from . import api, boxoffice, country, distributor, film

api_bp = Blueprint("api2", __name__)

api_bp.register_blueprint(boxoffice.boxoffice, url_prefix="/boxoffice")
api_bp.register_blueprint(film.film, url_prefix="/film")
api_bp.register_blueprint(distributor.distributor, url_prefix="/distributor")
api_bp.register_blueprint(country.country, url_prefix="/country")
