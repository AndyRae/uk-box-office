from ukbo import etl


def test_find_recent_film():
    """
    Test find_recent_film function
    """
    df = etl.transform.find_recent_film()
    assert df is not None


def test_get_week_box_office():
    """
    Test get_week_box_office function
    """
    df = etl.transform.get_week_box_office()
    assert df is not None
