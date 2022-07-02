# For loading weekly data into database

import argparse

import helper
from settings import source_url

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Loads weekly data into database"
    )
    parser.add_argument(
        "type",
        type=str,
        help="Pick process - fetch / extract (file)",
    )
    parser.add_argument("file", type=str, default=None, help="CSV file to use")
    args = parser.parse_args()

    if args.type.lower() == "fetch":
        archive_path = "archive.csv"
        excel_file = helper.get_excel_file(source_url)
        df = helper.extract_box_office(
            f"{excel_file}.xls", "week", archive_path
        )
        df.to_csv("week.csv", index=False)
        print("Fetched + extracted")

    elif args.type.lower() == "extract":
        archive_path = "archive.csv"
        df = helper.extract_box_office(args.file, "week", archive_path)
        df.to_csv("week.csv", index=False)
        print("Extracted to /data/week.csv")

    elif args.type.lower() == "transform":
        df = helper.transform_archive()
        df.to_csv("transformed_archive.csv", index=False)
        print("Archive transformed")

    else:
        print("Pick process - fetch / extract (file)")
