import csv
import json
import math
import os
import urllib
from collections import OrderedDict
from datetime import datetime, timedelta
from typing import Optional

import pandas as pd
import requests  # type: ignore
from bs4 import BeautifulSoup


def get_excel_file(source_url: str) -> Optional[str]:
    # Fetches first (latest) excel file on the source page
    soup = BeautifulSoup(
        requests.get(source_url, timeout=5).content, "html.parser"
    )

    all = soup.find("article")
    # First link in the class
    link = all.find_all("a")[0]
    if link is not None:
        excel_link = link.get("href")
        excel_title = link.find("span").get_text().split("-")[-1]
        print(f"Found {excel_title}")
        urllib.request.urlretrieve(excel_link, excel_title + ".xls")  # type: ignore
        print(f"Link: {excel_link}, title: {excel_title}")
        return excel_title
    return None


def spellcheck_distributor(distributor: pd.Series) -> str:
    # Uses a list of the common distributor mistakes and returns the actual ones
    dist_list = pd.read_csv("distributor_check.csv", header=None)
    dist_list.columns = ["key", "correction"]

    if distributor in dist_list["key"].values:
        dist_list = dist_list[dist_list["key"].str.match(distributor)]
        distributor = dist_list["correction"].iloc[0]
    return distributor


def spellcheck_film(film_title: pd.Series) -> str:
    # Uses a list of the common film mistakes and returns the actual ones
    film_title = film_title.strip()
    # if film ends with ', the', trim and add to prefix
    if film_title.endswith(", THE"):
        film_title = "THE " + film_title.rstrip(", THE")

    # checks against the list of mistakes
    film_list = pd.read_csv("film_check.csv", header=None)
    film_list.columns = ["key", "correction"]

    if film_title in film_list["key"].values:
        film_list = film_list[
            film_list["key"].str.contains(film_title, regex=False)
        ]
        film_title = film_list["correction"].iloc[0].strip()
    return film_title


def get_last_sunday() -> str:
    # Returns the previous sunday date for week extract
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    return sunday.strftime("%Y%m%d")


def get_week_box_office(row: pd.Series, archive: pd.DataFrame) -> float:
    title = row["film"]
    print(title)

    if row["weeks_on_release"] == 1:
        return row["total_gross"]
    else:
        # days_to_look_back is a tradeoff - increasing captures more accurate data for some films.
        # but for others it does create inaccurate data, as the source is unreliable.
        days_to_look_back = 90
        date = pd.to_datetime(row["date"], format="%Y%m%d", yearfirst=True)
        previous_period = date - timedelta(days=days_to_look_back)

        films_filter = (
            (archive["film"] == title)
            & (archive["date"] > previous_period)
            & (archive["date"] < date)
        )

        films_list = archive[films_filter]

        week_gross = row["total_gross"] - films_list["total_gross"].max()

        if type(week_gross) == float and math.isnan(week_gross):
            return row["weekend_gross"]
        elif week_gross < 0:
            return row["weekend_gross"]
        else:
            return week_gross


def extract_box_office(
    filename: str, arg: str, archive_path: str
) -> pd.DataFrame:
    """Main extract/load function, transforming xls to csv."""
    df = pd.read_excel(filename)

    header = df.iloc[0]
    df = df.iloc[1:]
    df.columns = header

    df = df.dropna(subset=["Rank"])
    df = df.dropna(axis=1, thresh=5)

    # Weekly load only needs the most recent date, archive needs all
    if arg == "week":
        date = get_last_sunday()
        df = df.drop(
            columns=["% change on last week", "Site average"], errors="ignore"
        )
    elif arg == "archive":
        date = filename.strip(".xls").strip(archive_path)
        date = datetime.strptime(date, "%d-%m-%Y").strftime("%Y%m%d")
        df = df.drop(df.columns[[5, 8]], axis=1)
        df = df.iloc[:, 0:8]

    df.columns = [
        "rank",
        "film",
        "country",
        "weekend_gross",
        "distributor",
        "weeks_on_release",
        "number_of_cinemas",
        "total_gross",
    ]

    df = df.dropna(subset=["distributor"])
    df = df.dropna(axis=1, thresh=2)

    df.insert(0, "date", date)
    df["film"] = df["film"].astype(str).str.upper()
    df["country"] = df["country"].astype(str).str.upper()
    df["distributor"] = df["distributor"].astype(str).str.upper()

    df["film"] = df["film"].map(spellcheck_film)
    df["distributor"] = df["distributor"].map(spellcheck_distributor)

    if arg == "week":
        archive = pd.read_csv("archive.csv")
        archive["date"] = pd.to_datetime(
            archive["date"], format="%Y%m%d", yearfirst=True
        )

        # TODO: Seems like a potential place for async / dask
        df["week_gross"] = df.apply(
            get_week_box_office, axis=1, archive=archive
        )

    df = df.astype(
        {
            "rank": float,
            "film": str,
            "country": str,
            "weekend_gross": float,
            "distributor": str,
            "weeks_on_release": float,
            "number_of_cinemas": float,
            "total_gross": float,
        }
    )

    return df


def transform_archive() -> pd.DataFrame:
    df = pd.read_csv("archive1.csv")

    df.columns = [
        "date",
        "rank",
        "film",
        "country",
        "weekend_gross",
        "distributor",
        "weeks_on_release",
        "number_of_cinemas",
        "total_gross",
    ]

    df = df.astype(
        {
            "rank": float,
            "film": str,
            "country": str,
            "weekend_gross": float,
            "distributor": str,
            "weeks_on_release": float,
            "number_of_cinemas": float,
            "total_gross": float,
        }
    )

    archive = pd.read_csv("archive.csv")
    archive["date"] = pd.to_datetime(
        archive["date"], format="%Y%m%d", yearfirst=True
    )

    df["week_gross"] = df.apply(get_week_box_office, axis=1, archive=archive)

    return df
