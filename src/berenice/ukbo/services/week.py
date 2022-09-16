from datetime import datetime
from typing import Any

from ukbo import models


def add_week(
    date: datetime,
    week_gross: int,
    weekend_gross: int,
    number_of_cinemas: int,
    weeks_on_release: int,
    **kwargs: Any,
) -> None:
    """
    Adds a new week for each new data import.
    """
    week = models.Week.query.filter_by(date=date).first()

    if week and date == week.date:
        week.weekend_gross += weekend_gross
        week.week_gross += week_gross
        # Maximum number of cinemas
        if number_of_cinemas > week.number_of_cinemas:
            week.number_of_cinemas = number_of_cinemas
        # Adding the number of films if it's the first week
        if weeks_on_release == 1:
            week.number_of_releases += 1
        return None

    number_of_releases = 1 if weeks_on_release == 1 else 0

    new_week = {
        "date": date,
        "week_gross": week_gross,
        "weekend_gross": weekend_gross,
        "number_of_cinemas": number_of_cinemas,
        "number_of_releases": number_of_releases,
    }

    models.Week.create(**new_week, commit=False)

    return None
