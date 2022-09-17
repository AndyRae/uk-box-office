from flask import Blueprint, Flask
from flask.wrappers import Response
from flask_restful import Api, Resource, url_for
from ukbo import services


class All(Resource):
    def get(
        self: Resource,
        start_date: str = None,
        end_date: str = None,
        start: int = 1,
    ) -> Response:
        return services.boxoffice.all(start_date, end_date, start)


class Top(Resource):
    def get(self: Resource) -> Response:
        return services.boxoffice.top()
