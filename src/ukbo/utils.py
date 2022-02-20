from typing import Any, Dict, List

import pandas as pd
from slugify import slugify  # type: ignore


def group_by_date(data: List[Any]) -> Dict[str, Any]:
    """
    Calculates the statistics by date given a list of weeks
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
            "releases",
        ],
    )

    df = (
        df.groupby(pd.Grouper(key="date", freq="Y"))
        .agg(
            {
                "week_gross": ["sum"],
                "releases": ["sum"],
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
        .sort_values(by=("week_gross", "sum"), ascending=False)
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
