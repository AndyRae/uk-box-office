import datetime
import os
import tempfile

import flask
import pytest
from ukbo import create_app, models
from ukbo.extensions import db


@pytest.fixture
def app():
    """
    This fixture creates a temporary database and returns a Flask application
    with the database initialised.

    Returns:
        Flask application
    """
    db_fd, db_path = tempfile.mkstemp()

    app = create_app(
        {
            "TESTING": True,
            "DATABASE": db_path,
        }
    )

    with app.app_context():
        db.create_all()

    yield app

    os.unlink(db_path)


@pytest.fixture
def client(app):
    """
    This fixture returns a Flask test client.

    Args:
        app: The Flask application
    """
    return app.test_client()


@pytest.fixture
def runner(app):
    """
    This fixture returns a Flask test CLI runner.

    Args:
        app: The Flask application
    """
    return app.test_cli_runner()


@pytest.fixture
def make_film():
    """
    Fixture returns a function to create a film.

    Returns:
        Function to create a film
    """

    def make(name, distributor, countries):
        return models.Film(
            name=name, distributor=distributor, countries=countries
        )

    return make


@pytest.fixture
def make_distributor():
    """
    Fixture to create a distributor.

    Returns:
        Function to create a distributor
    """

    def make(name: str = "20th Century Fox"):
        return models.Distributor(name=name)

    return make


@pytest.fixture
def make_country():
    """
    Fixture to create a country.

    Returns:
        Function to create a country
    """

    def make(name: str = "United Kingdom"):
        return models.Country(name=name)

    return make


@pytest.fixture
def make_film_week():
    """
    Fixture to create a film week.

    Returns:
        Function to create a film week
    """

    def make(
        date,
        film,
        distributor,
        rank=1,
        weeks_on_release=1,
        number_of_cinemas=100,
        weekend_gross=500,
        week_gross=1000,
        total_gross=1000,
        site_average=5.0,
    ):
        return models.Film_Week(
            date=date,
            rank=rank,
            weeks_on_release=weeks_on_release,
            number_of_cinemas=number_of_cinemas,
            weekend_gross=weekend_gross,
            week_gross=week_gross,
            total_gross=total_gross,
            site_average=site_average,
            film=film,
            distributor=distributor,
        )

    return make


@pytest.fixture
def make_film_weeks():
    """
    Fixture to create a list of film weeks.

    Returns:
        Function to create a list of film weeks
    """

    def make(film, distributor, number_of_weeks):
        film_weeks = []
        for i in range(number_of_weeks):
            film_week = models.Film_Week(
                date=f"2019-07-{i + 1}",
                rank=i + 1,
                weeks_on_release=i + 1,
                number_of_cinemas=100,
                weekend_gross=500,
                week_gross=1000,
                total_gross=(1000 * (i + 1)),
                site_average=5.0,
                film=film,
                distributor=distributor,
            )
            film_weeks.append(film_week)
        return film_weeks

    return make


@pytest.fixture
def make_film_weeks_with_gaps():
    """
    Fixture to create a list of film weeks with gaps.

    Returns:
        Function to create a list of film weeks with gaps
    """

    def make(film, distributor, number_of_weeks):
        film_weeks = []
        for i in range(number_of_weeks):
            film_week = models.Film_Week(
                date=f"2019-07-{i + 1}",
                rank=i + 1,
                weeks_on_release=i + 1,
                number_of_cinemas=100,
                weekend_gross=500,
                week_gross=1000,
                total_gross=1000,
                site_average=5.0,
                film=film,
                distributor=distributor,
            )
            film_weeks.append(film_week)
        return film_weeks

    return make


@pytest.fixture
def make_week():
    """
    Fixture to create a week.

    Returns:
        Function to create a week
    """

    def make(
        date,
        number_of_cinemas=700,
        number_of_releases=10,
        weekend_gross=500,
        week_gross=1000,
        admissions=100,
        forecast_high=1500,
        forecast_low=500,
        forecast_medium=1000,
    ):
        return models.Week(
            date=date,
            number_of_cinemas=number_of_cinemas,
            number_of_releases=number_of_releases,
            weekend_gross=weekend_gross,
            week_gross=week_gross,
            admissions=admissions,
            forecast_high=forecast_high,
            forecast_low=forecast_low,
            forecast_medium=forecast_medium,
        )

    return make


@pytest.fixture
def add_test_country(app, make_country):
    """
    Fixture to add a country to the database.

    Args:
        app: The Flask application
        make_country: The country fixture
    """
    country = make_country()

    with app.app_context():
        db.session.add(country)
        db.session.commit()


@pytest.fixture
def add_test_distributor(app, make_distributor):
    """
    Fixture to add a distributor to the database.

    Args:
        app: The Flask application
        make_distributor: The distributor fixture
    """
    distributor = make_distributor()

    with app.app_context():
        db.session.add(distributor)
        db.session.commit()


@pytest.fixture
def add_test_film(
    app, make_film_week, make_film, make_distributor, make_country
):
    """
    Fixture to add a film to the database, including a film week, distributor and
    country.

    Args:
        app: The Flask application
        make_film_week: The film week fixture
        make_film: The film fixture
        make_distributor: The distributor fixture
        make_country: The country fixture
    """
    with app.app_context():

        distributor = make_distributor()
        countries = [make_country()]
        film = make_film("Nope", distributor, countries)
        film_week = make_film_week(
            date=datetime.date(2022, 1, 20), film=film, distributor=distributor
        )

        db.session.add(distributor)
        db.session.add(film)
        db.session.add(film_week)
        db.session.commit()


@pytest.fixture
def add_test_week(app, make_week):
    """
    Fixture to add a week to the database.

    Args:
        app: The Flask application
        make_week: The week fixture
    """
    with app.app_context():

        week = make_week(date=datetime.date(2022, 1, 20))

        db.session.add(week)
        db.session.commit()


@pytest.fixture
def add_test_weeks(app, make_week):
    """
    Fixture to add a list of weeks to the database.
    The weeks just consecutively increment the date by one day as this is
    all that is required for the tests.

    Args:
        app: The Flask application
        make_week: The week fixture
    """
    with app.app_context():

        weeks = []
        for i in range(10):
            week = make_week(date=datetime.date(2022, 1, i + 1))
            weeks.append(week)

        db.session.add_all(weeks)
        db.session.commit()
