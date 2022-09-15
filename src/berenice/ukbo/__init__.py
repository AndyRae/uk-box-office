from elasticsearch import Elasticsearch
from flask import Flask
from ukbo.extensions import cache, db, limiter, pages, scheduler, toolbar


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

    app.elasticsearch = (  # type: ignore
        Elasticsearch(app.config["ELASTICSEARCH_URL"])
        if app.config["ELASTICSEARCH_URL"]
        else None
    )

    with app.app_context():
        register_blueprints(app)
        register_cli(app)

        from .etl import tasks

        scheduler.start()

        return app


def register_extensions(app: Flask) -> None:

    db.init_app(app)
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
    from .etl import commands

    app.cli.add_command(commands.init_db_command)
    app.cli.add_command(commands.fill_db_command)
    app.cli.add_command(commands.test_db_command)
    app.cli.add_command(commands.seed_films_command)
    app.cli.add_command(commands.seed_box_office_command)
    app.cli.add_command(commands.weekly_etl_command)
    app.cli.add_command(commands.backup_etl_command)
    app.cli.add_command(commands.rollback_etl_command)
    app.cli.add_command(commands.rollback_year_command)
    app.cli.add_command(commands.build_static_command)
    app.cli.add_command(commands.forecast_command)

    return None
