from flask import Blueprint

from . import api, boxoffice, country, distributor, film, forecast

api_bp = Blueprint("api2", __name__)

api_bp.register_blueprint(boxoffice.boxoffice, url_prefix="/boxoffice")
api_bp.register_blueprint(film.film, url_prefix="/film")
