import os
import tempfile

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
        rank,
        weeks_on_release,
        number_of_cinemas,
        weekend_gross,
        week_gross,
        total_gross,
        site_average,
        film,
        distributor,
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
