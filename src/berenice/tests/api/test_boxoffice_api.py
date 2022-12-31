import json

import pytest
from ukbo import etl


def test_all_boxoffice(app, client, add_test_film):
    with app.app_context():
        response = client.get("/api/boxoffice/all")
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["film"] == "Nope"
        assert data["results"][0]["weekend_gross"] == 500
        assert data["results"][0]["week_gross"] == 1000
        assert data["results"][0]["total_gross"] == 1000
        assert data["results"][0]["site_average"] == 5.0
        assert data["results"][0]["rank"] == 1
        assert data["results"][0]["weeks_on_release"] == 1
        assert data["results"][0]["number_of_cinemas"] == 100


def test_filtered_boxoffice(app, client, add_test_film):
    with app.app_context():
        response = client.get(
            "/api/boxoffice/all?start=2022-1-19&end=2022-1-21"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["film"] == "Nope"
        assert data["results"][0]["weekend_gross"] == 500
        assert data["results"][0]["week_gross"] == 1000
        assert data["results"][0]["total_gross"] == 1000
        assert data["results"][0]["site_average"] == 5.0
        assert data["results"][0]["rank"] == 1
        assert data["results"][0]["weeks_on_release"] == 1
        assert data["results"][0]["number_of_cinemas"] == 100


def test_filtered_boxoffice_empty(app, client, add_test_film):
    with app.app_context():
        response = client.get(
            "/api/boxoffice/all?start=2022-1-21&end=2022-1-22"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"] == []


def test_top_films(app, client, add_test_film):
    with app.app_context():
        response = client.get("/api/boxoffice/topfilms")
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["film"]["name"] == "Nope"
        assert data["results"][0]["film"]["gross"] == 1000
        assert (
            data["results"][0]["film"]["distributor"]["name"]
            == "20th Century Fox"
        )
        assert (
            data["results"][0]["film"]["distributor"]["slug"]
            == "20th-century-fox"
        )
        assert (
            data["results"][0]["film"]["countries"][0]["name"]
            == "United Kingdom"
        )
        assert (
            data["results"][0]["film"]["countries"][0]["slug"]
            == "united-kingdom"
        )


def test_summary(app, client, add_test_week):
    with app.app_context():
        response = client.get(
            "/api/boxoffice/summary?start=2022-1-19&end=2022-1-20&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["year"] == 2022
        assert data["results"][0]["week_gross"] == 1000
        assert data["results"][0]["weekend_gross"] == 500
        assert data["results"][0]["number_of_releases"] == 10
        assert data["results"][0]["number_of_cinemas"] == 700


def test_summary_empty(app, client):
    with app.app_context():
        response = client.get(
            "/api/boxoffice/summary?start=2022-1-21&end=2022-1-22&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"] == []


def test_previous(app, client, add_test_week):
    with app.app_context():
        response = client.get(
            "/api/boxoffice/previous?start=2023-1-19&end=2023-1-20&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["year"] == 2022
        assert data["results"][0]["week_gross"] == 1000
        assert data["results"][0]["weekend_gross"] == 500
        assert data["results"][0]["number_of_releases"] == 10
        assert data["results"][0]["number_of_cinemas"] == 700


def test_previous_empty(app, client):
    with app.app_context():
        response = client.get(
            "/api/boxoffice/previous?start=2022-1-21&end=2022-1-22&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"] == []


def test_topline(app, client, add_test_week):
    with app.app_context():
        response = client.get(
            "/api/boxoffice/topline?start=2022-1-19&end=2022-1-20&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["week_gross"] == 1000
        assert data["results"][0]["weekend_gross"] == 500
        assert data["results"][0]["number_of_releases"] == 10
        assert data["results"][0]["number_of_cinemas"] == 700
        assert data["results"][0]["forecast_high"] == 1500
        assert data["results"][0]["forecast_medium"] == 1000
        assert data["results"][0]["forecast_low"] == 500


def test_topline_empty(app, client):
    with app.app_context():
        response = client.get(
            "/api/boxoffice/topline?start=2022-1-21&end=2022-1-22&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"] == []


@pytest.mark.skip("This test is failing on CI")
def test_archive(app, runner, client, add_test_film):
    """
    TODO: Fix this command, see #282
    """
    with app.app_context():
        result = runner.invoke(etl.commands.build_archive_command)
        assert result.exit_code == 0
        response = client.get("/api/boxoffice/archive")
        assert response.status_code == 200
