import json

import pytest
from ukbo import db, models


def test_all_distributors(app, client, add_test_distributor):
    """
    Test the distributor/all endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_distributor: Fixture to add a test distributor
    """
    with app.app_context():
        response = client.get("/api/distributor/")

        assert response.status_code == 200
        assert b"20th Century Fox" in response.data


def test_get_distributor(app, client, add_test_distributor):
    """
    Test the distributor/get endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_distributor: Fixture to add a test distributor
    """
    with app.app_context():
        response = client.get("/api/distributor/20th-century-fox")
        data = json.loads(response.data)
        assert response.status_code == 200

        assert data.get("name") == "20th Century Fox"
        assert data.get("slug") == "20th-century-fox"


def test_get_distributor_not_found(app, client):
    """
    Test the distributor/get endpoint with a distributor that doesn't exist.

    Args:
        app: Flask app
        client: Flask test client
    """
    with app.app_context():
        response = client.get("/api/distributor/20th-century-fox")
        assert response.status_code == 404


def test_distributor_films(app, client, add_test_film):
    """
    Test the distributor/films endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get("/api/distributor/20th-century-fox/films")
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data["distributor"]["name"] == "20th Century Fox"
        assert data["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["slug"] == "nope"
        assert data["results"][0]["name"] == "Nope"


def test_distributor_films_not_found(app, client):
    """
    Test the distributor/films endpoint with a distributor that doesn't exist.

    Args:
        app: Flask app
        client: Flask test client
    """
    with app.app_context():
        response = client.get("/api/distributor/20th-century-fox/films")
        assert response.status_code == 404


def test_market_share(app, client, add_test_film):
    """
    Test the distributor/marketshare endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get("/api/distributor/marketshare")
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data["results"][0]["distributor"]["name"] == "20th Century Fox"
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000
        assert data["results"][0]["year"] == 2022


def test_market_share_not_found(app, client):
    """
    Test the distributor/marketshare endpoint with a distributor that doesn't exist.

    Args:
        app: Flask app
        client: Flask test client
    """
    with app.app_context():
        response = client.get("/api/distributor/marketshare")
        assert response.status_code == 200
        assert b"[]" in response.data


def test_market_share_by_year(app, client, add_test_film):
    """
    Test the distributor/marketshare endpoint with a year.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get("/api/distributor/marketshare/2022")
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data["results"][0]["distributor"]["name"] == "20th Century Fox"
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000
        assert data["results"][0]["year"] == 2022


def test_market_share_date(app, client, add_test_film):
    """
    Test the distributor/marketshare endpoint with a date.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get(
            "/api/distributor/marketshare?start=2022-01-01&end=2022-12-31"
        )
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data["results"][0]["distributor"]["name"] == "20th Century Fox"
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000
