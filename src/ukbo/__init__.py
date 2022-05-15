from typing import Any

from elasticsearch import Elasticsearch
from flask import Flask
from flask_apscheduler import APScheduler
from flask_caching import Cache
from flask_debugtoolbar import DebugToolbarExtension
from flask_flatpages import FlatPages
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
scheduler = APScheduler()
pages = FlatPages()
toolbar = DebugToolbarExtension()
cache = Cache()
limiter = Limiter(key_func=get_remote_address)


def create_app(config: str = None) -> Flask:
    app = Flask(__name__, instance_relative_config=True)

    from . import settings

    if config == "production":
        app.config.from_object(settings.Config)

    elif config == "dev":
        app.config.from_object(settings.DevelopmentConfig)

        # Debug toolbar
        toolbar.init_app(app)
    else:
        app.config.from_object(settings.TestConfig)

    register_extensions(app)
    scheduler.init_app(app)

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

        from . import tasks
        scheduler.start()

        return app


def register_extensions(app: Flask) -> None:

    db.init_app(app)
    # scheduler.init_app(app)
    pages.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)
    return None


def register_blueprints(app: Flask) -> None:
    from . import api, sitemap, views

    app.register_blueprint(api.bp)
    app.register_blueprint(sitemap.bp)
    app.register_blueprint(views.bp)
    return None


def register_cli(app: Flask) -> None:
    from . import cli

    app.cli.add_command(cli.init_db_command)
    app.cli.add_command(cli.fill_db_command)
    app.cli.add_command(cli.test_db_command)
    app.cli.add_command(cli.weekly_etl_command)
    app.cli.add_command(cli.backup_etl_command)
    app.cli.add_command(cli.rollback_etl_command)
    app.cli.add_command(cli.build_static_command)
    app.cli.add_command(cli.forecast_command)

    return None
