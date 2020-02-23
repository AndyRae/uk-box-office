# Function for loading the archive of data post-2007 - but not for new data.
# Outputs a csv list of the combined excel. 

import csv
import os
from datetime import datetime
from dateutil.parser import parse

# XLRD is best for these old xls files
import xlrd


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


def xlrd_format(filename):

    path = "./data/"+ filename

    xl_workbook = xlrd.open_workbook(path)
    sheet_names = xl_workbook.sheet_names()

    xl_sheet = xl_workbook.sheet_by_name(sheet_names[0])

    rows = xl_sheet.get_rows()
    first_row = xl_sheet.row(0)
    date = filename.strip(".xls")

    for row in rows:
        if row[0].value != "":
            film = []
            film.append(date)

            film.append(row[0].value) # Rank
            film.append(str(row[1].value).upper()) # Title
            film.append(str(row[2].value).upper()) # Country
            film.append(row[3].value) # Weekend Gross
            film.append(str(row[4].value).upper()) # Distributor
            film.append(row[6].value) # Weeks on release
            film.append(row[7].value) # Number of cinemas
            film.append(row[9].value) # Total box office

            if "Rank" in film:
                continue
            else:
                with open("output.csv", "a") as csv_output:
                    writer = csv.writer(csv_output)
                    writer.writerow(film)


for filename in os.listdir("./data/"):
    if filename.endswith("xls"):
        print(filename)
        xlrd_format(filename)
print("Done")
