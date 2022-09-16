"""Scheduled tasks"""

import json
import os
import urllib.request
from datetime import datetime, timedelta
from typing import Any

import pandas as pd
from dotenv import load_dotenv
from flask import current_app
from flask.cli import with_appcontext
from sqlalchemy import extract as sqlextract
from ukbo import db, models, scheduler, services, utils  # type: ignore

from . import extract, load, transform


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
                path = extract.get_excel_file(source_url)
                if path[0] is True:
                    df = extract.extract_box_office(path[1])
                    load.load_weeks(df)
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
    f = services.forecast.Forecast()
    f.run_forecast()


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
def static_task() -> None:
    """
    Weekly task for buiding static files
    """

    print("Building static files.")
    static_top_films()
    static_distributor_market()
    print("Built static files.")


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
def seed_db(path: str) -> None:
    """
    Seeds database with box office data.
    """

    seed_films(path)
    seed_box_office(path)


@with_appcontext
def seed_films(path: str) -> None:
    """
    Seeds countries / distributors / films
    But not weeks.
    """

    archive = pd.read_csv(path)
    list_of_countries = archive["country"].unique()
    load.load_countries(list_of_countries)
    print("Seeded countries.")

    list_of_distributors = archive["distributor"].unique()
    load.load_distributors(list_of_distributors)
    print("Seeded distributors.")

    list_of_films = (
        archive.groupby(["film", "distributor", "country"])
        .size()
        .reset_index()
        .rename(columns={0: "count"})
    )
    films = list_of_films.to_dict(orient="records")
    load.load_films(films)
    print("Seeded films.")


@with_appcontext
def seed_box_office(path: str, **kwargs: Any) -> None:
    """
    Seeds box office data
    """

    archive = pd.read_csv(path)
    load.load_weeks(archive, **kwargs)


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
        path = extract.get_excel_file(source_url)

        if path[0] is True:
            df = extract.extract_box_office(path[1])
            load.load_weeks(df)
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

        df = extract.extract_box_office(file_path)
        load.load_weeks(df)
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


@with_appcontext
def rollback_year(year: int) -> None:
    """
    Deletes the year of data
    """
    query = db.session.query(models.Film_Week)
    query = query.filter(sqlextract("year", models.Film_Week.date) == year)
    data = query.all()

    for i in data:
        db.session.delete(i)

    query = db.session.query(models.Week)
    query = query.filter(sqlextract("year", models.Week.date) == year)
    weeks = query.all()

    for i in weeks:
        i.weekend_gross = 0
        i.week_gross = 0
        i.number_of_cinemas = 0
        i.number_of_releases = 0

    db.session.commit()
