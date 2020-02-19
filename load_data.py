# Function for loading the archive of data post-2007 - but not for new data.

import csv
import os
from datetime import datetime
from dateutil.parser import parse

# XLRD is best for these old xls files
import xlrd


def parse_date(date):
    try:
        date = date.value.split("-")[1].strip()
        date = date.strip("UK box office")
        date = date.split(" ")[0:3]
        date = " ".join(date)
        date = parse(date).strftime("%d/%m/%Y")
        return date
    except ValueError:
        pass
    raise ValueError("date formatting is broken")


def xlrd_format(filename):
    xl_workbook = xlrd.open_workbook(filename)
    sheet_names = xl_workbook.sheet_names()

    xl_sheet = xl_workbook.sheet_by_name(sheet_names[0])

    rows = xl_sheet.get_rows()
    first_row = xl_sheet.row(0)
    date = first_row[1]
    date = parse_date(text)

    for row in rows:
        if row[0].value != "":
            film = []
            film.append(date)
            for cell in row:
                film.append(cell.value)
            if "Rank" in film:
                continue
            else:
                del film[6]
                del film[8]
                with open("output.csv", "a") as csv_output:
                    writer = csv.writer(csv_output)
                    writer.writerow(film)


for filename in os.listdir("./data/"):
    if filename.endswith("xls"):
        print(filename)
        path = "./data/" + filename
        xlrd_format(path)
print("Done")
