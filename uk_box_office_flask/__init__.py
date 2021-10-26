from datetime import datetime
import os

from dotenv import load_dotenv
from flask import Flask, json
from flask_sqlalchemy import SQLAlchemy
from flask_debugtoolbar import DebugToolbarExtension

import pandas as pd

db = SQLAlchemy()
toolbar = DebugToolbarExtension()


def create_app(test_config=None):
    # create the app
    app = Flask(__name__, instance_relative_config=True)
    app.debug = True
    load_dotenv()
    SECRET = os.environ.get("secret")
    app.config.from_mapping(
        SECRET_KEY=SECRET,
        DATABASE=os.path.join(app.instance_path, "db.sqlite"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_DATABASE_URI=(
            os.path.join("sqlite:///" + app.instance_path, "db.sqlite")
        ),
    )

    if test_config is None:
        # load the instance config - if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
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

    # Debug toolbar
    toolbar.init_app(app)

    with app.app_context():
        from . import run, etl, api, views

        # create the database tables
        db.create_all()

        db.session.commit()

        from . import run

        app.cli.add_command(run.fill_db_command)

        app.register_blueprint(api.bp)
        app.register_blueprint(views.bp)

        return app
