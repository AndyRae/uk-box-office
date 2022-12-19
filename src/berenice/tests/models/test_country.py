from ukbo import models


def test_distributor(app):
    """
    Test country model

    :param app: Flask app
    """
    uk = models.Country(name="United Kingdom")
    us = models.Country(name="United States")
    us_duplicate = models.Country(name="United States")

    assert uk.name == "United Kingdom"
    assert uk.slug == "united-kingdom"

    assert us != uk
    assert us == us_duplicate
