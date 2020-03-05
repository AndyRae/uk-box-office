# For loading weekly data into database

import os
import argparse
from googleapiclient.discovery import build

from helper import get_excel_file, load_to_bigquery, load_to_sheet

from extract_week import extract_weekly_box_office

from settings import (
    source_url,
    sheet_id,
    staging_dataset_id,
    staging_table_id,
    prod_dataset_id,
    prod_table_id,
)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets"
]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Loads weekly data into database")
    parser.add_argument(
        "type", type=str, help="Which process - either fetch / test / stage / prod."
    )
    parser.add_argument("file", type=str, help="CSV file to use.")
    args = parser.parse_args()

    if args.type.lower() == "fetch":
        excel_file = get_excel_file(source_url)
        extract_weekly_box_office(excel_file)
        print("Fetched + extracted")

    elif args.type.lower() == "test":
        # Load to Google Sheets
        sheets = build("sheets", "v4")

        load_to_sheet(sheets, args.file, sheet_id)
        print("Loaded to Sheets")

    elif args.type.lower() == "stage":
        dataset_id = staging_dataset_id
        table_id = staging_table_id
        load_to_bigquery(args.file, dataset_id, table_id)
        print("Loaded to BigQuery staging")

    elif args.type.lower() == "prod":
        dataset_id = prod_dataset_id
        table_id = prod_table_id
        load_to_bigquery(args.file, dataset_id, table_id)
        print("Loaded to BigQuery production")

    else:
        print("Pick which process - fetch / test / stage / prod")
