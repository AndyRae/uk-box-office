import os

import pandas as pd

from flask import Flask
from flask_apscheduler import APScheduler
from flask_sqlalchemy import SQLAlchemy
from flask_debugtoolbar import DebugToolbarExtension
from elasticsearch import Elasticsearch
from uk_box_office_flask import settings


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

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Database
    db.init_app(app)

    # Scheduler
    scheduler.init_app(app)

    # Elasticsearch
    app.elasticsearch = (
        Elasticsearch([app.config["ELASTICSEARCH_URL"]])
        if app.config["ELASTICSEARCH_URL"]
        else None
    )

    with app.app_context():
        from . import cli, etl, api, views, tasks

        # create the database tables
        db.create_all()
        db.session.commit()

        path = "./data/test.csv"
        input_data = pd.read_csv(path)
        etl.load_dataframe(input_data)

        app.cli.add_command(cli.fill_db_command)

        app.register_blueprint(api.bp)
        app.register_blueprint(views.bp)

        scheduler.start()

        return app
