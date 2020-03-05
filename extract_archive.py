""" Function for loading the archive of data post-2007 - but not for new data.
Gets all xls files in ./data/ - Outputs a csv list of the combined excel. 
No parameters to pass, assuming have previously renamed all xls files as dates.
"""

import os
import xlrd
import pandas as pd
from datetime import datetime

from helper import spellcheck_distributor


def load_archive_box_office(filename):
    df = pd.read_excel(filename)

    date = filename.strip(".xls").strip("./data/")
    date = datetime.strptime(date, "%d-%m-%Y").strftime("%d/%m/%Y") #change yyyymmdd

    header = df.iloc[0]
    df = df.iloc[1:]

    df.columns = header

    df = df.dropna(subset=["Rank"])
    df = df.dropna(how="all", axis=1, thresh=5)

    df = df.drop(df.columns[[5, 8]], axis=1)
    # could combine these two?
    df = df.iloc[:, 0:8]

    df.columns = [
        "rank",
        "title",
        "country",
        "weekend_gross",
        "distributor",
        "weeks_on_release",
        "number_of_cinemas",
        "total_gross",
    ]

    df = df.dropna(subset=["distributor"])
    df = df.dropna(how="all", axis=1, thresh=2)

    df.insert(0, "date", date)
    df["title"] = df["title"].astype(str).str.upper()
    df["country"] = df["country"].astype(str).str.upper()
    df["distributor"] = df["distributor"].astype(str).str.upper()

    df["distributor"] = df["distributor"].map(spellcheck_distributor)

    df = df.astype(
        {
            "rank": float,
            "title": str,
            "country": str,
            "weekend_gross": float,
            "distributor": str,
            "weeks_on_release": float,
            "number_of_cinemas": float,
            "total_gross": float,
        }
    )

    df.to_csv("archive.csv", mode="a", index=False, header=False)


for filename in os.listdir("./data/"):
    if filename.endswith("xls"):
        print(filename)
        path = "./data/" + filename
        load_archive_box_office(path)

print("Done")
