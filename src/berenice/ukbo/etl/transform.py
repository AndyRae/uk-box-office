from datetime import datetime, timedelta
from statistics import mode

import pandas as pd
from ukbo import models


def get_week_box_office(row: pd.Series) -> int:
    """
    Calculates the actual box office for the week
    Checks if its the first week of the film - if so, returns total box office
    If not - it subtracts the current total, from last weeks total
    Parameters: The row of the dataframe
    Returns the week box office
    Used in an apply method with pandas.
    """
    film = row["film"]

    # If it's week 1
    if row["weeks_on_release"] == 1:
        return row["total_gross"]
    """
    days_to_look_back is a tradeoff
    Increasing gives more accurate data for some films.
    but for others it creates inaccurate data, as the source is unreliable.
    """
    days_to_look_back = 90
    filter_date = pd.to_datetime(row["date"], format="%Y%m%d", yearfirst=True)
    previous_period = filter_date - timedelta(days=days_to_look_back)

    most_recent_film_match = (
        models.Film_Week.query.filter(
            models.Film_Week.film.has(name=film),
            models.Film_Week.date >= previous_period,
            models.Film_Week.date <= filter_date,
        )
        .order_by(models.Film_Week.total_gross.desc())
        .first()
    )

    # If there's no matches
    if most_recent_film_match is None:
        return row["weekend_gross"]

    week_gross = row["total_gross"] - most_recent_film_match.total_gross

    # There are errors in the data week numbers
    return row["weekend_gross"] if week_gross < 0 else week_gross


def get_last_sunday() -> str:
    # Returns the previous sunday date for week extract
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    return sunday.strftime("%Y%m%d")
