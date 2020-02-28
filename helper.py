""" Iterate over data to find the difference between weeks of films.
It's so inefficient, but that's the data structure
"""

import argparse
import math
import xlrd
import pandas as pd
from datetime import datetime, timedelta


def spellcheck_distributor(distributor):
    # Uses a list of the common distributor mistakes and returns the actual ones
    # use pandas for this
    with open("distributor.csv", "r") as distributor_list:
        reader = csv.reader(distributor_list, delimiter=",")

        for line in reader:
            if line[0] == distributor:
                distributor = line[1]
        return distributor


def get_last_sunday():
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    return sunday.strftime("%d/%m/%Y")


def strip_bfi(filename):
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
    new = strip_bfi(filename)

    try:
        date = parse(new).strftime("%d/%m/%Y")
        return date
    except ValueError:
        pass
    raise ValueError("date formatting is broken on " + filename)


def get_week_box_office(row):
    title = row["title"]
    print(title)

    if row["weeks_on_release"] == 1:
        return row["total_gross"]
    else:
        archive = pd.read_csv("archive.csv")
        archive.columns = [
            "date",
            "rank",
            "title",
            "country",
            "weekend_gross",
            "distributor",
            "weeks_on_release",
            "number_of_cinemas",
            "total_gross"
        ]
        date = datetime.now()
        previous_year = date - timedelta(days=365)
        archive["date"] = pd.to_datetime(archive["date"], dayfirst=True)

        films_filter = (
            (archive["title"] == title)
            & (archive["date"] > previous_year)
            & (archive["date"] < date)
        )
        films_list = archive[films_filter]

        week_gross = float(row["total_gross"]) - float(films_list["total_gross"].max())
        if type(week_gross) == float and math.isnan(week_gross):
            return row["total_gross"]
        else:
            return week_gross
