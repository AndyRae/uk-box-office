import json

import pytest
from ukbo import db, models


@pytest.fixture
def add_test_country(app, make_country):
    country = make_country()

    with app.app_context():
        db.session.add(country)
        db.session.commit()


def test_all_countries(app, client, add_test_country):
    with app.app_context():
        response = client.get("/api/country/")

        assert response.status_code == 200
        assert b"United Kingdom" in response.data


def test_single_country(app, client, add_test_country):
    with app.app_context():
        response = client.get("/api/country/united-kingdom")
        data = json.loads(response.data)
        assert response.status_code == 200

        assert data.get("name") == "United Kingdom"
        assert data.get("slug") == "united-kingdom"


def test_single_country_not_found(app, client):
    with app.app_context():
        response = client.get("/api/country/united-kingdom")
        assert response.status_code == 404


def test_country_films(app, client, add_test_film):
    with app.app_context():
        response = client.get("/api/country/united-kingdom/films")
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data["country"]["name"] == "United Kingdom"
        assert data["country"]["slug"] == "united-kingdom"
        assert data["results"][0]["slug"] == "nope"
        assert data["results"][0]["name"] == "Nope"
