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
        DATABASE=os.path.join(app.instance_path, "uk_box_office_flask.sqlite"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_DATABASE_URI=(os.path.join("sqlite:///"+app.instance_path, "uk_box_office_flask.sqlite")),
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

        # from . import run
        app.cli.add_command(etl.fill_db_command)

        # loads some test data
        # api.test_data()

        # load a big chunk of test data
        # path = "./data/test.csv"
        # test_data = pd.read_csv(path)
        # etl.load_dataframe(test_data)

        # load archive
        # path = "./data/archive.csv"
        # archive = pd.read_csv(path)
        # etl.load_dataframe(archive)

        # load excel weekly
        # load_dotenv()
        # source_url = os.environ.get("source_url")
        # path = etl.get_excel_file(source_url)
        # df = etl.extract_box_office(path + ".xls")
        # etl.load_dataframe(df)

        app.register_blueprint(api.bp)
        app.register_blueprint(views.bp)

        return app
