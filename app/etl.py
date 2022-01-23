"""ETL Pipeline for box office data"""

import os
import urllib.request
from datetime import datetime, timedelta
from typing import List, Tuple

import pandas as pd
import requests  # type: ignore
from bs4 import BeautifulSoup
from flask import current_app

from app import db, models


def get_country(country: str) -> List[models.Country]:
    """
    Splits up the string of countries, and one by one.
    Maps it to the full country name.
    Checks the database if the country exists.
    If not - creates it, adds it to the database.
    Returns a list of the countries
    """
    country = country.strip()
    countries = country.split("/")
    new_countries = []
    for i in countries:

        i = spellcheck_country(i)
        filtered_countries = models.Country.query.filter_by(name=i).first()

        if i == filtered_countries:
            new_countries.append(filtered_countries)
        else:
            new = models.Country(name=i)
            db.session.add(new)
            db.session.commit()
            new_countries.append(new)
    return new_countries


def get_distributor(distributor: str) -> models.Distributor:
    """
    Checks the database if the distributor exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    distributor = distributor.strip()
    filtered_distributors = models.Distributor.query.filter_by(
        name=distributor
    ).first()

    if distributor == filtered_distributors:
        return filtered_distributors
    new = models.Distributor(name=distributor)
    db.session.add(new)
    db.session.commit()
    return new


def get_film(
    film: str, distributor: models.Distributor, countries: List[models.Country]
) -> models.Film:
    """
    Checks the database if the film exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    film = film.strip()
    filtered_films = models.Film.query.filter_by(name=film).first()

    if film == filtered_films:
        return filtered_films
    new = models.Film(name=film, distributor=distributor)
    for i in countries:
        new.countries.append(i)

    db.session.add(new)
    db.session.commit()
    return new


def load_dataframe(archive: pd.DataFrame) -> None:
    """
    Loads a films dataframe into the database
    """
    archive["date"] = pd.to_datetime(
        archive["date"], format="%Y%m%d", yearfirst=True
    )

    list_of_films = [row.to_dict() for index, row in archive.iterrows()]

    for i in list_of_films:
        i["country"] = get_country(i["country"])
        i["distributor"] = get_distributor(i["distributor"])
        i["film"] = get_film(i["film"], i["distributor"], i["country"])

        i.pop("country", None)

        week = models.Week(**i)
        db.session.add(week)
        db.session.commit()


def get_excel_file(source_url: str) -> Tuple[bool, str]:
    """
    Fetches first (latest) excel file on the source page
    Returns whether fetch has been succesful, and path to the file
    """
    # Fetches first (latest) excel file on the source page
    soup = BeautifulSoup(
        requests.get(source_url, timeout=5).content, "html.parser"
    )

    all = soup.find("article")
    # First link in the class
    link = all.find_all("a")[0]
    if link is not None:
        excel_link = link.get("href")
        excel_title = link.find("span").get_text().split("to ")[-1]
        current_app.logger.info(f"ETL fetch - Found {excel_title}.")

        # Checks whether this excel file is new against the database
        excel_date = datetime.strptime(excel_title, "%d %B %Y")
        query = db.session.query(models.Week)
        last_date = query.order_by(models.Week.date.desc()).first().date

        if excel_date <= last_date:
            current_app.logger.warning(
                "ETL fetch failed - website file is pending update."
            )
            return (False, "")

        file_path = f"./data/{excel_title}.xls"
        urllib.request.urlretrieve(excel_link, file_path)
        return (True, file_path)
    current_app.logger.error("ETL fetch failed - couldn't download file.")
    return (False, "")


def spellcheck_country(country: str) -> str:
    """
    Uses a list of the common distributor mistakes and returns the correction
    """
    country_list = pd.read_csv("./data/country_check.csv", header=None)
    country_list.columns = ["key", "correction", "flag"]

    if country in country_list["key"].values:
        country_list = country_list[country_list["key"].str.match(country)]
        country = country_list["correction"].iloc[0]
    return country


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


def get_week_box_office(row: pd.Series) -> int:
    """
    Calculates the actual box office for the week
    Checks if its the first week of the film - if so, returns total box office
    If not - it subtracts the current total, from last weeks total
    Parameters: The row of the dataframe
    Returns the week box office
    Used in an apply method with pandas.
    """
    film = row["film"]

    # If it's week 1
    if row["weeks_on_release"] == 1:
        return row["total_gross"]
    """
    days_to_look_back is a tradeoff
    Increasing gives more accurate data for some films.
    but for others it creates inaccurate data, as the source is unreliable.
    """
    days_to_look_back = 90
    filter_date = pd.to_datetime(row["date"], format="%Y%m%d", yearfirst=True)
    previous_period = filter_date - timedelta(days=days_to_look_back)

    most_recent_film_match = (
        models.Week.query.filter(
            models.Film.name == film,
            # models.Week.film.name == film,
            models.Week.date >= previous_period,
            models.Week.date <= filter_date,
        )
        .order_by(models.Week.total_gross.desc())
        .first()
    )

    # If there's no matches
    if most_recent_film_match is None:
        return row["weekend_gross"]

    week_gross = row["total_gross"] - most_recent_film_match.total_gross

    # There are errors in the data week numbers
    if week_gross < 0:
        return row["weekend_gross"]

    return week_gross


def extract_box_office(filename: str) -> pd.DataFrame:
    """
    Main extract/load function, transforming raw box office .xls to dataframe.
    """
    df = pd.read_excel(filename)

    header = df.iloc[0]
    df = df.iloc[1:]
    df.columns = header

    df = df.dropna(subset=["Rank"])
    df = df.dropna(how="all", axis=1, thresh=5)

    date = (
        get_last_sunday()
    )  # TODO: This should really be from the filename nowadays
    df = df.drop(
        columns=["% change on last week", "Site average"], errors="ignore"
    )

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
    df = df.dropna(how="all", axis=1, thresh=2)

    df.insert(0, "date", date)
    df["film"] = df["film"].astype(str).str.upper().str.strip()
    df["country"] = df["country"].astype(str).str.upper().str.strip()
    df["distributor"] = df["distributor"].astype(str).str.upper().str.strip()

    df["film"] = df["film"].map(spellcheck_film)
    df["distributor"] = df["distributor"].map(spellcheck_distributor)
    df["country"] = df["country"].map(spellcheck_country)

    df["week_gross"] = df.apply(get_week_box_office, axis=1)

    df = df.astype(
        {
            "rank": int,
            "film": str,
            "country": str,
            "weekend_gross": int,
            "distributor": str,
            "weeks_on_release": int,
            "number_of_cinemas": int,
            "total_gross": int,
            "week_gross": int,
        }
    )

    return df


def build_archive() -> None:
    """
    Legacy function for building the archive from raw excel files.
    Keep this function if it's needed again
    But it is not used in the programme.
    """
    df = pd.DataFrame(
        columns=[
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
    )

    df.to_csv("./data/built-archive.csv", mode="a", index=False, header=True)

    archive_path = "./archive-data/"

    for filename in os.listdir(archive_path):
        if filename.endswith("xls"):
            print(filename)
            path = archive_path + filename
            films = extract_box_office(path)
            df = df.append(films)

    df.to_csv("./data/built-archive.csv", mode="a", index=False, header=False)


def transform_archive(filename: str) -> None:
    """
    Legacy function for transforming the archive from raw excel files.
    Keep this function if it's needed again.
    But it is not used in the programme.
    """
    df = pd.read_csv(filename)

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

    archive = pd.read_csv("./data/archive.csv")
    archive["date"] = pd.to_datetime(
        archive["date"], format="%Y%m%d", yearfirst=True
    )

    df["week_gross"] = df.apply(get_week_box_office, axis=1, archive=archive)

    return df
