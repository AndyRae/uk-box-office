"""CLI for database loading"""

import datetime
import os
import urllib.request

import click
import pandas as pd
from dotenv import load_dotenv
from flask import current_app
from flask.cli import with_appcontext

from . import db, etl, models


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
    current_app.logger.info("Weekly-etl running manually")
    load_dotenv()
    source_url = os.environ.get("source_url")
    if source_url is not None:
        path = etl.get_excel_file(source_url)

        if path[0] is True:
            df = etl.extract_box_office(path[1])
            etl.load_dataframe(df)
            current_app.logger.info("Weekly-ETL manual run succesful.")
        else:
            current_app.logger.error("Weekly-ETL manual run failed.")
    else:
        current_app.logger.error("Weekly-ETL manual run failed.")


@click.command("backup-etl")
@click.argument("source_url")
@with_appcontext
def backup_etl(source_url: str) -> None:
    """
    A backup CLI for the pipeline - pass the excel file link directly
    """
    current_app.logger.info("Backup-ETL manual running.")
    if source_url is not None:
        now = datetime.datetime.now().strftime("ETL%Y%m%d%M%H%S")
        file_path = f"./data/{now}.xls"
        urllib.request.urlretrieve(source_url, file_path)

        df = etl.extract_box_office(file_path)
        etl.load_dataframe(df)
        current_app.logger.info("Backup-ETL manual run succesful.")
    else:
        current_app.logger.error("Backup-ETL manual run failed.")


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
    current_app.logger.info(
        f"Rollback ETL finished - deleted {len(data)} entries for {last_date}."
    )