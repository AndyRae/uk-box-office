# Iterate over data to find the difference between weeks of films.

import csv
import argparse


def search_difference(film, week, total_box):
    # Checks against the whole csv for the previous week, then returns the difference in box office
    with open("output.csv", "r") as file_search:
        search = csv.reader(file_search, delimiter=",")
        previous_week = week - 1
        for line in search:
            this_week = int(line[6])

            if film == line[2] and previous_week == this_week:
                return total_box - int(float(line[8]))


def find_difference(file):
    with open(file, "r") as file:
        reader = csv.reader(file, delimiter=",")

        for row in reader:
            film = row[2]
            print(film)
            total_box = int(float(row[8]))
            week = int(row[6])
            if week > 1:
                week_gross = search_difference(film, week, total_box)
                if week_gross:
                    row.append(week_gross)
                else:
                    # If the previous week isn't there (new entrant to top 15)
                    row.append(total_box)
            else:
                # Week 1 gross is the total box
                week_gross = total_box
                row.append(week_gross)
            with open("o3.csv", "a") as file:
                writer = csv.writer(file, delimiter=",")
                writer.writerow(row)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transform box office data")
    parser.add_argument("file", type=str, help="CSV file to use.")
    args = parser.parse_args()
    find_difference(args.file)
    print("Done")
