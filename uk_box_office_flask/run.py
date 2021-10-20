import click
import pandas as pd
from flask import current_app, g
from flask.cli import with_appcontext
from flask_sqlalchemy import SQLAlchemy

from . import etl, api


def fill_db():
    # path = "./data/test.csv"
    # test_data = pd.read_csv(path)
    # etl.load_dataframe(test_data)
    # api.test_data()
    print("Hello World!")


@click.command("fill-db")
@with_appcontext
def fill_db_command():
    """Clear the existing data and create new tables."""
    fill_db()
    click.echo("Initialised the database.")
