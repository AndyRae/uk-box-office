from flask import current_app
from ukbo import etl, models


def test_load_distributors(app):
    """
    Test load_distributors function
    """
    distributors = ["20th Century Fox"]

    with app.app_context():
        etl.load.load_distributors(distributors)
        response = models.Distributor.query.filter_by(
            name=distributors[0]
        ).first()

    assert response.name == "20th Century Fox"
    assert response.slug == "20th-century-fox"


def test_load_countries(app):
    """
    Test load_countries function
    """
    countries = ["United Kingdom"]

    with app.app_context():
        etl.load.load_countries(countries)
        response = models.Country.query.filter_by(
            name=countries[0].upper()
        ).first()
        current_app.logger.warning(response)

    assert response.name == "UNITED KINGDOM"
    assert response.slug == "united-kingdom"


def test_load_films(app):
    """
    Test load_films function
    """

    film = {
        "film": "The Lion King",
        "distributor": "Disney",
        "country": "United Kingdom",
    }

    with app.app_context():
        etl.load.load_films([film])
        response = models.Film.query.filter_by(name=film["film"]).first()

    assert response.name == "The Lion King"
    assert response.slug == "the-lion-king"
    assert response.distributor.name == "Disney"
    assert response.distributor.slug == "disney"
    assert response.countries[0].name == "UNITED KINGDOM"
    assert response.countries[0].slug == "united-kingdom"
