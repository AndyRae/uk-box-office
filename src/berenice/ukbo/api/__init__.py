from flask import Blueprint, Flask
from flask_restful import Api, Resource, url_for

from . import api, boxoffice

api_bp = Blueprint("api2", __name__)

controllers = Api(api_bp)

controllers.add_resource(boxoffice.All, "/boxoffice/")
controllers.add_resource(boxoffice.Top, "/boxoffice/top")
