import json

import pytest
from ukbo import db, models


def test_all_distributors(app, client, add_test_distributor):
    with app.app_context():
        response = client.get("/api/distributor/")

        assert response.status_code == 200
        assert b"20th Century Fox" in response.data


def test_single_distributor(app, client, add_test_distributor):
    with app.app_context():
        response = client.get("/api/distributor/20th-century-fox")
        data = json.loads(response.data)
        assert response.status_code == 200

        assert data.get("name") == "20th Century Fox"
        assert data.get("slug") == "20th-century-fox"


def test_single_distributor_not_found(app, client):
    with app.app_context():
        response = client.get("/api/distributor/20th-century-fox")
        assert response.status_code == 404


def test_distributor_films(app, client, add_test_film):
    with app.app_context():
        response = client.get("/api/distributor/20th-century-fox/films")
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data["distributor"]["name"] == "20th Century Fox"
        assert data["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["slug"] == "nope"
        assert data["results"][0]["name"] == "Nope"


def test_distributor_films_not_found(app, client):
    with app.app_context():
        response = client.get("/api/distributor/20th-century-fox/films")
        assert response.status_code == 200
        assert b"[]" in response.data


def test_market_share(app, client, add_test_film):
    with app.app_context():
        response = client.get("/api/distributor/marketshare")
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data["results"][0]["distributor"]["name"] == "20th Century Fox"
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000
        assert data["results"][0]["year"] == 2022


def test_market_share_not_found(app, client):
    with app.app_context():
        response = client.get("/api/distributor/marketshare")
        assert response.status_code == 200
        assert b"[]" in response.data


def test_market_share_by_year(app, client, add_test_film):
    with app.app_context():
        response = client.get("/api/distributor/marketshare/2022")
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data["results"][0]["distributor"]["name"] == "20th Century Fox"
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000
        assert data["results"][0]["year"] == 2022
