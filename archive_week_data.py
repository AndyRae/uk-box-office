""" Adds box office data to the archive, needs optimizing"""

import csv
import argparse

from helper import get_week_box_office


def main(file):
    with open(file, "r") as file:
        reader = csv.reader(file, delimiter=",")

        for row in reader:
            week_gross = get_week_box_office(row)
            row.append(week_gross)
            with open("master1.csv", "a") as csv_output:
                writer = csv.writer(csv_output)
                writer.writerow(row)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Adds box office data")
    parser.add_argument("file", type=str, help="CSV file to use.")
    args = parser.parse_args()
    main(args.file)
    print("Done")
