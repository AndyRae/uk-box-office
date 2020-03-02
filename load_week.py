# For loading weekly data into database

import pandas as pd
import os
import argparse
from google.cloud import bigquery
from settings import (
    staging_dataset_id,
    staging_table_id,
    prod_dataset_id,
    prod_table_id,
)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"


def load_to_bigquery(filename, dataset_id, table_id):
    from google.cloud import bigquery

    client = bigquery.Client()

    dataset_ref = client.dataset(dataset_id)
    table_ref = dataset_ref.table(table_id)
    job_config = bigquery.LoadJobConfig()
    job_config.source_format = bigquery.SourceFormat.CSV
    job_config.skip_leading_rows = 1
    job_config.autodetect = True

    with open(filename, "rb") as source_file:
        job = client.load_table_from_file(source_file, table_ref, job_config=job_config)

    job.result()  # Waits for table load to complete.

    print("Loaded {} rows into {}:{}.".format(job.output_rows, dataset_id, table_id))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Loads weekly data into database")
    parser.add_argument(
        "type", type=str, help="Type of load, either staging or production."
    )
    parser.add_argument("file", type=str, help="CSV file to use.")
    args = parser.parse_args()
    if args.type.lower() == "staging":
        dataset_id = staging_dataset_id
        table_id = staging_table_id
    elif args.type.lower() == "production":
        dataset_id = prod_dataset_id
        table_id = prod_table_id

    load_to_bigquery(args.file, dataset_id, table_id)
    print("Done")
