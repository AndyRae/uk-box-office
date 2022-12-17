"""Scheduled tasks"""

import os
import urllib.request
from datetime import datetime, timedelta
from typing import Any

import pandas as pd
from dotenv import load_dotenv
from flask import current_app
from flask.cli import with_appcontext
from sqlalchemy import extract as sqlextract
from ukbo import db, models, scheduler, services  # type: ignore

from . import extract, load


@scheduler.task(
    "cron",
    id="etl",
    week="*",
    max_instances=1,
    day_of_week="wed",
    hour="9-18",
    minute="00,30",
    second=00,
    timezone="UTC",
)
def run_etl() -> None:
    """
    Weekly task for running the ETL pipeline of new box office data.

    This task is run every Wednesday.
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
    Weekly task for running the box office forecast pipeline.

    This task is run every Wednesday evening after the ETL pipeline.
    """

    print("Running forecast.")
    f = services.forecast.Forecast()
    f.run_forecast()


@with_appcontext
def clear_db() -> None:
    """
    Drops any existing database tables.
    Useful for resetting the database in testing.
    """

    db.reflect()
    db.drop_all()
    db.session.commit()


@with_appcontext
def seed_db(path: str) -> None:
    """
    Seeds database with box office data.

    Args:
        path: Path to the archive.csv file.

    """

    seed_films(path)
    seed_box_office(path)


@with_appcontext
def seed_films(path: str) -> None:
    """
    Seeds countries / distributors / films data.
    But not box office weeks data.

    Args:
        path: Path to the archive.csv file.

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
    Seeds box office data for all films.

    Args:
        path: Path to the archive.csv file.
        **kwargs: Keyword arguments for load.load_weeks.

    """

    archive = pd.read_csv(path)
    load.load_weeks(archive, **kwargs)


@with_appcontext
def seed_admissions(path: str) -> None:
    """
    Seeds admissions data.

    Args:
        path: Path to the admissions.csv file.

    """

    archive = pd.read_csv(path)
    load.load_admissions(archive)


@with_appcontext
def weekly_etl() -> None:
    """
    Manual CLI for the weekly ETL pipeline.

    This is useful for testing the pipeline, and for running it as a backup.
    """
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
    A backup command for the ETL pipeline in case the excel file is not findable.

    Args:
        source_url: The url of the excel file to download.

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
    A command for rolling back the ETL pipeline, and deleting the last week of data.
    Film Weeks and Weeks, but not Films, Distributors or Countries.
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
    Deletes the year of Box Office data from the database.

    Box Office data is deleted, but Films, Distributors, and Countries are not.

    Args:
        year: The year to delete

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


@with_appcontext
def delete_film(id: int) -> None:
    """
    Deletes a film from the database.

    Args:
        id: The id of the film to delete.

    """
    services.film.delete_film(id)


@scheduler.task(
    "cron",
    id="archive",
    week="*",
    max_instances=1,
    day_of_week="wed",
    hour="19",
    minute="30",
    second=00,
    timezone="UTC",
)
@with_appcontext
def build_archive() -> None:
    """
    Builds the archive of box office data.

    This is run every Wednesday evening after the box office data is updated.

    """
    archive = services.boxoffice.build_archive()
    archive.to_csv(
        "./data/archive_export.csv", index=False, date_format="%Y%m%d"
    )
