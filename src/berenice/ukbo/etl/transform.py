from datetime import timedelta

import pandas as pd
from ukbo import models


def find_recent_film(row: pd.Series) -> models.Film:
    """
    Finds the most recent film with the same name.
    days_to_look_back is a tradeoff
    Increasing gives more accurate data for some films.
    But for others it creates inaccurate data, as the data is unreliable.

    Args:
        row: The row of the dataframe

    Returns the most recent film with the same name.
    """
    days_to_look_back = 90
    filter_date = pd.to_datetime(row["date"], format="%Y%m%d", yearfirst=True)
    previous_period = filter_date - timedelta(days=days_to_look_back)

    return (
        models.Film_Week.query.filter(
            models.Film_Week.film.has(name=row["film"]),
            models.Film_Week.date >= previous_period,
            models.Film_Week.date <= filter_date,
        )
        .order_by(models.Film_Week.total_gross.desc())
        .first()
    )


def get_week_box_office(row: pd.Series) -> int:
    """
    Calculates the actual box office for a given Film week.

    Checks if its the first week of the film - if so, returns total box office.
    If not - it subtracts the current total, from last weeks total.

    Args:
        row: The row of the dataframe
    Returns the week box office.
    """

    # If it's week 1
    if row["weeks_on_release"] == 1:
        return row["total_gross"]

    most_recent_film_match = find_recent_film(row)

    # If there's no matches
    if most_recent_film_match is None:
        return row["weekend_gross"]

    week_gross = row["total_gross"] - most_recent_film_match.total_gross

    # There are errors in the data week numbers
    return row["weekend_gross"] if week_gross < 0 else week_gross
