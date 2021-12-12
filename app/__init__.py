import os

from flask import Flask
from flask_apscheduler import APScheduler
from flask_sqlalchemy import SQLAlchemy
from flask_debugtoolbar import DebugToolbarExtension
from elasticsearch import Elasticsearch
from . import settings


db = SQLAlchemy()
scheduler = APScheduler()
toolbar = DebugToolbarExtension()


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        # load the instance config - if it exists, when not testing
        app.config.from_object(settings.DevelopmentConfig)

        # Debug toolbar
        toolbar.init_app(app)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    register_extensions(app)

    # Elasticsearch
    app.elasticsearch = (
        Elasticsearch([{"host": app.config["ELASTICSEARCH_URL"], "port": 9200}])
        if app.config["ELASTICSEARCH_URL"]
        else None
    )

    with app.app_context():
        # from . import tasks

        register_blueprints(app)
        register_cli(app)

        scheduler.start()

        return app


def register_extensions(app):
    from . import tasks

    # Database
    db.init_app(app)

    # Scheduler
    scheduler.init_app(app)

    return None


def register_blueprints(app):
    from . import api, views

    app.register_blueprint(api.bp)
    app.register_blueprint(views.bp)
    return None


def register_cli(app):
    from . import cli

    app.cli.add_command(cli.fill_db_command)
    app.cli.add_command(cli.init_db_command)

    return None
