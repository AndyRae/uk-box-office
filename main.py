# For loading weekly data into database

import os
import argparse
from googleapiclient.discovery import build

import helper

from settings import (
    source_url,
    sheet_id,
    staging_dataset_id,
    staging_table_id,
    prod_dataset_id,
    prod_table_id,
)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Loads weekly data into database")
    parser.add_argument(
        "type",
        type=str,
        help="Which process - either build-archive / transform-archive / fetch / extract / test / stage / prod",
    )
    parser.add_argument("file", type=str, default=None, help="CSV file to use")
    args = parser.parse_args()

    if args.type.lower() == "fetch":
        excel_file = helper.get_excel_file(source_url)
        helper.extract_box_office(excel_file, "week")
        print("Fetched + extracted")

    elif args.type.lower() == "test":
        helper.load_to_sheet(args.file)
        print("Loaded to Sheets")

    elif args.type.lower() == "extract":
        archive_path = "./data/archive.csv"
        df = helper.extract_box_office(args.file, "week", archive_path)
        df.to_csv("./data/week.csv", index=False)
        print("Extracted to /data/week.csv")

    elif args.type.lower() == "stage":
        dataset_id = staging_dataset_id
        table_id = staging_table_id
        helper.load_to_bigquery(args.file, dataset_id, table_id)
        print("Loaded to BigQuery staging")

    elif args.type.lower() == "prod":
        dataset_id = prod_dataset_id
        table_id = prod_table_id
        helper.load_to_bigquery(args.file, dataset_id, table_id)
        print("Loaded to BigQuery production")

    elif args.type.lower() == "build-archive":
        helper.build_archive()
        print("Archive created")

    elif args.type.lower() == "transform-archive":
        df = helper.transform_archive(args.file)
        df.to_csv("./data/transformed_archive.csv", index=False)
        print("Archive transformed")

    else:
        print(
            "Pick which process - build-archive / transform-archive / fetch / test / stage / prod"
        )
