import urllib.request
from datetime import datetime
from typing import Tuple

import pandas as pd
import requests  # type: ignore
from bs4 import BeautifulSoup
from flask import current_app
from ukbo import models, services
from ukbo.extensions import db

from . import transform


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
    date = transform.get_last_sunday()
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
    df["film"] = df["film"].map(services.utils.spellcheck_film)
    df["distributor"] = df["distributor"].map(
        services.utils.spellcheck_distributor
    )
    df["country"] = df["country"].map(services.utils.spellcheck_country)
    df["week_gross"] = df.apply(transform.get_week_box_office, axis=1)

    return df
