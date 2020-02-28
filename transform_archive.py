""" Adds box office data to the archive, needs optimizing"""

import csv
import pandas as pd
import argparse

from helper import get_week_box_office


def main(filename):
    df = pd.read_csv(filename)

    df["week_gross"] = df.apply(lambda row: get_week_box_office(row), axis=1)

    df.to_csv("transformed_archive.csv", index=False)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Adds box office data to archive")
    parser.add_argument("file", type=str, help="CSV file to use.")
    args = parser.parse_args()
    main(args.file)
    print("Done")
