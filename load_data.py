""" Function for loading the archive of data post-2007 - but not for new data.
Gets all excel files in ./data/ - Outputs a csv list of the combined excel. 
No parameters to pass.
"""

import csv
import os
from datetime import datetime
from dateutil.parser import parse

from transform_data import process_film

# XLRD is best for these old xls files
import xlrd


def load_archive_box_office(filename):

    xl_workbook = xlrd.open_workbook(filename)
    sheet_names = xl_workbook.sheet_names()

    xl_sheet = xl_workbook.sheet_by_name(sheet_names[0])

    rows = xl_sheet.get_rows()
    first_row = xl_sheet.row(0)
    date = filename.strip(".xls")

    for row in rows:
        film = process_film(row, date)
        print(film)

        if film:
            if "Rank" in film:
                continue
            else:
                with open("archive.csv", "a") as csv_output:
                    writer = csv.writer(csv_output)
                    writer.writerow(film)


for filename in os.listdir("./data/"):
    if filename.endswith("xls"):
        print(filename)
        path = "./data/"+ filename
        load_archive_box_office(path)

print("Done")
