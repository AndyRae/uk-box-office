"""Scheduled tasks"""

import os

from dotenv import load_dotenv
from flask import current_app

from ukbo import etl, scheduler


@scheduler.task(
    "cron",
    id="etl",
    week="*",
    max_instances=1,
    day_of_week="wed",
    hour=12,
    minute=00,
    second=00,
    timezone="UTC",
)
def run_etl() -> None:
    """
    Weekly task for the ETL pipeline of box office data.
    Added when app starts.
    """
    print("ETL Pipeline task")
    with scheduler.app.app_context():
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
