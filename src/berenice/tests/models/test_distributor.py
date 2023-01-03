def test_distributor(make_distributor):
    """
    Test distributor model creation.

    Args:
        app: Flask app
    """

    fox = make_distributor()
    disney = make_distributor(name="Disney")
    disney_duplicate = make_distributor(name="Disney")

    assert fox.name == "20th Century Fox"
    assert fox.slug == "20th-century-fox"

    assert disney != fox
    assert disney == disney_duplicate
