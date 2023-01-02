import datetime


def test_week(make_week):
    """
    Test week model creation.

    Args:
        :param make_week: Fixture to create a week
    """
    week = make_week(datetime.date(2019, 7, 6))

    assert week.date == datetime.date(2019, 7, 6)
    assert week.number_of_cinemas == 700
    assert week.number_of_releases == 10
    assert week.weekend_gross == 500
    assert week.week_gross == 1000
    assert week.admissions == 100
    assert week.forecast_high == 1500
    assert week.forecast_medium == 1000
    assert week.forecast_low == 500
