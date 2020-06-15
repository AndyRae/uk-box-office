import argparse
import csv
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
    with open("./data/distributor_check.csv", "r") as distributor_list:
        reader = csv.reader(distributor_list, delimiter=",")

        for line in reader:
            if line[0] == distributor:
                distributor = line[1]
        return distributor


def spellcheck_film(film_title):
    film_title = film_title.strip()
    # if film ends with ', the', trim and add to prefix
    if film_title.endswith(", THE"):
        film_title = "THE " + film_title.rstrip(", THE")

    # checks against the list of mistakes...
    with open("./data/film_check.csv", "r") as film_list:
        reader = csv.reader(film_list, delimiter=",")

        for line in reader:
            if line[0] == film_title:
                film_title = line[1]
        return film_title


def get_last_sunday():
    # Returns the previous sunday date for week extract
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    return sunday.strftime("%Y%m%d")


def get_week_box_office(row):
    """ Iterate over dataset to find the difference between weeks of films.
    It's so inefficient, but that's the data structure
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
        films_list["total_gross"] = films_list["total_gross"].astype(float)

        # TODO: yuch lets define types in the extraction not here
        week_gross = float(row["total_gross"]) - float(films_list["total_gross"].max())
        print(week_gross)

        if type(week_gross) == float and math.isnan(week_gross):
            return row["weekend_gross"]
        else:
            return float(week_gross)


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
