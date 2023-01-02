def test_country(make_country):
    """
    Test country model creation.

    Args:
        :param app: Flask app
    """

    uk = make_country()
    us = make_country(name="United States")
    us_duplicate = make_country(name="United States")

    assert uk.name == "United Kingdom"
    assert uk.slug == "united-kingdom"

    assert us != uk
    assert us == us_duplicate
