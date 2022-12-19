from ukbo import models


def test_distributor(app):
    """
    Test distributor model

    :param app: Flask app
    """
    distributor = models.Distributor(name="Test Distributor")

    assert distributor.name == "Test Distributor"
    assert distributor.slug == "test-distributor"
