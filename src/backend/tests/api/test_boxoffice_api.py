import json

import pytest
from ukbo import etl


def test_all_boxoffice(app, client, add_test_film):
    """
    Test the boxoffice/all endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get("/api/boxoffice/all")
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["film"]["name"] == "Nope"
        assert data["results"][0]["weekend_gross"] == 500
        assert data["results"][0]["week_gross"] == 1000
        assert data["results"][0]["total_gross"] == 1000
        assert data["results"][0]["site_average"] == 5.0
        assert data["results"][0]["rank"] == 1
        assert data["results"][0]["weeks_on_release"] == 1
        assert data["results"][0]["number_of_cinemas"] == 100


def test_filtered__all_boxoffice(app, client, add_test_film):
    """
    Test the boxoffice/all endpoint with a date filter.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get(
            "/api/boxoffice/all?start=2022-1-19&end=2022-1-21"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["film"]["name"] == "Nope"
        assert data["results"][0]["weekend_gross"] == 500
        assert data["results"][0]["week_gross"] == 1000
        assert data["results"][0]["total_gross"] == 1000
        assert data["results"][0]["site_average"] == 5.0
        assert data["results"][0]["rank"] == 1
        assert data["results"][0]["weeks_on_release"] == 1
        assert data["results"][0]["number_of_cinemas"] == 100


def test_filtered_boxoffice_empty(app, client, add_test_film):
    """
    Test the boxoffice/all endpoint with a date filter that returns no results.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get(
            "/api/boxoffice/all?start=2022-1-21&end=2022-1-22"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"] == []


def test_top_films(app, client, add_test_film):
    """
    Test the boxoffice/topfilms endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get("/api/boxoffice/topfilms")
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["film"]["name"] == "Nope"
        assert data["results"][0]["film"]["gross"] == 1000
        assert (
            data["results"][0]["film"]["distributors"][0]["name"]
            == "20th Century Fox"
        )
        assert (
            data["results"][0]["film"]["distributors"][0]["slug"]
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
    """
    Test the boxoffice/summary endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_week: Fixture to add a test week
    """
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
    """
    Test the boxoffice/summary endpoint with a date filter that returns no results.

    Args:
        app: Flask app
        client: Flask test client
    """
    with app.app_context():
        response = client.get(
            "/api/boxoffice/summary?start=2022-1-21&end=2022-1-22&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"] == []


def test_previous(app, client, add_test_week):
    """
    Test the boxoffice/previous endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_week: Fixture to add a test week
    """
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
    """
    Test the boxoffice/previous endpoint with a date filter that returns no results.

    Args:
        app: Flask app
        client: Flask test client
    """
    with app.app_context():
        response = client.get(
            "/api/boxoffice/previous?start=2022-1-21&end=2022-1-22&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"] == []


def test_previous_year(app, client, add_test_week):
    """
    Test the boxoffice/previous_year endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_week: Fixture to add a test week
    """
    with app.app_context():
        response = client.get(
            "/api/boxoffice/previousyear?start=2023-1-19&end=2023-1-20&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"][0]["week_gross"] == 1000
        assert data["results"][0]["weekend_gross"] == 500
        assert data["results"][0]["number_of_releases"] == 10
        assert data["results"][0]["number_of_cinemas"] == 700


def test_topline(app, client, add_test_week):
    """
    Test the boxoffice/topline endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_week: Fixture to add a test week
    """
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
    """
    Test the boxoffice/topline endpoint with a date filter that returns no results.

    Args:
        app: Flask app
        client: Flask test client
    """
    with app.app_context():
        response = client.get(
            "/api/boxoffice/topline?start=2022-1-21&end=2022-1-22&limit=1"
        )
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data["results"] == []


def test_archive(app, runner, client, add_test_film):
    """
    Test the boxoffice/archive endpoint.

    Args:
        app: Flask app
        runner: Flask test runner
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        result = runner.invoke(etl.commands.build_archive_command)
        assert result.exit_code == 0
        response = client.get("/api/boxoffice/archive")
        assert response.status_code == 200

        # check its a csv file attachment
        assert response.headers["Content-Disposition"] == (
            "attachment; filename=archive_export.csv"
        )
        # assert its not empty
        assert response.data
        # assert its a csv file
        assert response.data.decode("utf-8").startswith("date")
