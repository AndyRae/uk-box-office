from datetime import datetime
from typing import Any, Dict, List

import pandas as pd
from slugify import slugify  # type: ignore
from ukbo import models


def group_by_date(data: List[Any]) -> Dict[str, Any]:
    """
    Calculates the statistics by date given a list of weeks
    Not currently in use.
    """
    df = pd.DataFrame(
        [i.as_df() for i in data],
        columns=[
            "date",
            "week_gross",
            "weekend_gross",
            "number_of_cinemas",
            "id",
            "total_gross",
            "weeks_on_release",
            "rank",
            "site_average",
        ],
    )

    df = (
        df.groupby(["date"])
        .agg(
            {
                "week_gross": ["sum"],
                "weekend_gross": ["sum"],
                "number_of_cinemas": ["max"],
                "id": ["size"],
                "site_average": ["mean"],
            }
        )
        .sort_values(by=["date"])
    )
    df.columns = df.columns.get_level_values(0)
    df["pct_change_week"] = df["week_gross"].pct_change() * 100
    return df.reset_index().to_dict(orient="records")


def group_by_year(data: List[Any]) -> Dict[str, Any]:
    df = pd.DataFrame(
        [i.as_df() for i in data],
        columns=[
            "date",
            "week_gross",
            "weekend_gross",
            "number_of_releases",
            "number_of_cinemas",
        ],
    )

    df = (
        df.groupby(pd.Grouper(key="date", freq="Y"))
        .agg(
            {
                "week_gross": ["sum"],
                "weekend_gross": ["sum"],
                "number_of_releases": ["sum"],
                "number_of_cinemas": ["max"],
            }
        )
        .sort_values(by=["date"])
    )
    df.columns = df.columns.get_level_values(0)
    df["pct_change"] = df["week_gross"].pct_change() * 100
    return df.reset_index().to_dict(orient="records")


def group_by_film(data: List[Any]) -> Dict[str, Any]:
    """
    Calculates the total gross per film for this collection of weeks
    """
    table_size = 100
    df = pd.DataFrame(
        [i.as_df2() for i in data],
        columns=[
            "title",
            "slug",
            "weekend_gross",
            "week_gross",
            "number_of_cinemas",
            "weeks_on_release",
            "site_average",
        ],
    )

    df = (
        df.groupby(["title", "slug"])
        .agg(
            {
                "number_of_cinemas": ["max"],
                "week_gross": ["sum"],
                "weekend_gross": ["sum"],
                "weeks_on_release": ["max"],
                "site_average": ["mean"],
            }
        )
        .sort_values(by=("weekend_gross", "sum"), ascending=False)
    ).head(table_size)

    df.columns = df.columns.droplevel(1)
    return df.reset_index().to_dict(orient="records")


def group_by_distributor(data: List[Any]) -> Any:
    """
    Calculates statistics per distributor for this collection of weeks
    """
    df = pd.DataFrame(
        [i.as_dict() for i in data],
        columns=["date", "distributor", "week_gross", "film"],
    )
    df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d")

    df = (
        df.groupby([pd.Grouper(key="date", freq="Y"), "distributor"])
        .agg(
            {
                "film": ["nunique"],
                "week_gross": ["sum"],
            }
        )
        .sort_values(by=("week_gross", "sum"), ascending=False)
        .rename(columns={"sum": "total", "nunique": "count"})
    )
    df.columns = df.columns.droplevel(0)

    # calculate market share by year
    df["market_share"] = df.groupby("date")["total"].transform(
        lambda x: (x / x.sum()) * 100
    )

    # make a top 10 all time, remove others (this is the place to create 'others')
    top = (
        df.groupby(["distributor"])
        .sum()
        .sort_values(by="total", ascending=False)[:10]
    )
    df.reset_index(inplace=True)
    df = df[df["distributor"].isin(top.index)]

    years = df["date"].unique()
    years.sort()

    # create json
    # filter dataframe by distributor + date, then extract values to dict
    graph_data = []
    for i in top.index:
        market_share: List[float] = []
        total: List[float] = []
        count: List[int] = []

        for y in years:
            f = df[(df["distributor"] == i) & (df["date"] == y)]
            if not f.empty:
                market_share.append(f["market_share"].item())
                total.append(f["total"].item())
                count.append(f["count"].item())
            else:
                market_share.append(0)
                total.append(0)
                count.append(0)

        distributor = {
            "label": i,
            "slug": slugify(i),
            "market_share": market_share,
            "total": total,
            "count": count,
        }
        graph_data.append(distributor)

    # convert to years
    years = pd.to_datetime(years).year

    return graph_data, years


def group_by_country(data: List[Any]) -> Any:
    """
    Calculates statistics per country for this collection of weeks
    """
    df = pd.DataFrame(
        [i.as_dict() for i in data],
        columns=["date", "distributor", "week_gross", "film"],
    )
    df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d")

    df = (
        df.groupby([pd.Grouper(key="date", freq="Y"), "country"])
        .agg(
            {
                "film": ["nunique"],
                "week_gross": ["sum"],
            }
        )
        .sort_values(by=("week_gross", "sum"), ascending=False)
        .rename(columns={"sum": "total", "nunique": "count"})
    )
    df.columns = df.columns.droplevel(0)

    # calculate market share by year
    df["market_share"] = df.groupby("date")["total"].transform(
        lambda x: (x / x.sum()) * 100
    )

    # make a top 10 all time, remove others (this is the place to create 'others')
    top = (
        df.groupby(["distributor"])
        .sum()
        .sort_values(by="total", ascending=False)[:10]
    )
    df.reset_index(inplace=True)
    df = df[df["distributor"].isin(top.index)]

    years = df["date"].unique()
    years.sort()

    # create json
    # filter dataframe by distributor + date, then extract values to dict
    graph_data = []
    for i in top.index:
        market_share: List[float] = []
        total: List[float] = []
        count: List[int] = []

        for y in years:
            f = df[(df["distributor"] == i) & (df["date"] == y)]
            if not f.empty:
                market_share.append(f["market_share"].item())
                total.append(f["total"].item())
                count.append(f["count"].item())
            else:
                market_share.append(0)
                total.append(0)
                count.append(0)

        distributor = {
            "label": i,
            "slug": slugify(i),
            "market_share": market_share,
            "total": total,
            "count": count,
        }
        graph_data.append(distributor)

    # convert to years
    years = pd.to_datetime(years).year

    return graph_data, years


def get_statistics(
    data: List[models.Week], previous: List[models.Week]
) -> Dict[str, int]:
    """
    Calculates statistics given a list of date data
    """
    df = pd.DataFrame(
        [i.as_df() for i in data],
        columns=[
            "date",
            "week_gross",
            "weekend_gross",
            "number_of_releases",
            "number_of_cinemas",
        ],
    )
    total_gross = df["week_gross"].sum()
    weekend_gross = df["weekend_gross"].sum()
    number_of_release = df["number_of_releases"].sum()

    prev_df = pd.DataFrame(
        [i.as_df() for i in previous],
        columns=[
            "date",
            "week_gross",
            "weekend_gross",
            "number_of_releases",
            "number_of_cinemas",
        ],
    )
    prev_total_gross = prev_df["week_gross"].sum()
    prev_weekend_gross = prev_df["weekend_gross"].sum()
    prev_number_of_release = prev_df["number_of_releases"].sum()

    return {
        "total_box_office": df["week_gross"].sum(),
        "weekend_box_office": df["weekend_gross"].sum(),
        "number_of_releases": df["number_of_releases"].sum(),
        "number_of_cinemas": df["number_of_cinemas"].max(),
        "total_pct_change": (total_gross - prev_total_gross)
        / prev_total_gross,
        "weekend_pct_change": (weekend_gross - prev_weekend_gross)
        / prev_weekend_gross,
        "total_actual_change": total_gross - prev_total_gross,
        "weekend_actual_change": weekend_gross - prev_weekend_gross,
        "releases_actual_change": number_of_release - prev_number_of_release,
    }


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


def to_date(date_string: str = "2000-01-20") -> datetime:
    """
    Converts date string to a date object.
    Helper function for the main api endpoint.
    """
    return datetime.strptime(date_string, "%Y-%m-%d")
