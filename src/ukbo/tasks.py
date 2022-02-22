"""Scheduled tasks"""

import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from flask import current_app

from ukbo import db, etl, forecast, models, scheduler


@scheduler.task(
    "cron",
    id="etl",
    week="*",
    max_instances=1,
    day_of_week="wed",
    hour="9-18",
    minute="00,15,30,45",
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

        if now <= last_date:
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
    id="etl",
    week="*",
    max_instances=1,
    day_of_week="wed",
    hour="19",
    minute="01",
    second=00,
    timezone="UTC",
)
def forecast_task() -> None:
    """
    Weekly task for the box office forecast pipeline
    """
    print("Running forecast 🎾")
    f = forecast.Forecast()
    f.run_forecast()
