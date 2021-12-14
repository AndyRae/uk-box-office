"""CLI for database loading"""

import os

import click
import pandas as pd

from flask.cli import with_appcontext
from dotenv import load_dotenv
from . import etl, db


@with_appcontext
def fill_db() -> None:
    # full archive
    # path = "./data/archive.csv"

    # some test data
    path = "./data/test.csv"
    input_data = pd.read_csv(path)
    etl.load_dataframe(input_data)


@with_appcontext
def init_db() -> None:
    db.reflect()
    db.drop_all()
    db.session.commit()
    db.create_all()
    db.session.commit()


@click.command("init-db")
@with_appcontext
def init_db_command() -> None:
    """Clears data and creates new tables."""
    init_db()
    click.echo("Initialised the database.")


@click.command("fill-db")
@with_appcontext
def fill_db_command() -> None:
    """Fills db with archive data"""
    fill_db()
    click.echo("Filled the database.")


@click.command("weekly-etl")
@with_appcontext
def weekly_etl_command() -> None:
    """Runs the weekly etl for new box office data."""
    load_dotenv()
    source_url = os.environ.get("source_url")
    if source_url is not None:
        path = etl.get_excel_file(source_url)
        df = etl.extract_box_office(path + ".xls")
        etl.load_dataframe(df)
        click.echo("Weekly ETL finished.")
    else:
        click.echo("Weekly ETL failed.")
