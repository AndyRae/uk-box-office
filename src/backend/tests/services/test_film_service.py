import json

import pytest
from ukbo import db, models, services


def test_list(app, add_test_film):
    """
    Test that the list() method returns the correct data.

    Args:
        app: The Flask application
        add_test_film: Fixture to add a test film to the database
    """
    with app.app_context():

        response = services.film.list_all()

        data = json.loads(response.data)
        assert data["count"] == 1
        assert data["next"] == ""
        assert data["previous"] == ""
        assert data["results"][0]["name"] == "Nope"
        assert data["results"][0]["slug"] == "nope"
        assert data["results"][0]["distributor"]["name"] == "20th Century Fox"
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["countries"][0]["name"] == "United Kingdom"
        assert data["results"][0]["countries"][0]["slug"] == "united-kingdom"


def test_get(app, add_test_film):
    """
    Test that the get() method returns the correct data.

    Args:
        app: The Flask application
        add_test_film: Fixture to add a test film to the database.
    """
    with app.app_context():

        response = services.film.get("nope")
        assert response == {
            "id": 1,
            "name": "Nope",
            "slug": "nope",
            "distributor": {
                "id": 1,
                "name": "20th Century Fox",
                "slug": "20th-century-fox",
            },
            "countries": [
                {
                    "id": 1,
                    "name": "United Kingdom",
                    "slug": "united-kingdom",
                }
            ],
            "gross": 1000,
            "weeks": [
                {
                    "date": "2022-01-20",
                    "film": "Nope",
                    "film_slug": "nope",
                    "distributor": "20th Century Fox",
                    "distributor_slug": "20th-century-fox",
                    "id": 1,
                    "week_gross": 1000,
                    "weekend_gross": 500,
                    "number_of_cinemas": 100,
                    "rank": 1,
                    "total_gross": 1000,
                    "site_average": 5.0,
                    "weeks_on_release": 1,
                }
            ],
        }


def test_add_film(app, add_test_distributor, add_test_country):
    """
    Test that the add_film() method adds a film to the database.

    Args:
        app: The Flask application
        add_test_distributor: Fixture to add a test distributor to the database.
        add_test_country: Fixture to add a test country to the database.
    """
    with app.app_context():

        # Get the distributor and country from the database.
        distributor = (
            db.session.query(models.Distributor)
            .filter_by(slug="20th-century-fox")
            .first()
        )
        country = (
            db.session.query(models.Country)
            .filter_by(slug="united-kingdom")
            .first()
        )

        response = services.film.add_film(
            "Nope",
            [country],
            [distributor],
        )

        assert response.name == "Nope"
        assert response.slug == "nope"
        assert response.distributors[0].name == "20th Century Fox"
        assert response.distributors[0].slug == "20th-century-fox"
        assert response.countries[0].name == "United Kingdom"
        assert response.countries[0].slug == "united-kingdom"


def test_delete_film(app, add_test_distributor, add_test_country):
    """
    Test that the delete_film() method deletes a film from the database.

    Args:
        app: The Flask application
        add_test_distributor: Fixture to add a test distributor to the database.
        add_test_country: Fixture to add a test country to the database.
    """
    with app.app_context():

        distributor = (
            db.session.query(models.Distributor)
            .filter_by(slug="20th-century-fox")
            .first()
        )
        country = (
            db.session.query(models.Country)
            .filter_by(slug="united-kingdom")
            .first()
        )

        response = services.film.add_film(
            "Nope",
            [country],
            [distributor],
        )

        response = services.film.delete_film(1)
        assert response is True

        with pytest.raises(Exception):
            response = services.film.delete_film(1)

        response = services.film.list_all()
        data = json.loads(response.data)
        assert data["count"] == 0


def test_search(app, add_test_film):
    """
    Test that the search() method returns the correct data.

    Args:
        app: The Flask application
        add_test_film: Fixture to add a test film to the database.
    """
    with app.app_context():

        response = services.film.search("Nope")
        assert response[0]["name"] == "Nope"
        assert response[0]["slug"] == "nope"
        assert response[0]["distributor"]["name"] == "20th Century Fox"
        assert response[0]["distributor"]["slug"] == "20th-century-fox"
        assert response[0]["countries"][0]["name"] == "United Kingdom"
        assert response[0]["countries"][0]["slug"] == "united-kingdom"


def test_search_with_no_results(app, add_test_film):
    """
    Test that the search() method returns an empty list when no results are found.

    Args:
        app: The Flask application
        add_test_film: Fixture to add a test film to the database.
    """
    with app.app_context():

        response = services.film.search("Nope2")
        assert response == []
