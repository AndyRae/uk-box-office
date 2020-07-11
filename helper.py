import argparse
import csv
import os
import math
import xlrd
import pandas as pd
import gspread
import requests
import urllib
from oauth2client.service_account import ServiceAccountCredentials
from google.cloud import bigquery
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from googleapiclient.discovery import build

from settings import sheet_id


def get_excel_file(source_url):
    # Fetches first (latest) excel file on the source page
    soup = BeautifulSoup(requests.get(source_url, timeout=3).content, "html.parser")

    for row in soup.find_all("div", {"class": "bfi-download-cell"}):
        excel_element = row.find("a")
        if excel_element:
            excel_link = excel_element.get("href")
            excel_title = excel_link.split("/")[-1]
            print(excel_title)
            urllib.request.urlretrieve(excel_link, excel_title)
            return excel_title
            break


def spellcheck_distributor(distributor):
    # Uses a list of the common distributor mistakes and returns the actual ones
    dist_list = pd.read_csv("./data/distributor_check.csv", header=None)
    dist_list.columns = ["key", "correction"]

    if distributor in dist_list["key"].values:
        dist_list = dist_list[dist_list["key"].str.match(distributor)]
        distributor = dist_list["correction"].iloc[0].strip()
    return distributor


def spellcheck_film(film_title):
    # Uses a list of the common film mistakes and returns the actual ones
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


def get_last_sunday():
    # Returns the previous sunday date for week extract
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    return sunday.strftime("%Y%m%d")


def get_week_box_office(row):
    """ Iterate over dataset to find the difference between weeks of films.
    Returns the actual weekly box office.
    """
    title = row["title"]
    print(title)

    if row["weeks_on_release"] == 1:
        return row["total_gross"]
    else:
        archive = pd.read_csv("./data/archive.csv")

        date = pd.to_datetime(row["date"], format="%Y%m%d", yearfirst=True)
        previous_year = date - timedelta(days=1095)
        archive["date"] = pd.to_datetime(
            archive["date"], format="%Y%m%d", yearfirst=True
        )

        films_filter = (
            (archive["title"] == title)
            & (archive["date"] > previous_year)
            & (archive["date"] < date)
        )

        films_list = archive[films_filter]

        # TODO: yuch lets define types in the extraction not here
        week_gross = float(row["total_gross"]) - float(films_list["total_gross"].max())
        print(week_gross)

        if type(week_gross) == float and math.isnan(week_gross):
            return row["weekend_gross"]
        else:
            return float(week_gross)


def extract_box_office(filename, arg):
    """ Main extract/load function, transforming xls to csv.
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
        date = filename.strip(".xls").strip("./archive-data/")
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
        df["week_gross"] = df.apply(lambda row: get_week_box_office(row), axis=1)

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

    if arg == "week":
        df.to_csv("./data/week.csv", index=False)
    elif arg == "archive":
        df.to_csv("./data/archive.csv", mode="a", index=False, header=False)


def build_archive():
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

    df.to_csv("./data/archive.csv", mode="a", index=False, header=True)

    for filename in os.listdir("./archive-data/"):
        if filename.endswith("xls"):
            print(filename)
            path = "./archive-data/" + filename
            extract_box_office(path, "archive")

    print("Done")


def transform_archive(filename):
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

    df["week_gross"] = df.apply(lambda row: get_week_box_office(row), axis=1)

    df.to_csv("./data/transformed_archive.csv", index=False)


def load_to_bigquery(filename, dataset_id, table_id):
    from google.cloud import bigquery

    client = bigquery.Client()

    dataset_ref = client.dataset(dataset_id)
    table_ref = dataset_ref.table(table_id)
    job_config = bigquery.LoadJobConfig()
    job_config.source_format = bigquery.SourceFormat.CSV
    job_config.skip_leading_rows = 1
    job_config.autodetect = True

    with open(filename, "rb") as source_file:
        job = client.load_table_from_file(source_file, table_ref, job_config=job_config)

    job.result()  # Waits for table load to complete.

    print("Loaded {} rows into {}:{}.".format(job.output_rows, dataset_id, table_id))


def load_to_sheet(file):
    scope = ["https://spreadsheets.google.com/feeds"]
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json", scope
    )
    gc = gspread.authorize(credentials)
    worksheet = gc.open_by_key(sheet_id).worksheet("Sheet2")

    with open(file, "r") as csv_input:
        reader = csv.reader(csv_input)
        next(reader)

        for row in reader:
            worksheet.append_row(row, value_input_option="USER_ENTERED")
