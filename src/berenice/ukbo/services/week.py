from datetime import datetime
from typing import Any

from ukbo import models
from ukbo.extensions import db


def add_week(
    date: datetime,
    week_gross: int,
    weekend_gross: int,
    number_of_cinemas: int,
    weeks_on_release: int,
    commit: bool = False,
    **kwargs: Any,
) -> models.Week:
    """
    Adds a new Week for each new data import.
    If the week already exists, update the data.

    Args:
        date: Date of the week.
        week_gross: Gross for the week.
        weekend_gross: Gross for the weekend.
        number_of_cinemas: Number of cinemas showing the film.
        weeks_on_release: Number of weeks the film has been released.

    Returns:
        Created or updated Week object.
    """
    week = models.Week.query.filter_by(date=date).first()

    # If the week already exists, update the data
    if week and date == week.date:
        week.weekend_gross += weekend_gross
        week.week_gross += week_gross
        # Maximum number of cinemas
        if number_of_cinemas > week.number_of_cinemas:
            week.number_of_cinemas = number_of_cinemas
        # Increment the number of films if it's the first week
        if weeks_on_release == 1:
            week.number_of_releases += 1
        return week

    # If the week doesn't exist, create it
    number_of_releases = 1 if weeks_on_release == 1 else 0

    new_week = {
        "date": date,
        "week_gross": week_gross,
        "weekend_gross": weekend_gross,
        "number_of_cinemas": number_of_cinemas,
        "number_of_releases": number_of_releases,
    }

    return models.Week.create(**new_week, commit=commit)


def update_admissions(year: int, month: int, admissions: int) -> None:
    """
    Updates admissions data for a given month.
    Finds the first week of the month and updates the admissions.

    Args:
        year: Year of the month.
        month: Month to update.
        admissions: Number of admissions.

    """
    if week := (
        models.Week.query.filter(models.Week.date >= datetime(year, month, 1))
        .order_by(models.Week.date.asc())
        .first()
    ):
        week.admissions = admissions
        db.session.commit()

    return None
