import csv
import json
import math
import os
import pandas as pd
import requests
import urllib

from collections import OrderedDict
from datetime import datetime, timedelta
from bs4 import BeautifulSoup

from . import db, models


def get_country(country: str) -> models.Country:
    """
    Checks the database if the country exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    filtered_countries = models.Country.query.filter_by(name=country).first()

    if country == filtered_countries:
        return filtered_countries
    new = models.Country(name=country)
    db.session.add(new)
    db.session.commit()
    return new


def get_distributor(distributor: str) -> models.Distributor:
    """
    Checks the database if the distributor exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    filtered_distributors = models.Distributor.query.filter_by(name=distributor).first()

    if distributor == filtered_distributors:
        return filtered_distributors
    new = models.Distributor(name=distributor)
    db.session.add(new)
    db.session.commit()
    return new


def get_film(film: str, distributor: models.Distributor, country: models.Country) -> models.Film:
    """
    Checks the database if the film exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    filtered_films = models.Film.query.filter_by(title=film).first()
    if film == filtered_films:
        return filtered_films
    new = models.Film(title=film, distributor=distributor, country=country)
    db.session.add(new)
    db.session.commit()
    return new


def load_archive():
    """
    Loads the .csv archive into the database
    """
    path = "./data/week.csv"
    archive = pd.read_csv(path)
    archive["date"] = pd.to_datetime(archive["date"], format="%Y%m%d", yearfirst=True)

    list_of_films = [row.to_dict() for index, row in archive.iterrows()]

    for i in list_of_films:
        i["country"] = get_country(i["country"])
        i["distributor"] = get_distributor(i["distributor"])

        i["title"] = models.Film(title=i["title"], distributor=i["distributor"], country=i["country"])
        i.pop("country")
        i.pop("distributor") # euch

        for key in i:
            try:
                i[key] = int(i[key])
            except TypeError:
                pass

        week = models.Week(**i)
        db.session.add(week)
        db.session.commit()

    print(list_of_films[1])


def get_excel_file(source_url: str) -> str:
    """
    Fetches first (latest) excel file on the source page
    """
    soup = BeautifulSoup(requests.get(source_url, timeout=5).content, "html.parser")

    for row in soup.find_all("div", {"class": "sc-fzoJMP kyojiS"}):
        excel_element = row.find("a")
        if excel_element:
            excel_link = excel_element.get("href")
            excel_title = row.find("span").get_text().split("-")[-1]
            print(f"Found {excel_title}")
            urllib.request.urlretrieve(excel_link, excel_title + ".xls")
            return excel_title


def spellcheck_distributor(distributor: pd.Series) -> str:
    """
    Uses a list of the common distributor mistakes and returns the correction
    """
    dist_list = pd.read_csv("./data/distributor_check.csv", header=None)
    dist_list.columns = ["key", "correction"]

    if distributor in dist_list["key"].values:
        dist_list = dist_list[dist_list["key"].str.match(distributor)]
        distributor = dist_list["correction"].iloc[0].strip()
    return distributor


def spellcheck_film(film_title: pd.Series) -> str:
    """
    Uses a list of the common film mistakes and returns the actual ones
    Alo generally cleans up the title
    """
    film_title = film_title.strip()
    # if film ends with ', the', trim and add to prefix
    if film_title.endswith(", THE"):
        film_title = "THE " + film_title.rstrip(", THE")

    # checks against the list of mistakes
    film_list = pd.read_csv("./data/film_check.csv", header=None)
    film_list.columns = ["key", "correction"]

    if film_title in film_list["key"].values:
        film_list = film_list[film_list["key"].str.contains(film_title, regex=False)]
        film_title = film_list["correction"].iloc[0].strip()
    return film_title


def get_last_sunday() -> str:
    # Returns the previous sunday date for week extract
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    return sunday.strftime("%Y%m%d")


def get_week_box_office(row: pd.Series, archive: pd.DataFrame) -> float:
    """
    Calculates the actual box office for the week
    Checks if its the first week of the film - if so, returns total box office
    If not - it subtracts the current total, from last weeks total
    Parameters: The row of the dataframe, and archive to search
    Returns a float (?) of the week box office
    Used in an apply method with pandas.
    """
    title = row["title"]
    print(title)

    if row["weeks_on_release"] == 1:
        return row["total_gross"]
    # days_to_look_back is a tradeoff - increasing captures more accurate data for some films.
    # but for others it does create inaccurate data, as the source is unreliable.
    days_to_look_back = 90
    date = pd.to_datetime(row["date"], format="%Y%m%d", yearfirst=True)
    previous_period = date - timedelta(days=days_to_look_back)

    films_filter = (
        (archive["title"] == title)
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


def extract_box_office(filename: str, arg: str, archive_path) -> pd.DataFrame:
    """
    Main extract/load function, transforming raw box office .xls to dataframe.
    Parameter arg: is either week or archive depending on process.
    """
    df = pd.read_excel(filename)

    header = df.iloc[0]
    df = df.iloc[1:]
    df.columns = header

    df = df.dropna(subset=["Rank"])
    df = df.dropna(how="all", axis=1, thresh=5)

    # Weekly load only needs the most recent date, archive needs all
    if arg == "week":
        date = get_last_sunday()
        df = df.drop(columns=["% change on last week", "Site average"], errors="ignore")
    elif arg == "archive":
        date = filename.strip(".xls").strip(archive_path)
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

    df["title"] = df["title"].map(spellcheck_film)
    df["distributor"] = df["distributor"].map(spellcheck_distributor)

    if arg == "week":
        archive = pd.read_csv("./data/archive.csv")
        archive["date"] = pd.to_datetime(
            archive["date"], format="%Y%m%d", yearfirst=True
        )

        # TODO: Seems like a potential place for async / dask
        df["week_gross"] = df.apply(get_week_box_office, axis=1, archive=archive)

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

    return df


def build_archive() -> None:
    """
    Legacy function for building the archive from raw excel files.
    Keep this function if it's needed again, but it is not used in the programme.
    """
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

    df.to_csv("./data/built-archive.csv", mode="a", index=False, header=True)

    archive_path = "./archive-data/"

    for filename in os.listdir(archive_path):
        if filename.endswith("xls"):
            print(filename)
            path = archive_path + filename
            films = extract_box_office(path, "archive", archive_path)
            df = df.append(films)

    df.to_csv("./data/built-archive.csv", mode="a", index=False, header=False)


def transform_archive(filename: str) -> None:
    """
    Legacy function for transforming the archive from raw excel files.
    Keep this function if it's needed again, but it is not used in the programme.
    """
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

    archive = pd.read_csv("./data/archive.csv")
    archive["date"] = pd.to_datetime(archive["date"], format="%Y%m%d", yearfirst=True)

    df["week_gross"] = df.apply(get_week_box_office, axis=1, archive=archive)

    return df


def fetch():
    archive_path = "./data/archive.csv"
    load_dotenv()
    source_url = os.environ.get("source_url")
    excel_file = get_excel_file(source_url)
    df = extract_box_office(excel_file + ".xls", "week", archive_path)
    df.to_csv("./data/week.csv", index=False)
    print("Fetched + extracted")


def extract():
    archive_path = "./data/archive.csv"
    df = extract_box_office(args.file, "week", archive_path)
    df.to_csv("./data/week.csv", index=False)
    print("Extracted to /data/week.csv")
