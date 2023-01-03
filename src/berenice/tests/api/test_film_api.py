import json


def test_all_films(app, client, add_test_film):
    """
    Test the film/all endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get("/api/film/")

        assert response.status_code == 200
        assert b"nope" in response.data


def test_single_film(app, client, add_test_film):
    """
    Test the film/get endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    with app.app_context():
        response = client.get("/api/film/nope")
        data = json.loads(response.data)
        assert response.status_code == 200

        assert data.get("name") == "Nope"
        assert data.get("slug") == "nope"
        assert data.get("gross") == 1000
        assert data.get("distributor").get("name") == "20th Century Fox"
        assert data.get("distributor").get("slug") == "20th-century-fox"
        assert data.get("countries")[0].get("name") == "United Kingdom"
        assert data.get("countries")[0].get("slug") == "united-kingdom"
        assert data.get("weeks")[0].get("film") == "Nope"
        assert data.get("weeks")[0].get("film_slug") == "nope"
        assert data.get("weeks")[0].get("date") == "2022-01-20"
        assert data.get("weeks")[0].get("rank") == 1
        assert data.get("weeks")[0].get("weekend_gross") == 500
        assert data.get("weeks")[0].get("week_gross") == 1000
        assert data.get("weeks")[0].get("total_gross") == 1000
        assert data.get("weeks")[0].get("site_average") == 5.0
        assert data.get("weeks")[0].get("number_of_cinemas") == 100
        assert data.get("weeks")[0].get("weeks_on_release") == 1


def test_single_film_not_found(app, client):
    """
    Test the film/get endpoint with a film that doesn't exist.

    Args:
        app: Flask app
        client: Flask test client
    """
    with app.app_context():
        response = client.get("/api/film/nope")
        assert response.status_code == 404
