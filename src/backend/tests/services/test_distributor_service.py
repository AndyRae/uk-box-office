import json

from ukbo import services


def test_list(app, add_test_distributor):
    """
    Test that the list() method returns the correct data.

    Args:
        app: The Flask application
        add_test_distributor: Fixture to add a test distributor to the database
    """
    with app.app_context():

        response = services.distributor.list()

        data = json.loads(response.data)
        assert data["count"] == 1
        assert data["next"] == ""
        assert data["previous"] == ""
        assert data["results"][0]["name"] == "20th Century Fox"
        assert data["results"][0]["slug"] == "20th-century-fox"


def test_get(app, add_test_distributor):
    """
    Test that the get() method returns the correct data.

    Args:
        app: The Flask application
        add_test_distributor: Fixture to add a test distributor to the database.
    """
    with app.app_context():

        response = services.distributor.get("20th-century-fox")
        assert response == {
            "id": 1,
            "name": "20th Century Fox",
            "slug": "20th-century-fox",
        }


def test_get_films(app, add_test_film):
    """
    Test that the get_films() method returns the correct data including the
    distributor its films.

    Args:
        app: The Flask application
        add_test_film: Fixture to add a test film to the database
    """
    with app.app_context():

        response = services.distributor.get_films("20th-century-fox")

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


def test_add_distributor(app):
    """
    Test that the add_distributor() method adds a distributor to the database.

    Args:
        app: The Flask application
    """
    with app.app_context():

        response = services.distributor.add_distributor("20th Century Fox")

        assert response[0].name == "20TH CENTURY FOX"
        assert response[0].slug == "20th-century-fox"

        response = services.distributor.add_distributor("Warner Bros")

        assert response[0].name == "WARNER BROS"
        assert response[0].slug == "warner-bros"


def test_search(app, add_test_distributor):
    """
    Test that the search() method returns the correct data.

    Args:
        app: The Flask application
        add_test_distributor: Fixture to add a test distributor to the database
    """
    with app.app_context():

        response = services.distributor.search("Fox")

        assert response[0]["name"] == "20th Century Fox"
        assert response[0]["slug"] == "20th-century-fox"

        response = services.distributor.search("Warner Bros")

        assert response == []


def test_market_share(app, add_test_film):
    """
    Test that the market_share() method returns the correct data.

    Args:
        app: The Flask application
        add_test_film: Fixture to add a test film to the database
    """
    with app.app_context():

        response = services.distributor.market_share()
        data = json.loads(response.data)

        assert data["results"][0]["year"] == 2022
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000


def test_market_share_by_year(app, add_test_film):
    """
    Test that the market_share() method returns the correct data.

    Args:
        app: The Flask application
        add_test_film: Fixture to add a test film to the database
    """
    with app.app_context():

        response = services.distributor.market_share(2022)
        data = json.loads(response.data)

        assert data["results"][0]["year"] == 2022
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000


def test_market_share_by_date(app, add_test_film):
    """
    Test that the market_share() method returns the correct data.

    Args:
        app: The Flask application
        add_test_film: Fixture to add a test film to the database
    """
    with app.app_context():

        response = services.distributor.market_share_date(
            "2022-01-01", "2022-12-31"
        )
        data = json.loads(response.data)

        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000
