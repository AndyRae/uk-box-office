import json

from ukbo import services


def test_list(app, add_test_country):
    """
    Test that the list() method returns the correct data.

    Args:
        app: The Flask application
        add_test_country: Fixture to add a test country to the database
    """
    with app.app_context():

        response = services.country.list()

        data = json.loads(response.data)
        assert data["count"] == 1
        assert data["next"] == ""
        assert data["previous"] == ""
        assert data["results"][0]["name"] == "United Kingdom"
        assert data["results"][0]["slug"] == "united-kingdom"


def test_get(app, add_test_country):
    """
    Test that the get() method returns the correct data.

    Args:
        app: The Flask application
        add_test_country: Fixture to add a test country to the database
    """
    with app.app_context():

        response = services.country.get("united-kingdom")
        assert response == {
            "id": 1,
            "name": "United Kingdom",
            "slug": "united-kingdom",
        }


def test_get_films(app, add_test_film):
    """
    Test that the get_films() method returns the correct data including the
    films for the country.

    Args:
        app: The Flask application
        add_test_film: Fixture to add a test film to the database
    """
    with app.app_context():

        response = services.country.get_films("united-kingdom")

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


def test_add_country(app):
    """
    Test that the add_country() method adds a country to the database.

    Args:
        app: The Flask application
    """
    with app.app_context():

        response = services.country.add_country("United Kingdom")

        assert response[0].name == "UNITED KINGDOM"
        assert response[0].slug == "united-kingdom"

        response = services.country.add_country("United States")

        assert response[0].name == "UNITED STATES"
        assert response[0].slug == "united-states"


def test_search(app, add_test_country):
    """
    Test that the search() method returns search results for a country.

    Args:
        app: The Flask application
        add_test_country: Fixture to add a test country to the database
    """
    with app.app_context():

        response = services.country.search("United Kingdom")

        assert response[0]["name"] == "United Kingdom"
        assert response[0]["slug"] == "united-kingdom"

        response = services.country.search("United States")

        assert response == []
