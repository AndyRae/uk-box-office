""" Iterate over data to find the difference between weeks of films.
It's so inefficient, but that's the data structure
You could also move this to the load_data function, for more speed
But really you'd only ever run any of this once anyway.
"""

import csv
import argparse
from datetime import datetime, timedelta


def spellcheck_distributor(distributor):
    # Uses a list of the common distributor mistakes and returns the actual ones
    with open ("distributor.csv", "r") as distributor_list:
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


def search_box_office(date, film, week, total_box):
    """ Checks against the whole csv for the previous week, then returns the difference in box office
    Memoizes all instances of the film, then picks the highest week to find the difference.
    Only looks for the last year - to avoid rereleases, reboots, and duplicate titles."""
    with open("archive.csv", "r") as file_search:
        search = csv.reader(file_search, delimiter=",")
        previous_year = date - timedelta(days=365)
        film_list = []
        for line in search:
            this_date = datetime.strptime(line[0], "%d/%m/%Y")
            this_week = int(line[6])
            film_box = int(float(line[8]))
            if total_box > film_box:
                if this_date > previous_year and this_date < date:
                    if film == line[2] and week > this_week:
                        film_instance = [this_week, film_box, film]
                        film_list.append(film_instance)
        if film_list:
            film_list.sort()
            return total_box - film_list[-1][1]


def get_week_box_office(file):
    with open(file, "r") as file:
        reader = csv.reader(file, delimiter=",")

        for row in reader:
            date = datetime.strptime(row[0], "%d/%m/%Y")
            film = row[2]
            print(film)
            total_box = int(float(row[8]))
            week = int(float(row[6]))
            if week > 1:
                week_gross = search_box_office(date, film, week, total_box)
                if week_gross:
                    row.append(week_gross)
                else:
                    # If the previous week isn't there (new entrant to top 15)
                    row.append(total_box)
            else:
                # Week 1 gross is the total box
                week_gross = total_box
                row.append(week_gross)
            with open("transformed.csv", "a") as file:
                writer = csv.writer(file, delimiter=",")
                writer.writerow(row)


def process_film(row, date):
    # Returns a list element of the film
    if row[0].value != "":
        film = []
        film.append(date)

        distributor = str(row[4].value).upper()
        distributor = spellcheck_distributor(distributor)

        film.append(row[0].value) # Rank
        film.append(str(row[1].value).upper()) # Title
        film.append(str(row[2].value).upper()) # Country
        film.append(row[3].value) # Weekend Gross
        film.append(distributor) # Distributor
        film.append(row[6].value) # Weeks on release
        film.append(row[7].value) # Number of cinemas
        film.append(row[9].value) # Total box office

        return film


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transform box office data")
    parser.add_argument("file", type=str, help="CSV file to use.")
    args = parser.parse_args()
    get_week_box_office(args.file)
    print("Done")
