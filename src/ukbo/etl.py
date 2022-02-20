"""ETL Pipeline for box office data"""

import os
import urllib.request
from datetime import datetime, timedelta
from typing import Any, List, Tuple

import pandas as pd
import requests  # type: ignore
from bs4 import BeautifulSoup
from flask import current_app
from slugify import slugify  # type: ignore

from ukbo import db, models


def get_excel_file(source_url: str) -> Tuple[bool, str]:
    """
    Fetches first (latest) excel file on the source page
    Returns whether fetch has been succesful, and path to the file
    """
    soup = BeautifulSoup(
        requests.get(source_url, timeout=5).content, "html.parser"
    )

    all = soup.find("article")
    # First link in the class
    link = all.find_all("a")[0]
    if link is not None:
        excel_link = link.get("href")
        excel_title = link.find("span").get_text().split("-")[-1]
        current_app.logger.info(f"ETL fetch - Found {excel_title}.")

        # Checks whether this excel file is new against the database
        excel_date = datetime.strptime(excel_title, "%d %B %Y")
        query = db.session.query(models.Film_Week)
        last_date = query.order_by(models.Film_Week.date.desc()).first().date

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

    # TODO: This should really be from the filename
    date = get_last_sunday()
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
        }
    )

    df.insert(0, "date", date)
    df["film"] = df["film"].map(spellcheck_film)
    df["distributor"] = df["distributor"].map(spellcheck_distributor)
    df["country"] = df["country"].map(spellcheck_country)
    df["week_gross"] = df.apply(get_week_box_office, axis=1)

    return df


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
        models.Film_Week.query.filter(
            models.Film_Week.film.has(name=film),
            models.Film_Week.date >= previous_period,
            models.Film_Week.date <= filter_date,
        )
        .order_by(models.Film_Week.total_gross.desc())
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


def get_last_sunday() -> str:
    # Returns the previous sunday date for week extract
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    return sunday.strftime("%Y%m%d")


def spellcheck_film(film_title: pd.Series) -> str:
    """
    Uses a list of the common film mistakes and returns the actual ones
    Alo generally cleans up the title
    """
    film_title = film_title.strip().upper()
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


def spellcheck_distributor(distributor: pd.Series) -> str:
    """
    Uses a list of the common distributor mistakes and returns the correction
    """
    distributor = distributor.strip().upper()
    dist_list = pd.read_csv("./data/distributor_check.csv", header=None)
    dist_list.columns = ["key", "correction"]

    if distributor in dist_list["key"].values:
        dist_list = dist_list[dist_list["key"].str.match(distributor)]
        distributor = dist_list["correction"].iloc[0]
    return distributor


def spellcheck_country(country: str) -> str:
    """
    Uses a list of the common country mistakes and returns the correction
    """
    country = country.strip().upper()
    country_list = pd.read_csv("./data/country_check.csv", header=None)
    country_list.columns = ["key", "correction", "flag"]

    if country in country_list["key"].values:
        country_list = country_list[country_list["key"].str.match(country)]
        country = country_list["correction"].iloc[0]
    return country


def load_dataframe(archive: pd.DataFrame) -> None:
    """
    Loads a films dataframe into the database
    """
    archive["date"] = pd.to_datetime(
        archive["date"], format="%Y%m%d", yearfirst=True
    )

    list_of_films = [
        row.dropna().to_dict() for index, row in archive.iterrows()
    ]

    for i in list_of_films:
        i["country"] = add_country(i["country"]) if "country" in i else ""
        i["distributor"] = add_distributor(str(i["distributor"]))
        i["film"] = add_film(str(i["film"]), i["distributor"], i["country"])
        add_week(
            i["date"],
            i["week_gross"],
            i["weekend_gross"],
            i["number_of_cinemas"],
            i["weeks_on_release"],
        )
        if i["number_of_cinemas"] > 0:
            i["site_average"] = i["weekend_gross"] / i["number_of_cinemas"]
        else:
            i["site_average"] = 0

        i.pop("country", None)

        film_week = models.Film_Week(**i)
        db.session.add(film_week)
        db.session.commit()


def add_week(
    date: datetime,
    week_gross: int,
    weekend_gross: int,
    number_of_cinemas: int,
    weeks_on_release: int,
) -> None:
    """
    Adds a new week for each new data import.
    """
    week = models.Week.query.filter_by(date=date).first()

    if week and date == week.date:
        week.weekend_gross += weekend_gross
        week.week_gross += week_gross
        if number_of_cinemas > week.number_of_cinemas:
            week.number_of_cinemas = number_of_cinemas
        if weeks_on_release == 1:
            week.number_of_releases += 1
        db.session.commit()
        return None

    number_of_releases = 1 if weeks_on_release == 1 else 0

    new_week = {
        "date": date,
        "week_gross": week_gross,
        "weekend_gross": weekend_gross,
        "number_of_cinemas": number_of_cinemas,
        "number_of_releases": number_of_releases,
    }

    new = models.Week(**new_week)
    db.session.add(new)
    db.session.commit()

    return None


def add_film(
    film: str, distributor: models.Distributor, countries: List[models.Country]
) -> models.Film:
    """
    Checks the database if the film exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    film = film.strip()
    slug = slugify(film)
    db_film = models.Film.query.filter_by(slug=slug).first()

    if db_film and slug == db_film.slug:
        return db_film

    new = models.Film(name=film, distributor=distributor)
    for i in countries:
        new.countries.append(i)

    db.session.add(new)
    db.session.commit()
    return new


def add_distributor(distributor: str) -> models.Distributor:
    """
    Checks the database if the distributor exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    distributor = distributor.strip()
    slug = slugify(distributor)
    db_distributor = models.Distributor.query.filter_by(slug=slug).first()

    if db_distributor and slug == db_distributor.slug:
        return db_distributor

    new = models.Distributor(name=distributor)
    db.session.add(new)
    db.session.commit()
    return new


def add_country(country: str) -> List[models.Country]:
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
        i = i.strip()
        i = spellcheck_country(i)
        slug = slugify(i)
        db_country = models.Country.query.filter_by(slug=slug).first()

        if db_country and slug == db_country.slug:
            new_countries.append(db_country)
        else:
            new = models.Country(name=i)
            db.session.add(new)
            db.session.commit()
            new_countries.append(new)
    return new_countries
