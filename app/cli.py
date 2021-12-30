"""CLI for database loading"""

import datetime
import os

import click
import pandas as pd
import urllib.request

from flask.cli import with_appcontext
from dotenv import load_dotenv
from . import etl, db, models


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
        df = etl.extract_box_office(path)
        etl.load_dataframe(df)
        click.echo("Weekly ETL finished.")
    else:
        click.echo("Weekly ETL failed.")


@click.command("backup-etl")
@click.argument("source_url")
@with_appcontext
def backup_etl(source_url: str) -> None:
    """
    A backup CLI for the pipeline - pass the excel file link directly
    """
    if source_url is not None:
        now = datetime.datetime.now().strftime("ETL%Y%m%d%M%H%S")
        file_path = f"./data/{now}.xls"
        urllib.request.urlretrieve(source_url, file_path)

        df = etl.extract_box_office(file_path)
        etl.load_dataframe(df)
        click.echo("Backup ETL finished.")
    else:
        click.echo("Backup ETL failed.")


@click.command("rollback-etl")
@with_appcontext
def rollback_etl_command() -> None:
    """Deletes the last week of data."""
    query = db.session.query(models.Week)
    last_date = query.order_by(models.Week.date.desc()).first().date

    query = query.filter(models.Week.date >= last_date)
    data = query.all()

    for i in data:
        db.session.delete(i)
    db.session.commit()
    click.echo(
        f"Rollback ETL finished - deleted {len(data)} entries for {last_date}."
    )
