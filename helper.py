""" Iterate over data to find the difference between weeks of films.
It's so inefficient, but that's the data structure
"""

import argparse
import csv
import math
import xlrd
import pandas as pd
import requests
import urllib
from google.cloud import bigquery
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from googleapiclient.discovery import build

from settings import sheet_id


def read_values(origin_id):
    # Sheets API
    sheets = build("sheets", "v4")
    origin_range = "Sheet1!A1:J"
    sheet = sheets.spreadsheets()
    result = sheet.values().get(spreadsheetId=origin_id, range=origin_range).execute()
    return result.get("values", [])


def get_excel_file(source_url):
    # Fetches first excel file on the source page
    soup = BeautifulSoup(requests.get(source_url, timeout=3).content, "html.parser")

    for row in soup.find_all("div", {"class": "bfi-download-cell"}):
        excel_element = row.find("a")
        if excel_element:
            excel_link = excel_element.get('href')
            excel_title = excel_link.split('/')[-1]
            print(excel_title)
            urllib.request.urlretrieve (excel_link, excel_title)
            return excel_title
            break


def spellcheck_distributor(distributor):
    # Uses a list of the common distributor mistakes and returns the actual ones
    with open("distributor.csv", "r") as distributor_list:
        reader = csv.reader(distributor_list, delimiter=",")

        for line in reader:
            if line[0] == distributor:
                distributor = line[1]
        return distributor


def get_last_sunday():
    # Returns the previous sunday date for week extract 
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    return sunday.strftime("%d/%m/%Y") # change to yyyymmdd


def strip_bfi(filename):
    # Parsing filenames for dates
    """ There's no consistency with dates at all files, so best use the filename,
    strip filenames it below, then regex replace month names, and even then replace some manually.
    Horrible and dirty. Note - the original website actually has the dates... use that next time.
    """
    for form in (
        "weekend" "uk-film-council-box-office-report-",
        "bfi-weekend-box-office-report-",
        "bfi-uk-box-office-",
        "uk-film-council-box-office-report-",
        "weekend-box-office-report",
    ):
        return filename.strip(form)


def parse_date(filename):
    # Parsing filenames for dates
    new = strip_bfi(filename)

    try:
        date = parse(new).strftime("%d/%m/%Y")
        return date
    except ValueError:
        pass


def get_week_box_office(row):
    title = row["title"]
    print(title)

    if row["weeks_on_release"] == 1:
        return row["total_gross"]
    else:
        df = read_values(sheet_id)
        archive = pd.DataFrame.from_records(df)
        archive = archive.iloc[1:]
        # archive = pd.read_csv("archive.csv") csv as a backup.
        archive.columns = [
            "date",
            "rank",
            "title",
            "country",
            "weekend_gross",
            "distributor",
            "weeks_on_release",
            "number_of_cinemas",
            "total_gross",
            "week_gross"
        ]
        date = pd.to_datetime(row["date"], dayfirst=True)
        previous_year = date - timedelta(days=1095)
        archive["date"] = pd.to_datetime(archive["date"], dayfirst=True)

        films_filter = (
            (archive["title"] == title)
            & (archive["date"] > previous_year)
            & (archive["date"] < date)
        )

        films_list = archive[films_filter]

        films_list["total_gross"] = films_list["total_gross"].astype(float)

        # yuch lets define types in the extraction not here
        week_gross = float(row["total_gross"]) - float(films_list["total_gross"].max())

        if type(week_gross) == float and math.isnan(week_gross):
            return row["total_gross"]
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


def load_to_sheet(sheets, values, destination_id):
    # Loads data to Google Sheet
    df = pd.read_csv(values)
    body = df.to_json()
    destination_range = "sheet1"

    body = {"values": [
        [
            "MID",
            "YR2",
        ]
    ]}

    result = (
        sheets.spreadsheets()
        .values()
        .append(
            spreadsheetId=destination_id,
            range=destination_range,
            valueInputOption="USER_ENTERED",
            body=body,
        )
        .execute()
    )