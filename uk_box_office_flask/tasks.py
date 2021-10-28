import os

from dotenv import load_dotenv
from uk_box_office_flask import scheduler, etl


@scheduler.task(
    "interval",
    id="job_sync",
    seconds=30,
    max_instances=1,
    start_date="2000-01-01 12:19:00",
)
def task1():
    """
    Weekly task for the ETL pipeline of box office data.
    Added when app starts.
    """
    print("Running task 1----------")
    with scheduler.app.app_context():
        load_dotenv()
        source_url = os.environ.get("source_url")
        path = etl.get_excel_file(source_url)
        df = etl.extract_box_office(path)
        etl.load_dataframe(df)
        print("Finished task 1----------")


