from ukbo import models


def test_distributor(app):
    """
    Test distributor model

    :param app: Flask app
    """
    fox = models.Distributor(name="20th Century Fox")
    disney = models.Distributor(name="Disney")
    disney_duplicate = models.Distributor(name="Disney")

    assert fox.name == "20th Century Fox"
    assert fox.slug == "20th-century-fox"

    assert disney != fox
    assert disney == disney_duplicate
