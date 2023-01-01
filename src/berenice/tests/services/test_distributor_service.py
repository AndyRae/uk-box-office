import json

from ukbo import services


def test_list(app, add_test_distributor):
    with app.app_context():

        response = services.distributor.list()

        data = json.loads(response.data)
        assert data["count"] == 1
        assert data["next"] == ""
        assert data["previous"] == ""
        assert data["results"][0]["name"] == "20th Century Fox"
        assert data["results"][0]["slug"] == "20th-century-fox"


def test_get(app, add_test_distributor):
    with app.app_context():

        response = services.distributor.get("20th-century-fox")
        assert response == {
            "id": 1,
            "name": "20th Century Fox",
            "slug": "20th-century-fox",
        }


def test_get_films(app, add_test_film):
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
    with app.app_context():

        response = services.distributor.add_distributor("20th Century Fox")

        assert response.name == "20th Century Fox"
        assert response.slug == "20th-century-fox"

        response = services.distributor.add_distributor("Warner Bros")

        assert response.name == "Warner Bros"
        assert response.slug == "warner-bros"


def test_search(app, add_test_distributor):
    with app.app_context():

        response = services.distributor.search("Fox")

        assert response[0]["name"] == "20th Century Fox"
        assert response[0]["slug"] == "20th-century-fox"

        response = services.distributor.search("Warner Bros")

        assert response == []


def test_market_share(app, add_test_film):
    with app.app_context():

        response = services.distributor.market_share()
        data = json.loads(response.data)

        assert data["results"][0]["year"] == 2022
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000


def test_market_share_by_year(app, add_test_film):
    with app.app_context():

        response = services.distributor.market_share(2022)
        data = json.loads(response.data)

        assert data["results"][0]["year"] == 2022
        assert data["results"][0]["distributor"]["slug"] == "20th-century-fox"
        assert data["results"][0]["gross"] == 1000
