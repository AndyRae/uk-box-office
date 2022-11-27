from typing import Any, Dict, List

import pandas as pd
from ukbo import models, services
from ukbo.extensions import db


def load_distributors(list_of_distributors: List[str]) -> None:
    """
    Loads a list of distributors into the database
    """

    for distributor in list_of_distributors:
        distributor = str(distributor.strip())
        services.distributor.add_distributor(distributor)
        db.session.commit()


def load_countries(list_of_countries: List[str]) -> None:
    """
    Loads a list of countries into the database
    """

    for country in list_of_countries:
        services.country.add_country(country)
        db.session.commit()


def load_films(list_of_films: List[Dict[str, Any]]) -> None:
    """
    Loads a list of films into the database
    """

    for film in list_of_films:
        distributor = services.distributor.add_distributor(film["distributor"])
        countries = services.country.add_country(film["country"])
        film = services.film.add_film(
            film=film["film"], distributor=distributor, countries=countries
        )
        db.session.commit()


def load_weeks(df: pd.DataFrame, **kwargs: Any) -> None:
    """
    Loads nested lists of film weeks into the database
    And their associated film + distributor
    """

    df["date"] = pd.to_datetime(df["date"], format="%Y%m%d", yearfirst=True)
    if "year" in kwargs:
        year = kwargs.get("year")
        df = df.loc[df["date"].dt.year == year]

    group_films = (
        df.groupby(["film", "distributor", "country"], dropna=False)
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
        countries = (
            services.country.add_country(film["country"])
            if "country" in film
            else ""
        )
        distributor = services.distributor.add_distributor(
            str(film["distributor"])
        )
        title = services.film.add_film(str(film["film"]), distributor, countries)  # type: ignore

        record = {
            "film": title,
            "distributor": distributor,
        }

        for week in film["weeks"]:
            services.week.add_week(**week)

            if week["number_of_cinemas"] > 0:
                week["site_average"] = (
                    week["weekend_gross"] / week["number_of_cinemas"]
                )
            else:
                week["site_average"] = 0

            record.update(**week)
            models.Film_Week.create(**record, commit=False)

        db.session.commit()
