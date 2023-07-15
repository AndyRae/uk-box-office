import datetime

import pandas as pd
from sqlalchemy.orm import joinedload
from ukbo import db, etl, models


def test_load_distributors(app):
    """
    Test load_distributors function with a list of distributors

    Args:
        app: Flask app
    """
    distributors = ["20th Century Fox", "Disney", "Disney"]

    with app.app_context():
        etl.load.load_distributors(distributors)
        response = models.Distributor.query.filter_by(
            name=distributors[0]
        ).first()

        all_distributors = models.Distributor.query.all()

    assert response.name == "20th Century Fox"
    assert response.slug == "20th-century-fox"
    assert len(all_distributors) == 2


def test_load_countries(app):
    """
    Test load_countries function with a list of countries

    Args:
        app: Flask app
    """
    countries = ["United Kingdom", "United Kingdom", "United States"]

    with app.app_context():
        etl.load.load_countries(countries)
        response = models.Country.query.filter_by(
            name=countries[0].upper()
        ).first()

        all_countries = models.Country.query.all()

    assert response.name == "UNITED KINGDOM"
    assert response.slug == "united-kingdom"
    assert len(all_countries) == 2


def test_load_films(app):
    """
    Test load_films function with a film.

    Args:
        app: Flask app
    """

    film = {
        "film": "The Lion King",
        "distributor": "Disney",
        "country": "United Kingdom",
    }

    with app.app_context():
        etl.load.load_films([film])
        response = (
            models.Film.query.options(joinedload(models.Film.distributor))
            .filter_by(name=film["film"])
            .first()
        )

    assert response.name == "The Lion King"
    assert response.slug == "the-lion-king"
    assert response.distributor.name == "Disney"
    assert response.distributor.slug == "disney"
    assert response.countries[0].name == "UNITED KINGDOM"
    assert response.countries[0].slug == "united-kingdom"


def test_load_weeks(app):
    """
    Test load_weeks function with a film.

    Args:
        app: Flask app
    """

    df = pd.DataFrame(
        {
            "film": ["The Lion King", "Nope"],
            "distributor": ["Disney", "Disney"],
            "country": ["United Kingdom", "United Kingdom"],
            "date": ["20200120", "20200120"],
            "rank": [1, 1],
            "weekend_gross": [50, 100],
            "week_gross": [100, 200],
            "total_gross": [100, 200],
            "number_of_cinemas": [100, 200],
            "weeks_on_release": [1, 2],
        }
    )
    date = datetime.datetime(2020, 1, 20, 0, 0)

    with app.app_context():
        etl.load.load_weeks(df)
        film = models.Film.query.filter_by(name="The Lion King").first()
        film_week = models.Film_Week.query.filter_by(
            date=date, film=film
        ).first()
        week = models.Week.query.filter_by(date=date).first()

        # Lazy loading is part of the session
        assert film_week.distributor.name == "Disney"
        assert film_week.distributor.slug == "disney"

    assert film_week.film.name == "The Lion King"
    assert film_week.film.slug == "the-lion-king"
    assert film_week.date == date
    assert film_week.rank == 1
    assert film_week.weekend_gross == 50
    assert film_week.week_gross == 100
    assert film_week.total_gross == 100
    assert film_week.number_of_cinemas == 100
    assert film_week.weeks_on_release == 1
    assert film_week.site_average == 0.5

    assert week.date == date
    assert week.number_of_releases == 1
    assert week.weekend_gross == 150
    assert week.week_gross == 300
    assert week.number_of_cinemas == 200


def test_load_admissions(app, make_week):
    """
    Test load_admissions function with a week.

    Args:
        app: Flask app
    """

    date_week = datetime.datetime(2020, 1, 1, 0, 0)
    date_month = datetime.datetime(2020, 1, 7, 0, 0)

    month = make_week(date=date_month)
    admissions = {
        "date": date_week,
        "admissions": 100,
    }

    with app.app_context():
        db.session.add(month)
        db.session.commit()

        etl.load.load_admissions([admissions])
        week_response = models.Week.query.filter_by(date=date_month).first()

    assert week_response.admissions == 100
