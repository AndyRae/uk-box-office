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
