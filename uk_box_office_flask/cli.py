import os

import click
import pandas as pd

from flask.cli import with_appcontext
from dotenv import load_dotenv
from uk_box_office_flask import etl


@with_appcontext
def fill_db():
    # full archive
    path = "./data/archive.csv"

    # some test data
    # path = "./data/test.csv"
    input_data = pd.read_csv(path)
    etl.load_dataframe(input_data)


@click.command("fill-db")
@with_appcontext
def fill_db_command():
    """Clear the existing data and create new tables."""
    fill_db()
    click.echo("Initialised the database.")


@click.command("weekly-etl")
@with_appcontext
def weekly_etl_command():
    """Runs the weekly etl for new box office data."""
    load_dotenv()
    source_url = os.environ.get("source_url")
    path = etl.get_excel_file(source_url)
    df = etl.extract_box_office(path + ".xls")
    etl.load_dataframe(df)
    click.echo("Weekly ETL finished.")
