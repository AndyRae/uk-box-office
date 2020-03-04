# Loads weekly box office data, outputting a csv of the loaded excel.

import argparse
import xlrd
import pandas as pd
from datetime import datetime, timedelta

from helper import get_last_sunday, spellcheck_distributor, get_week_box_office


def extract_weekly_box_office(filename):
    df = pd.read_excel(filename)
    date = get_last_sunday()

    header = df.iloc[0]
    df = df.iloc[1:]
    df.columns = header

    df = df.dropna(subset=["Rank"])
    df = df.dropna(how="all", axis=1, thresh=5)
    df = df.drop(columns=["% change on last week", "Site average"])
    df.columns = [
        "rank",
        "title",
        "country",
        "weekend_gross",
        "distributor",
        "weeks_on_release",
        "number_of_cinemas",
        "total_gross",
    ]

    df = df.dropna(subset=["distributor"])
    df = df.dropna(how="all", axis=1, thresh=2)

    df.insert(0, "date", date)
    df["title"] = df["title"].astype(str).str.upper()
    df["country"] = df["country"].str.upper()
    df["distributor"] = df["distributor"].str.upper()

    df["distributor"] = df["distributor"].map(spellcheck_distributor)

    df["week_gross"] = df.apply(lambda row: get_week_box_office(row), axis=1)

    df = df.astype(
        {
            "rank": float,
            "title": str,
            "country": str,
            "weekend_gross": float,
            "distributor": str,
            "weeks_on_release": float,
            "number_of_cinemas": float,
            "total_gross": float,
        }
    )

    df.to_csv("week.csv", index=False)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transform weekly box office data")
    parser.add_argument("file", type=str, help="This weeks excel file to use")
    args = parser.parse_args()

    extract_weekly_box_office(args.file)

    print("Done")
