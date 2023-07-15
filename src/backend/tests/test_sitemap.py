import datetime
import string

from ukbo import models, sitemap


def test_return_sitemap(app):
    """
    Test that the return_sitemap function returns the correct data.

    Args:
        client: The Flask test client
    """
    # Test that the return_sitemap function returns the correct content type
    with app.app_context():
        response = sitemap.return_sitemap([])
    assert response.headers["Content-Type"] == "application/xml"

    # Test that the return_sitemap function returns the correct data
    data = response.data.decode()
    assert "xml" in data
    assert "urlset" in data


def test_sitemap(client):
    """
    Test that the sitemap route returns the correct data.
    Including the alphabet and numbers index pages.

    Args:
        client: The Flask test client
    """
    # Test that the sitemap route returns a 200 status code
    response = client.get("/sitemap.xml")
    assert response.status_code == 200

    # Test that the sitemap route returns the correct content type
    assert response.headers["Content-Type"] == "application/xml"

    # Test that the sitemap contains the correct data
    data = response.data.decode()
    assert "sitemapindex" in data
    for i in range(10):
        assert str(i) in data
    for c in string.ascii_lowercase:
        assert c in data


def test_films_letter(app, client, add_test_film):
    """
    Test that the films_letter route returns the correct data.

    Args:
        client: The Flask test client
    """
    # Test that the films_letter route returns a 202 status code for an integer
    response = client.get("/sitemap_1.xml")
    assert response.status_code == 200

    # Test that the films_letter route returns a 200 status code for a valid letter
    response = client.get("/sitemap_n.xml")
    assert response.status_code == 200

    # Test that the films_letter route returns the correct content type
    assert response.headers["Content-Type"] == "application/xml"

    # Test that the films_letter route returns the correct data
    data = response.data.decode()
    assert "xml" in data
    with app.app_context():
        films = models.Film.query.filter(
            models.Film.name.startswith("n")
        ).all()
    for film in films:
        url = f"https://boxofficedata.co.uk/film/{film.slug}"
        assert url in data
        now = datetime.datetime.now() - datetime.timedelta(days=10)
        lastmod = now.strftime("%Y-%m-%d")
        assert lastmod in data


def test_countries_sitemap(app, client):
    """
    Test that the countries route returns the correct data.

    Args:
        client: The Flask test client
    """
    # Test that the countries route returns a 200 status code
    response = client.get("/sitemap_countries.xml")
    assert response.status_code == 200

    # Test that the countries route returns the correct content type
    assert response.headers["Content-Type"] == "application/xml"

    # Test that the countries route returns the correct data
    data = response.data.decode()
    assert "xml" in data
    with app.app_context():
        countries = models.Country.query.all()
    for country in countries:
        url = f"https://boxofficedata.co.uk/countries/{country.slug}"
        assert url in data
        now = datetime.datetime.now() - datetime.timedelta(days=10)
        lastmod = now.strftime("%Y-%m-%d")
        assert lastmod in data


def test_distributors_sitemap(app, client):
    """
    Test that the distributors route returns the correct data.

    Args:
        client: The Flask test client
    """
    # Test that the distributors route returns a 200 status code
    response = client.get("/sitemap_distributors.xml")
    assert response.status_code == 200

    # Test that the distributors route returns the correct content type
    assert response.headers["Content-Type"] == "application/xml"

    # Test that the distributors route returns the correct data
    data = response.data.decode()
    assert "xml" in data
    with app.app_context():
        distributors = models.Distributor.query.all()
    for distributor in distributors:
        url = f"https://boxofficedata.co.uk/distributors/{distributor.slug}"
        assert url in data
        now = datetime.datetime.now() - datetime.timedelta(days=10)
        lastmod = now.strftime("%Y-%m-%d")
        assert lastmod in data


def test_time(app, client, add_test_week):
    """
    Test that the time route returns the correct data.

    Args:
        app: The Flask app
        client: The Flask test client
        add_film_week: The add_film_week fixture
    """

    # Test that the time route returns a 200 status code
    response = client.get("/sitemap_time.xml")
    assert response.status_code == 200

    # Test that the time route returns the correct content type
    assert response.headers["Content-Type"] == "application/xml"

    # Test that the time route returns the correct data
    data = response.data.decode()
    assert "xml" in data
    with app.app_context():
        time = models.Film_Week.query.all()
    now = datetime.datetime.now() - datetime.timedelta(days=10)
    for t in time:
        date = t.date.strftime("%Y/m%m/d%d")
        url = f"https://boxofficedata.co.uk/time/{date}"
        assert url in data
        assert str(t.date) in data
    for i in range(2001, now.year):
        url = f"https://boxofficedata.co.uk/time/{i}"
        assert url in data
        assert str(i) in data
        for j in range(1, 13):
            url = f"https://boxofficedata.co.uk/time/{i}/m{j}"
            assert url in data
            assert str(i) in data
