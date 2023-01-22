"""

This module creates the Flask app and registers extensions.

"""

from flask import Flask
from flask_cors import CORS
from ukbo.extensions import cache, db, limiter, ma, migrate, scheduler


def create_app(config: str = "") -> Flask:
    """
    Create the Flask app.

    Args:
        config: Configuration to use.

    Returns:
        Flask app.
    """
    app = Flask(__name__, instance_relative_config=True)

    from ukbo import settings

    if config == "dev":
        app.config.from_object(settings.DevelopmentConfig)

    elif config == "production":
        app.config.from_object(settings.Config)

    else:
        app.config.from_object(settings.TestConfig)

    register_extensions(app)
    scheduler.init_app(app)

    with app.app_context():
        return run_app(app)


def run_app(app: Flask) -> Flask:
    """
    Create the Flask app with app context.

    Args:
        app: Flask app.

    """
    register_blueprints(app)
    register_cli(app)

    # Add CORS urls, need app_context / app.config
    prod: str = app.config.get("CORS_ORIGIN")
    beta: str = app.config.get("CORS_ORIGIN_2")
    cors = CORS(
        resources={r"/api/*": {"origins": [prod, beta], "methods": ["GET"]}}
    )

    cors.init_app(app)

    from ukbo.etl import tasks

    if not app.config["TESTING"]:
        scheduler.start()

    return app


def register_extensions(app: Flask) -> None:
    """
    Register Flask extensions.

    Args:
        app: Flask app.

    """

    cache.init_app(app)
    db.init_app(app)
    limiter.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    return None


def register_blueprints(app: Flask) -> None:
    """
    Register Flask blueprints.

    Args:
        app: Flask app.

    """
    from ukbo import api, sitemap

    app.register_blueprint(api.root_bp)
    app.register_blueprint(api.api_bp, url_prefix="/api")
    app.register_blueprint(sitemap.bp)
    return None


def register_cli(app: Flask) -> None:
    """
    Register Flask CLI commands.

    Args:
        app: Flask app.

    """
    from ukbo import etl

    app.cli.add_command(etl.commands.init_db_command)
    app.cli.add_command(etl.commands.fill_db_command)
    app.cli.add_command(etl.commands.test_db_command)
    app.cli.add_command(etl.commands.seed_films_command)
    app.cli.add_command(etl.commands.seed_box_office_command)
    app.cli.add_command(etl.commands.seed_admissions_command)
    app.cli.add_command(etl.commands.update_admissions_command)
    app.cli.add_command(etl.commands.weekly_etl_command)
    app.cli.add_command(etl.commands.backup_etl_command)
    app.cli.add_command(etl.commands.rollback_etl_command)
    app.cli.add_command(etl.commands.rollback_year_command)
    app.cli.add_command(etl.commands.forecast_command)
    app.cli.add_command(etl.commands.delete_film_command)
    app.cli.add_command(etl.commands.build_archive_command)

    return None
