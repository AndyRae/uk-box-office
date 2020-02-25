# Loads weekly box office data, outputting a csv of the loaded excel.

import csv
import argparse
import xlrd
import os
from datetime import datetime

from helper import (
    get_last_sunday,
    process_film,
    get_week_box_office,
    get_week_box_office,
)


def load_weekly_box_office(filename):

    xl_workbook = xlrd.open_workbook(filename)
    sheet_names = xl_workbook.sheet_names()
    xl_sheet = xl_workbook.sheet_by_name(sheet_names[0])
    rows = xl_sheet.get_rows()
    first_row = xl_sheet.row(0)

    date = get_last_sunday()

    for row in rows:
        film = process_film(row, date)

        if film:
            if "Rank" in film:
                continue
            else:
                week_gross = get_week_box_office(film)
                film.append(week_gross)
                with open("week.csv", "a") as csv_output:
                    writer = csv.writer(csv_output)
                    writer.writerow(film)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transform weekly box office data")
    parser.add_argument("file", type=str, help="This weeks excel file to use")
    args = parser.parse_args()

    load_weekly_box_office(args.file)

    print("Done")
