import urllib.request
from datetime import datetime
from typing import Any, Dict, Optional, Tuple

import pandas as pd
import requests  # type: ignore
from bs4 import BeautifulSoup
from flask import current_app
from ukbo import models, services
from ukbo.extensions import db

from . import transform


def get_soup(url: str) -> BeautifulSoup:
    """
    Gets the page soup from the url.

    Args:
        url: URL of the page.

    Returns:
        BeautifulSoup object.
    """

    opener = urllib.request.build_opener()
    opener.addheaders = [("User-agent", "Mozilla/5.0")]

    return BeautifulSoup(requests.get(url, timeout=5).content, "html.parser")


def check_file_new(excel_title: str) -> bool:
    """
    Checks whether this excel file is new against the database.

    Args:
        excel_title: Title of the excel file, which is the date.

    Returns:
        Whether the file is new.

    """
    excel_date = datetime.strptime(excel_title, "%d %B %Y")
    query = db.session.query(models.Film_Week)
    first = query.order_by(models.Film_Week.date.desc()).first()

    if first is not None:
        last_date = first.date

        if excel_date <= last_date:
            current_app.logger.warning(
                "ETL fetch failed - website file is pending update."
            )
            return False
    return True


def download_excel(excel_link: str, excel_title: str) -> str:
    """
    Downloads the excel file from the link.

    Args:
        excel_link: Link to the excel file.
        excel_title: Title of the excel file.

    Returns:
        Path to the file.

    """
    file_path = f"./data/{excel_title}.xls"
    opener = urllib.request.build_opener()
    opener.addheaders = [("User-agent", "Mozilla/5.0")]
    urllib.request.install_opener(opener)
    urllib.request.urlretrieve(excel_link, file_path)
    return file_path


def find_excel_file(soup: BeautifulSoup) -> Dict[str, Any]:
    """
    Finds the first (latest) excel file on the source page.

    Args:
        soup: BeautifulSoup object of the source page.

    Returns:
        Path to the file.
    """

    page = soup.find("article")
    # First link in the class
    link = page.find_all("a")[0]
    if link is not None:
        excel_link = link.get("href")
        excel_title = link.find("span").get_text().split("-")[-1]
        current_app.logger.info(f"ETL fetch - Found {excel_title}.")
        return {"link": excel_link, "title": excel_title}
    return {"link": None, "title": None}


def get_excel_file(soup: BeautifulSoup) -> Optional[str]:
    """
    Gets the first (latest) excel file on the source page.

    Args:
        soup: BeautifulSoup object of the source page.

    Returns:
        Path to the downloaded file.
    """
    excel = find_excel_file(soup)

    if excel["link"] is not None:
        if check_file_new(excel["link"]):
            return download_excel(excel["link"], excel["title"])
        current_app.logger.warning(
            "ETL fetch failed - website file is pending update."
        )
        return None

    current_app.logger.error("ETL fetch failed - couldn't download file.")
    return None


def extract_box_office(path: str) -> pd.DataFrame:
    """
    Extracts box office data from excel file.

    This is the main extract function, from raw box office .xls to dataframe.

    Args:
        Path: Path to the excel file.

    Returns:
        Dataframe of box office data.
    """

    df = pd.read_excel(path)

    header = df.iloc[0]
    df = df.iloc[1:]
    df.columns = header

    df = df.dropna(subset=["Rank"])
    df = df.dropna(axis=1, thresh=5)

    # get the filename from the path and convert to date
    filename = path.split("/")[-1].strip(".xls")
    date = datetime.strptime(filename, "%d %B %Y").strftime("%Y%m%d")

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
    df = df.dropna(axis=1, thresh=2)

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
    df["film"] = df["film"].map(services.film.spellcheck_film)
    df["distributor"] = df["distributor"].map(
        services.distributor.spellcheck_distributor
    )
    df["country"] = df["country"].map(services.country.spellcheck_country)
    df["week_gross"] = df.apply(transform.get_week_box_office, axis=1)

    return df
