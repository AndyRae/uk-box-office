from flask import Blueprint

from . import api, boxoffice

api_bp = Blueprint("api2", __name__)

api_bp.register_blueprint(boxoffice.boxoffice, url_prefix="/boxoffice")
