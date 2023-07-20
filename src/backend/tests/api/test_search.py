import json


def test_search_film(app, client, add_test_film):
    """
    Test search endpoint.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    result = client.get("/api/search?q=nope", follow_redirects=True)
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["films"]["count"] == 1
    assert data["films"]["max_gross"] == 1000
    assert len(data["films"]["distributors"]) == 1
    assert len(data["films"]["countries"]) == 1
    assert data["films"]["results"][0]["name"] == "Nope"
    assert data["films"]["results"][0]["gross"] == 1000
    assert (
        data["films"]["results"][0]["distributors"][0]["name"]
        == "20th Century Fox"
    )


def test_search_distributor(app, client, add_test_film):
    """
    Test search endpoint for distributors.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    result = client.get("/api/search?q=20th", follow_redirects=True)
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["distributors"][0]["name"] == "20th Century Fox"
    assert data["distributors"][0]["slug"] == "20th-century-fox"


def test_search_country(app, client, add_test_film):
    """
    Test search endpoint for countries.

    Args:
        app: Flask app
        client: Flask test client
        add_test_film: Fixture to add a test film
    """
    result = client.get("/api/search?q=united", follow_redirects=True)
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["countries"][0]["name"] == "United Kingdom"
    assert data["countries"][0]["slug"] == "united-kingdom"


def test_search_empty(app, client):
    """
    Test search endpoint for empty results.

    Args:
        app: Flask app
        client: Flask test client
    """
    result = client.get("/api/search?q=notfound", follow_redirects=True)
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["films"] == {
        "count": 0,
        "countries": [],
        "distributors": [],
        "max_gross": 0,
        "next": "",
        "previous": "",
        "results": [],
    }
    assert data["distributors"] == []
    assert data["countries"] == []
