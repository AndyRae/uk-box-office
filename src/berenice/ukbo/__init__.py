from flask import Flask
from flask_cors import CORS
from ukbo.extensions import cache, db, limiter, ma, migrate, scheduler


def create_app(config: str = "") -> Flask:
    app = Flask(__name__, instance_relative_config=True)

    from ukbo import settings

    if config == "production":
        app.config.from_object(settings.Config)

    elif config == "dev":
        app.config.from_object(settings.DevelopmentConfig)

    else:
        app.config.from_object(settings.TestConfig)

    register_extensions(app)
    scheduler.init_app(app)

    with app.app_context():
        register_blueprints(app)
        register_cli(app)

        origins = [app.config.get("CORS_ORIGIN")]
        cors = CORS(
            resources={r"/api/*": {"origins": origins, "methods": ["GET"]}}
        )
        cors.init_app(app)

        from ukbo.etl import tasks

        scheduler.start()

        return app


def register_extensions(app: Flask) -> None:

    cache.init_app(app)
    db.init_app(app)
    limiter.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    return None


def register_blueprints(app: Flask) -> None:
    from ukbo import api, sitemap

    app.register_blueprint(api.root_bp)
    app.register_blueprint(api.api_bp, url_prefix="/api")
    app.register_blueprint(sitemap.bp)
    return None


def register_cli(app: Flask) -> None:
    from ukbo import etl

    app.cli.add_command(etl.commands.init_db_command)
    app.cli.add_command(etl.commands.fill_db_command)
    app.cli.add_command(etl.commands.test_db_command)
    app.cli.add_command(etl.commands.seed_films_command)
    app.cli.add_command(etl.commands.seed_box_office_command)
    app.cli.add_command(etl.commands.weekly_etl_command)
    app.cli.add_command(etl.commands.backup_etl_command)
    app.cli.add_command(etl.commands.rollback_etl_command)
    app.cli.add_command(etl.commands.rollback_year_command)
    app.cli.add_command(etl.commands.forecast_command)
    app.cli.add_command(etl.commands.delete_film_command)
    app.cli.add_command(etl.commands.build_archive_command)

    return None
