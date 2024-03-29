import datetime
from typing import List, Optional

import pandas as pd
from flask import jsonify
from flask.wrappers import Response
from sqlalchemy.sql import func, or_
from ukbo import models
from ukbo.dto import (
    FilmSchema,
    FilmWeekSchema,
    FilmWeekSchemaArchive,
    WeekSchema,
)
from ukbo.extensions import db

from .filters import QueryFilter, TimeFilter


def all(
    time_filter: TimeFilter = TimeFilter(),
    query_filter: QueryFilter = QueryFilter(),
    page: int = 1,
) -> Response:
    """
    All box office data for a time period.

    Args:
        time_filter: Object containing start and end date to filter by.
        query_filter: Object containing distributor ID and country ID to filter by.
        page: Page number to return.

    Returns:
        Paginated JSON response of box office data.
    """
    query = db.session.query(models.Film_Week)

    if time_filter.start is not None:
        query = query.filter(
            models.Film_Week.date >= to_date(time_filter.start)
        )

    if time_filter.end is not None:
        query = query.filter(models.Film_Week.date <= to_date(time_filter.end))

    if query_filter.distributor_ids is not None:
        query = (
            query.join(models.Film)
            .join(models.distributors)
            .join(models.Distributor)
        )
        query = query.filter(
            models.Distributor.id.in_(query_filter.distributor_ids)
        )

    if query_filter.country_ids is not None:
        query = (
            query.join(models.Film).join(models.countries).join(models.Country)
        )
        query = query.filter(models.Country.id.in_(query_filter.country_ids))

    data = query.order_by(models.Film_Week.date.desc()).paginate(
        page=page, per_page=700, error_out=False
    )
    if data is None:
        return {"none"}

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    film_week_schema = FilmWeekSchema()  # type: ignore

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[film_week_schema.dump(ix) for ix in data.items],
    )


def topfilms() -> Response:
    """
    Top films for all time.

    Returns:
        JSON response of top films data.
    """
    query = db.session.query(
        models.Film, func.sum(models.Film_Week.week_gross)
    )
    query = query.join(
        models.Film, models.Film.id == models.Film_Week.film_id
    ).group_by(models.Film)
    query = query.order_by(func.sum(models.Film_Week.week_gross).desc())
    data = query.limit(50)

    film_schema = FilmSchema()  # type: ignore

    return jsonify(
        results=[
            dict(
                film=film_schema.dump(row[0]),
                gross=row[1],
            )
            for row in data
        ],
    )


def summary(start: str, end: str, limit: int = 0) -> Response:
    """
    Summarised box office statistics for a time range grouped by year.

    The range has to be a standard amount of time inside one year.
    As in, the start date day and month cannot be greater than the end date.
    This contstraint is due to SQL filtering.
    For getting time comparison data, see ``previous`` method.

    Args:
        start: Start of time range (YYYY-MM-DD).
        end: End of time range (YYYY-MM-DD).
        limit: The number of years to go backwards.

    Returns:
        JSON response of the list of years.
    """
    query = db.session.query(
        func.extract("year", models.Week.date),
        func.sum(models.Week.week_gross),
        func.sum(models.Week.weekend_gross),
        func.sum(models.Week.number_of_releases),
        func.max(models.Week.number_of_cinemas),
        func.sum(models.Week.admissions),
    ).group_by(func.extract("year", models.Week.date))

    if start == end:
        # Query for 1 week - so use the week number to filter.
        week_number = to_date(start).isocalendar()[1]
        query = query.filter(
            func.extract("week", models.Week.date) == week_number
        )
        query = query.filter(
            func.extract("year", models.Week.date)
            >= (to_date(start).year - limit)
        )
        query = query.filter(
            func.extract("year", models.Week.date) <= (to_date(end).year)
        )

    elif start is not None and end is not None:
        s = to_date(start)
        e = to_date(end)

        # Generate a list of filters for previous years
        year_filters = []
        current_year = e.year
        for i in range(1, limit + 1):
            previous_year_start = s.replace(year=current_year - i + 1)
            previous_year_end = e.replace(year=current_year - i + 1)
            year_filters.append(
                models.Week.date.between(
                    previous_year_start, previous_year_end
                )
            )

        # Combine all the year filters
        year_filter_condition = or_(*year_filters)

        # Apply the year filter condition to the query
        query = query.filter(year_filter_condition)

    data = query.order_by(func.extract("year", models.Week.date).desc()).all()

    return jsonify(
        results=[
            dict(
                year=row[0],
                week_gross=row[1],
                weekend_gross=row[2],
                number_of_releases=row[3],
                number_of_cinemas=row[4],
                admissions=row[5],
            )
            for row in data
        ]
    )


def previous(start: str, end: str) -> Response:
    """
    Gets the previous year of box office data as summary statistics.
    As this gets multiple years, it cannot be used for time comparison
    across periods that are not a standard amount of time inside one year.

    Args:
        start: Start of time range (YYYY-MM-DD).
        end: End of time range (YYYY-MM-DD).

    Returns:
        JSON response of the box office data as a list of years.
    """
    query = db.session.query(
        func.extract("year", models.Week.date),
        func.sum(models.Week.week_gross),
        func.sum(models.Week.weekend_gross),
        func.sum(models.Week.number_of_releases),
        func.max(models.Week.number_of_cinemas),
    ).group_by(func.extract("year", models.Week.date))

    if start != end:
        if start is not None:
            s = to_date(start)
            s = s.replace(year=(s.year - 1))
            query = query.filter(models.Week.date >= s)

        if end is not None:
            e = to_date(end)
            e = e.replace(year=(e.year - 1))
            query = query.filter(models.Week.date <= e)

    else:
        # Query for 1 week - so use the week number to filter.
        s = to_date(start)
        s = s.replace(year=(s.year - 1))
        week_number = s.isocalendar()[1]
        query = query.filter(
            func.extract("week", models.Week.date) == week_number
        )
        query = query.filter(
            func.extract("year", models.Week.date) >= (s.year)
        )

    data = query.order_by(func.extract("year", models.Week.date).desc()).all()

    return jsonify(
        results=[
            dict(
                year=row[0],
                week_gross=row[1],
                weekend_gross=row[2],
                number_of_releases=row[3],
                number_of_cinemas=row[4],
            )
            for row in data
        ]
    )


def previous_year(start: str, end: str) -> Response:
    """
    Gets only the previous year of box office data as summary statistics.
    This can be used for time comparison across periods that are not a standard
    amount of time inside one year.

    Args:
        start: Start of time range (YYYY-MM-DD).
        end: End of time range (YYYY-MM-DD).

    Returns:
        JSON response of the box office data as a list of weeks.
    """
    query = db.session.query(
        func.sum(models.Week.week_gross),
        func.sum(models.Week.weekend_gross),
        func.sum(models.Week.number_of_releases),
        func.max(models.Week.number_of_cinemas),
    )

    if start != end:
        if start is not None:
            s = to_date(start)
            s = s.replace(year=(s.year - 1))
            query = query.filter(models.Week.date >= s)

        if end is not None:
            e = to_date(end)
            e = e.replace(year=(e.year - 1))
            query = query.filter(models.Week.date <= e)

    else:
        # Query for 1 week - so use the week number to filter.
        s = to_date(start)
        s = s.replace(year=(s.year - 1))
        week_number = s.isocalendar()[1]
        query = query.filter(
            func.extract("week", models.Week.date) == week_number
        )
        query = query.filter(
            func.extract("year", models.Week.date) >= (s.year)
        )

    data = query.all()

    return jsonify(
        results=[
            dict(
                week_gross=row[0],
                weekend_gross=row[1],
                number_of_releases=row[2],
                number_of_cinemas=row[3],
            )
            for row in data
        ]
    )


def topline(
    start: Optional[str] = None, end: Optional[str] = None, page: int = 1
) -> Response:
    """
    Topline box office data for a time range.

    Args:
        start: Start of time range (YYYY-MM-DD).
        end: End of time range (YYYY-MM-DD).
        page: Page number.

    Returns:
        JSON response of the box office data as a list of weeks.
    """
    query = db.session.query(models.Week)

    if start is not None:
        query = query.filter(models.Week.date >= to_date(start))

    if end is not None:
        query = query.filter(models.Week.date <= to_date(end))

    data = query.order_by(models.Week.date.desc()).paginate(
        page=page, per_page=150, error_out=False
    )
    if data is None:
        return {"none"}

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    week_schema = WeekSchema()  # type: ignore

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[week_schema.dump(ix) for ix in data.items],
    )


def build_archive() -> pd.DataFrame:
    """
    Build a dataframe of all the box office data.

    Returns:
        Pandas dataframe of all the box office data.
    """
    query = db.session.query(models.Film_Week)
    data = query.order_by(
        models.Film_Week.date.asc(), models.Film_Week.rank.asc()
    ).all()

    film_week_schema = FilmWeekSchemaArchive()

    df = pd.DataFrame([film_week_schema.dump(ix) for ix in data])
    df["date"] = pd.to_datetime(df["date"])
    df["weekend_gross"] = df["weekend_gross"].astype(float)
    df["week_gross"] = df["week_gross"].astype(float)
    df["number_of_cinemas"] = df["number_of_cinemas"].astype(int)

    # Unwrap objects to their names with seperator.
    df["country"] = ["/".join(list(ix)) for ix in df["country"]]
    df["distributor"] = ["/".join(list(ix)) for ix in df["distributor"]]

    order = [
        "date",
        "rank",
        "film",
        "country",
        "weekend_gross",
        "distributor",
        "weeks_on_release",
        "number_of_cinemas",
        "total_gross",
        "week_gross",
    ]
    return df[order]


def to_date(date_string: str = "2000-01-20") -> datetime.datetime:
    """
    Helper function to convert a date string to a date object.

    Args:
        date_string: Date string (YYYY-MM-DD).

    Returns:
        Date object.
    """
    return datetime.datetime.strptime(date_string, "%Y-%m-%d")
