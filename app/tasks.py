"""Scheduled tasks"""

import os

from dotenv import load_dotenv
from . import scheduler, etl


@scheduler.task(
    "cron",
    id="etl",
    week="*",
    max_instances=1,
    day_of_week="wed",
    hour=12,
    minute=00,
    second=00,
)
def run_etl():
    """
    Weekly task for the ETL pipeline of box office data.
    Added when app starts.
    """
    print("ETL Pipeline task")
    with scheduler.app.app_context():
        load_dotenv()
        source_url = os.environ.get("source_url")
        path = etl.get_excel_file(source_url)
        df = etl.extract_box_office(path)
        etl.load_dataframe(df)
        print("Finished ETL Pipeline task")
