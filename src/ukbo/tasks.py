"""Scheduled tasks"""

import json
import os
import urllib.request
from datetime import datetime, timedelta

import pandas as pd
from dotenv import load_dotenv
from flask import current_app
from flask.cli import with_appcontext

from ukbo import db, etl, forecast, models, scheduler, utils


@scheduler.task(
    "cron",
    id="etl",
    week="*",
    max_instances=1,
    day_of_week="wed",
    hour="9-18",
    minute="00,15,30,40,45",
    second=00,
    timezone="UTC",
)
def run_etl() -> None:
    """
    Weekly task for the ETL pipeline of box office data.
    """
    print("ETL Pipeline task")
    with scheduler.app.app_context():

        # Checks against the last data load
        query = db.session.query(models.Film_Week)
        last_date = query.order_by(models.Film_Week.date.desc()).first().date
        now = datetime.now() - timedelta(days=7)

        if now >= last_date:
            load_dotenv()
            source_url = os.environ.get("SOURCE_URL")
            if source_url is not None:
                path = etl.get_excel_file(source_url)
                if path[0] is True:
                    df = etl.extract_box_office(path[1])
                    etl.load_dataframe(df)
                    current_app.logger.info("Weekly-ETL auto run succesful.")
                else:
                    current_app.logger.warning("Weekly-ETL auto run failed.")
        else:
            current_app.logger.warning(
                "ETL fetch failed - website file is pending update."
            )


@scheduler.task(
    "cron",
    id="forecast",
    week="*",
    max_instances=1,
    day_of_week="wed",
    hour="19",
    minute="01",
    second=00,
    timezone="UTC",
)
@with_appcontext
def forecast_task() -> None:
    """
    Weekly task for the box office forecast pipeline
    """
    print("Running forecast.")
    f = forecast.Forecast()
    f.run_forecast()


@with_appcontext
def init_db() -> None:
    """
    Drops and creates database tables
    """
    db.reflect()
    db.drop_all()
    db.session.commit()
    db.create_all()
    db.session.commit()


@with_appcontext
def fill_db(path: str) -> None:
    """
    Fills database with box office data.
    """
    input_data = pd.read_csv(path)
    etl.load_dataframe(input_data)


@with_appcontext
def static_top_films() -> None:
    """
    Builds static top films
    """
    query = db.session.query(models.Film).options(
        db.selectinload(models.Film.weeks)
    )
    query = query.order_by(models.Film.gross.desc())  # type: ignore
    query = query.limit(25)
    films = query.all()

    json_data = [ix.as_dict() for ix in films]
    path = "./data/top_films_data.json"
    with open(path, "w") as outfile:
        json.dump(json_data, outfile)


@with_appcontext
def static_distributor_market() -> None:
    query = db.session.query(models.Film_Week)
    data = query.all()
    data, years = utils.group_by_distributor(data)

    json_data = data
    path = "./data/distributor_market_data.json"
    with open(path, "w") as outfile:
        json.dump(json_data, outfile)


@with_appcontext
def weekly_etl() -> None:
    current_app.logger.info("Weekly-etl running manually")
    load_dotenv()
    source_url = os.environ.get("SOURCE_URL")
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


@with_appcontext
def backup_etl_command(source_url: str) -> None:
    """
    A backup CLI for the pipeline - pass the excel file link directly
    """
    current_app.logger.info("Backup-ETL manual running.")
    if source_url is not None:
        now = datetime.now().strftime("ETL%Y%m%d%M%H%S")
        file_path = f"./data/{now}.xls"
        urllib.request.urlretrieve(source_url, file_path)

        df = etl.extract_box_office(file_path)
        etl.load_dataframe(df)
        current_app.logger.info("Backup-ETL manual run succesful.")
    else:
        current_app.logger.error("Backup-ETL manual run failed.")


@with_appcontext
def rollback_etl_command() -> None:
    """
    Deletes the last week of data.
    Film Weeks and Weeks
    """
    query = db.session.query(models.Film_Week)
    last_date = query.order_by(models.Film_Week.date.desc()).first().date
    query = query.filter(models.Film_Week.date >= last_date)
    data = query.all()

    for i in data:
        db.session.delete(i)

    query = db.session.query(models.Week)
    query = query.filter(models.Week.date >= last_date)
    weeks = query.all()

    for i in weeks:
        i.weekend_gross = 0
        i.week_gross = 0
        i.number_of_cinemas = 0
        i.number_of_releases = 0

    db.session.commit()
    current_app.logger.info(
        f"Rollback ETL finished - deleted {len(data)} entries for {last_date}."
    )
