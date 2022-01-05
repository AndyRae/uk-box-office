from typing import Any

from elasticsearch import Elasticsearch
from flask import Flask
from flask_apscheduler import APScheduler
from flask_caching import Cache
from flask_debugtoolbar import DebugToolbarExtension
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy

from . import settings

db = SQLAlchemy()
scheduler = APScheduler()
toolbar = DebugToolbarExtension()
cache = Cache()
limiter = Limiter(key_func=get_remote_address)


def create_app(test_config: Any = None) -> Flask:
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
    app.elasticsearch = (  # type: ignore
        Elasticsearch(
            [{"host": app.config["ELASTICSEARCH_URL"], "port": 9200}]
        )
        if app.config["ELASTICSEARCH_URL"]
        else None
    )

    with app.app_context():
        register_blueprints(app)
        register_cli(app)

        scheduler.start()

        return app


def register_extensions(app: Flask) -> None:
    from . import tasks

    db.init_app(app)
    scheduler.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)
    return None


def register_blueprints(app: Flask) -> None:
    from . import api, views

    app.register_blueprint(api.bp)
    app.register_blueprint(views.bp)
    return None


def register_cli(app: Flask) -> None:
    from . import cli

    app.cli.add_command(cli.init_db_command)
    app.cli.add_command(cli.fill_db_command)
    app.cli.add_command(cli.weekly_etl_command)
    app.cli.add_command(cli.backup_etl)
    app.cli.add_command(cli.rollback_etl_command)

    return None