import json

from flask import jsonify
from flask.wrappers import Response
from ukbo import models
from ukbo.extensions import db
from sqlalchemy.sql import func

from . import utils


def all(
    start: str = None, end: str = None, page: int = 1
) -> Response:
    """
    Main API endpoint - returns paginated box office data.
    Can filter on start date, end date - format: 2020-08-31
    """
    query = db.session.query(models.Film_Week)

    if start is not None:
        query = query.filter(
            models.Film_Week.date >= utils.to_date(start)
        )

    if end is not None:
        query = query.filter(models.Film_Week.date <= utils.to_date(end))

    data = query.order_by(models.Film_Week.date.desc()).paginate(
        page=page, per_page=300, error_out=False
    )
    if data is None:
        return {"none"}

    next_page = (page + 1) if data.has_next else ""
    previous_page = (page - 1) if data.has_prev else ""

    return jsonify(
        count1=data.total,
        next=next_page,
        previous=previous_page,
        results=[ix.as_dict() for ix in data.items],
    )


def topfilms() -> Response:
    """
    Top films all time
    """
    query = db.session.query(models.Film, func.sum(models.Film_Week.week_gross))
    query = query.join(models.Film, models.Film.id == models.Film_Week.film_id).group_by(models.Film)
    query = query.order_by(func.sum(models.Film_Week.week_gross).desc())
    data = query.limit(50)

    return jsonify(
        results=[
            dict(
                film=row[0].as_dict(weeks=False),
                gross=row[1],
            ) for row in data
        ],
    )


def summary(start: str = None, end: str = None, limit: int = 0) -> Response:
    """
    Return summarised box office statistics for a time range, grouped by year.
    The range has to be a standard amount of time inside one year.
    Essentially, the start date day and month cannot be greater than the end date.
    These contstraints are due to SQL filtering.
    For getting time comparison data, see 'previous' method. 

            Parameters:
                    start (int): Start of time range.
                    end (int): End of time range.
                    limit (int): The number of years to go backwards.

            Returns:
                    JSON response of the list of years.
    """
    query = db.session.query(
        func.extract('year', models.Week.date),
        func.sum(models.Week.week_gross), 
        func.sum(models.Week.weekend_gross), 
        func.sum(models.Week.number_of_releases), 
        func.max(models.Week.number_of_cinemas),
        ).group_by(func.extract('year', models.Week.date))

    if start != end:
        if start is not None:
            s = utils.to_date(start)
            query = query.filter(
                func.extract('day', models.Week.date) >= s.day
            )
            query = query.filter(
                func.extract('month', models.Week.date) >= s.month
            )
            query = query.filter(
                func.extract('year', models.Week.date) >= (s.year - limit)
            )

        if end is not None:
            e = utils.to_date(end)
            query = query.filter(func.extract('day', models.Week.date) <= e.day)
            query = query.filter(func.extract('month', models.Week.date) <= e.month)
            query = query.filter(
                func.extract('year', models.Week.date) <= (e.year)
            )
    else: 
        # Query for 1 week - so use the week number to filter.
        week_number = utils.to_date(start).isocalendar()[1]
        query = query.filter(func.extract('week', models.Week.date)  == week_number)
        query = query.filter(
                func.extract('year', models.Week.date) >= (utils.to_date(start).year - limit)
        )
        query = query.filter(
                func.extract('year', models.Week.date) <= (utils.to_date(end).year)
        )

    data = query.order_by(func.extract('year', models.Week.date).desc()).all()

    return jsonify(
        results=[
            dict(
                year=row[0],
                week_gross=row[1],
                weekend_gross=row[2],
                number_of_releases=row[3],
                number_of_cinemas=row[4]
            ) for row in data
        ]
    )


def previous(start: str = None, end: str = None) -> Response:
    """
    Gets the previous year of box office data as summary statistics.
    """
    query = db.session.query(
        func.extract('year', models.Week.date),
        func.sum(models.Week.week_gross), 
        func.sum(models.Week.weekend_gross), 
        func.sum(models.Week.number_of_releases), 
        func.max(models.Week.number_of_cinemas),
        ).group_by(func.extract('year', models.Week.date))

    if start != end:
        if start is not None:
            s = utils.to_date(start)
            s = s.replace(year=(s.year -1))
            print(s)
            query = query.filter(models.Week.date >= s)

        if end is not None:
            e = utils.to_date(end)
            e = e.replace(year=(e.year -1))
            query = query.filter(models.Week.date <= e)

    else: 
        # Query for 1 week - so use the week number to filter.
        s = utils.to_date(start)
        s = s.replace(year=(s.year -1))
        week_number = s.isocalendar()[1]
        query = query.filter(func.extract('week', models.Week.date)  == week_number)
        query = query.filter(
                func.extract('year', models.Week.date) >= (s.year)
        )

    data = query.order_by(func.extract('year', models.Week.date).desc()).all()

    return jsonify(
        results=[
            dict(
                year=row[0],
                week_gross=row[1],
                weekend_gross=row[2],
                number_of_releases=row[3],
                number_of_cinemas=row[4]
            ) for row in data
        ]
    )


def topline(start: str = None, end: str = None, page: int = 1) -> Response:
    """
    Return topline box office data for a time range.
    """
    query = db.session.query(models.Week)

    if start is not None:
        query = query.filter(
            models.Week.date >= utils.to_date(start)
        )

    if end is not None:
        query = query.filter(models.Week.date <= utils.to_date(end))

    data = query.order_by(models.Week.date.desc()).paginate(
        page=page, per_page=150, error_out=False
    )
    if data is None:
        return {"none"}

    next_page = (start + 1) if data.has_next else ""
    previous_page = (start - 1) if data.has_prev else ""

    return jsonify(
        count=data.total,
        next=next_page,
        previous=previous_page,
        results=[ix.as_dict() for ix in data.items],
    )
