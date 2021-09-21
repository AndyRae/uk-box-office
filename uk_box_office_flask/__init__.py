import os

from dotenv import load_dotenv
from flask import Flask, json
from flask_sqlalchemy import SQLAlchemy

import pandas as pd

db = SQLAlchemy()


def create_app(test_config=None):
    # create the app
    app = Flask(__name__, instance_relative_config=True)
    load_dotenv()
    SECRET = os.environ.get("secret")
    app.config.from_mapping(
        SECRET_KEY=SECRET,
        DATABASE=os.path.join(app.instance_path, "uk_box_office_flask.sqlite"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        # SQLALCHEMY_DATABASE_URI=(os.path.join("sqlite:///"+app.instance_path, "uk_box_office_flask.sqlite")),
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

    with app.app_context():
        from . import models
        from . import etl

        db.create_all()

        country = models.Country(name="UK")
        distributor = models.Distributor(name="Sony")

        db.session.add(country)
        db.session.add(distributor)
        db.session.commit()

        # load archive
        # path = "./data/archive.csv"
        # archive = pd.read_csv(path)
        # etl.load_dataframe(archive)

        # load excel weekly
        load_dotenv()
        source_url = os.environ.get("source_url")
        path = etl.get_excel_file(source_url) 
        df = etl.extract_box_office(path + '.xls', "week")
        etl.load_dataframe(df)

        film1 = models.Film(title="1917", country=country, distributor=distributor)

        db.session.add(film1)
        db.session.commit()

        # ret = models.Country.query.all()
        ret = models.Week.query.all()
        # print(ret[0].films)

        # ret = models.Film.query.all()
        # print(ret[0].country.name)

        @app.route("/")
        def hello():
            return json.dumps([ix.as_dict() for ix in ret])

        return app
