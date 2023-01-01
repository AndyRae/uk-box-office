import datetime
import os
import tempfile

import flask
import pytest
from ukbo import create_app, models
from ukbo.extensions import db


@pytest.fixture
def app():
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
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


@pytest.fixture
def make_film():
    def make(name, distributor, countries):
        return models.Film(
            name=name, distributor=distributor, countries=countries
        )

    return make


@pytest.fixture
def make_distributor():
    def make(name: str = "20th Century Fox"):
        return models.Distributor(name=name)

    return make


@pytest.fixture
def make_country():
    def make(name: str = "United Kingdom"):
        return models.Country(name=name)

    return make


@pytest.fixture
def make_film_week():
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
    country = make_country()

    with app.app_context():
        db.session.add(country)
        db.session.commit()


@pytest.fixture
def add_test_distributor(app, make_distributor):
    distributor = make_distributor()

    with app.app_context():
        db.session.add(distributor)
        db.session.commit()


@pytest.fixture
def add_test_film(
    app, make_film_week, make_film, make_distributor, make_country
):
    """
    Add test data to the database
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
    Add test data to the database
    """
    with app.app_context():

        week = make_week(date=datetime.date(2022, 1, 20))

        db.session.add(week)
        db.session.commit()
