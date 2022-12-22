import pytest
from ukbo import models


def test_distributor(app, make_distributor):
    """
    Test distributor model

    :param app: Flask app
    """

    fox = make_distributor()
    disney = make_distributor(name="Disney")
    disney_duplicate = make_distributor(name="Disney")

    assert fox.name == "20th Century Fox"
    assert fox.slug == "20th-century-fox"

    assert disney != fox
    assert disney == disney_duplicate
