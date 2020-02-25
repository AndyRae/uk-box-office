""" Function for loading the archive of data post-2007 - but not for new data.
Gets all xls files in ./data/ - Outputs a csv list of the combined excel. 
No parameters to pass, assuming have previously renamed all xls files as dates.
"""

import csv
import os
import xlrd
from datetime import datetime

from helper import process_film


def load_archive_box_office(filename):

    xl_workbook = xlrd.open_workbook(filename)
    sheet_names = xl_workbook.sheet_names()

    xl_sheet = xl_workbook.sheet_by_name(sheet_names[0])

    rows = xl_sheet.get_rows()
    first_row = xl_sheet.row(0)
    date = filename.strip(".xls").strip("./data/")
    date = datetime.strptime(date, "%d-%m-%Y").strftime("%d/%m/%Y")

    for row in rows:
        film = process_film(row, date)

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
        path = "./data/" + filename
        load_archive_box_office(path)

print("Done")
