"""ETL Pipeline for box office data"""

import urllib.request
from datetime import datetime, timedelta
from tokenize import String
from typing import Any, Dict, List, Tuple

import pandas as pd
import requests  # type: ignore
from bs4 import BeautifulSoup
from flask import current_app
from slugify import slugify  # type: ignore

from ukbo import models, utils
from ukbo.extensions import db


def get_excel_file(source_url: str) -> Tuple[bool, str]:
    """
    Fetches first (latest) excel file on the source page
    Returns whether fetch has been succesful, and path to the file
    """

    soup = BeautifulSoup(
        requests.get(source_url, timeout=5).content, "html.parser"
    )

    page = soup.find("article")
    # First link in the class
    link = page.find_all("a")[0]
    if link is not None:
        excel_link = link.get("href")
        excel_title = link.find("span").get_text().split("-")[-1]
        current_app.logger.info(f"ETL fetch - Found {excel_title}.")

        # Checks whether this excel file is new against the database
        excel_date = datetime.strptime(excel_title, "%d %B %Y")
        query = db.session.query(models.Film_Week)
        first = query.order_by(models.Film_Week.date.desc()).first()
        if first is not None:
            last_date = first.date

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
    df["film"] = df["film"].map(utils.spellcheck_film)
    df["distributor"] = df["distributor"].map(utils.spellcheck_distributor)
    df["country"] = df["country"].map(utils.spellcheck_country)
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


def load_distributors(list_of_distributors: List[str]) -> None:
    """
    Loads a list of distributors into the database
    """

    for distributor in list_of_distributors:
        distributor = str(distributor.strip())
        add_distributor(distributor)
        db.session.commit()


def load_countries(list_of_countries: List[str]) -> None:
    """
    Loads a list of countries into the database
    """

    for country in list_of_countries:
        add_country(country)
        db.session.commit()


def load_films(list_of_films: List[Dict[str, Any]]) -> None:
    """
    Loads a list of films into the database
    """

    for film in list_of_films:
        distributor = add_distributor(film["distributor"])
        countries = add_country(film["country"])
        film = add_film(
            film=film["film"], distributor=distributor, countries=countries
        )
        db.session.commit()


def load_weeks(df: pd.DataFrame, **kwargs: Any) -> None:
    """
    Loads nested lists of film weeks into the database
    And their associated film + distributor
    """

    df["date"] = pd.to_datetime(df["date"], format="%Y%m%d", yearfirst=True)
    if kwargs["year"]:
        year = kwargs.get("year")
        df = df.loc[df["date"].dt.year == year]

    group_films = (
        df.groupby(["film", "distributor", "country"])
        .apply(
            lambda x: x[
                [
                    "date",
                    "rank",
                    "weekend_gross",
                    "weeks_on_release",
                    "number_of_cinemas",
                    "total_gross",
                    "week_gross",
                ]
            ].to_dict("records")
        )
        .reset_index()
        .rename(columns={0: "weeks"})
    )
    films_list = group_films.to_dict(orient="records")

    for film in films_list:
        countries = add_country(film["country"]) if "country" in film else ""
        distributor = add_distributor(str(film["distributor"]))
        title = add_film(str(film["film"]), distributor, countries)  # type: ignore

        record = {
            "film": title,
            "distributor": distributor,
        }

        for week in film["weeks"]:
            add_week(**week)

            if week["number_of_cinemas"] > 0:
                week["site_average"] = (
                    week["weekend_gross"] / week["number_of_cinemas"]
                )
            else:
                week["site_average"] = 0

            record.update(**week)
            models.Film_Week.create(**record, commit=False)

        db.session.commit()


def add_week(
    date: datetime,
    week_gross: int,
    weekend_gross: int,
    number_of_cinemas: int,
    weeks_on_release: int,
    **kwargs: Any,
) -> None:
    """
    Adds a new week for each new data import.
    """
    week = models.Week.query.filter_by(date=date).first()

    if week and date == week.date:
        week.weekend_gross += weekend_gross
        week.week_gross += week_gross
        # Maximum number of cinemas
        if number_of_cinemas > week.number_of_cinemas:
            week.number_of_cinemas = number_of_cinemas
        # Adding the number of films if it's the first week
        if weeks_on_release == 1:
            week.number_of_releases += 1
        return None

    number_of_releases = 1 if weeks_on_release == 1 else 0

    new_week = {
        "date": date,
        "week_gross": week_gross,
        "weekend_gross": weekend_gross,
        "number_of_cinemas": number_of_cinemas,
        "number_of_releases": number_of_releases,
    }

    models.Week.create(**new_week, commit=False)

    return None


def add_film(
    film: str, distributor: models.Distributor, countries: List[models.Country]
) -> models.Film:
    """
    Checks the database if the film exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    film = film.strip()

    instance = models.Film.query.filter_by(
        name=film, distributor=distributor
    ).first()
    if instance:
        return instance

    new = models.Film(name=film, distributor=distributor, countries=countries)
    try:
        new.save()
    except Exception:
        # Film exists but with a different distributor
        print(f"Duplicate {film}")
        db.session.rollback()
        slug = slugify(f"{film}-{distributor.name}")
        new.slug = slug
        new.save()
    return new


def add_distributor(distributor: str) -> models.Distributor:
    """
    Checks the database if the distributor exists - returns the class
    If not - creates it, adds it to the database and returns it
    """
    distributor = distributor.strip()
    slug = slugify(distributor)

    instance = models.Distributor.query.filter_by(slug=slug).first()
    if instance:
        return instance

    return models.Distributor.create(name=distributor, commit=False)


def add_country(country: str) -> List[models.Country]:
    """
    Splits up the string of countries, and one by one.
    Maps it to the full country name.
    Checks the database if the country exists.
    If not - creates it, adds it to the database.
    Returns a list of the countries
    """
    new_countries: List[models.Country] = []
    if type(country) == float:
        return new_countries
    country = country.strip()
    countries = country.split("/")
    for i in countries:
        i = i.strip()
        i = utils.spellcheck_country(i)
        slug = slugify(i)
        db_country = models.Country.query.filter_by(slug=slug).first()

        if db_country and slug == db_country.slug:
            new_countries.append(db_country)
        else:
            new = models.Country.create(name=i, commit=False)
            new_countries.append(new)
    return new_countries
