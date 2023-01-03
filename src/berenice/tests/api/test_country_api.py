import json


def test_all_countries(app, client, add_test_country):
    """
    Test the country/all endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_country: Fixture to add a test country
    """
    with app.app_context():
        response = client.get("/api/country/")

        assert response.status_code == 200
        assert b"United Kingdom" in response.data


def test_get_country(app, client, add_test_country):
    """
    Test the country/get endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_country: Fixture to add a test country
    """
    with app.app_context():
        response = client.get("/api/country/united-kingdom")
        data = json.loads(response.data)
        assert response.status_code == 200

        assert data.get("name") == "United Kingdom"
        assert data.get("slug") == "united-kingdom"


def test_get_country_not_found(app, client):
    """
    Test the country/get endpoint with a country that doesn't exist.

    Args:
        app: Flask app
        client: Flask test client
    """
    with app.app_context():
        response = client.get("/api/country/united-kingdom")
        assert response.status_code == 404


def test_country_films(app, client, add_test_film):
    """
    Test the country/films endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get("/api/country/united-kingdom/films")
        data = json.loads(response.data)

        assert response.status_code == 200
        assert data["country"]["name"] == "United Kingdom"
        assert data["country"]["slug"] == "united-kingdom"
        assert data["results"][0]["slug"] == "nope"
        assert data["results"][0]["name"] == "Nope"
