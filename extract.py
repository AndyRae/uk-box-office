# Extracts box office data, outputting a csv of the loaded excel.

import argparse
import xlrd
import os
import pandas as pd
from datetime import datetime, timedelta

import helper


def extract_box_office(filename, arg):
    """ Does the weekly load
    

    """
    df = pd.read_excel(filename)

    header = df.iloc[0]
    df = df.iloc[1:]
    df.columns = header

    df = df.dropna(subset=["Rank"])
    df = df.dropna(how="all", axis=1, thresh=5)

    if arg == "week":
        date = helper.get_last_sunday()
        df = df.drop(columns=["% change on last week", "Site average"])
    elif arg == "archive":
        date = filename.strip(".xls").strip("./archive-data/")
        date = datetime.strptime(date, "%d-%m-%Y").strftime("%Y%m%d")
        df = df.drop(df.columns[[5, 8]], axis=1)
        df = df.iloc[:, 0:8]

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
    df["country"] = df["country"].astype(str).str.upper()
    df["distributor"] = df["distributor"].astype(str).str.upper()

    df["title"] = df["title"].map(helper.spellcheck_film)
    df["distributor"] = df["distributor"].map(helper.spellcheck_distributor)

    if arg == "week":
        df["week_gross"] = df.apply(lambda row: helper.get_week_box_office(row), axis=1)

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

    if arg == "week":
        df.to_csv("./data/week.csv", index=False)
    elif arg == "archive":
        df.to_csv("./data/archive.csv", mode="a", index=False, header=False)


def build_archive():
    df = pd.DataFrame(
        columns=[
            "date",
            "rank",
            "title",
            "country",
            "weekend_gross",
            "distributor",
            "weeks_on_release",
            "number_of_cinemas",
            "total_gross",
        ]
    )

    df.to_csv("./data/archive.csv", mode="a", index=False, header=True)

    for filename in os.listdir("./archive-data/"):
        if filename.endswith("xls"):
            print(filename)
            path = "./archive-data/" + filename
            extract_box_office(path, "archive")

    print("Done")


def transform_archive(filename):
    df = pd.read_csv(filename)

    df.columns = [
        "date",
        "rank",
        "title",
        "country",
        "weekend_gross",
        "distributor",
        "weeks_on_release",
        "number_of_cinemas",
        "total_gross",
    ]

    df["week_gross"] = df.apply(lambda row: helper.get_week_box_office(row), axis=1)

    df.to_csv("./data/transformed_archive.csv", index=False)
