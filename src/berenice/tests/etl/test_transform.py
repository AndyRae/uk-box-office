import pandas as pd
from ukbo import db, etl


def test_find_recent_film(app, add_test_film):
    """
    Test find_recent_film function
    """
    df = pd.Series(
        {
            "date": "20220127",
            "film": "Nope",
        }
    )

    with app.app_context():
        response = etl.transform.find_recent_film(df)

    assert response is not None
    assert response.film.name == "Nope"
    assert response.total_gross == 1000
    assert response.week_gross == 1000
    assert response.weekend_gross == 500


def test_get_week_box_office(app, add_test_film):
    """
    Test get_week_box_office function
    """

    df = pd.Series(
        {
            "date": "20220127",
            "film": "Nope",
            "weekend_gross": 500,
            "total_gross": 3000,
            "weeks_on_release": 3,
        }
    )

    with app.app_context():
        response = etl.transform.get_week_box_office(df)

    assert response is not None
    assert response == 2000


def test_get_week_box_office_week_1(app, add_test_film):
    """
    Test get_week_box_office function
    When the film is in its first week of release
    """

    df = pd.Series(
        {
            "date": "20220127",
            "film": "Nope",
            "weekend_gross": 500,
            "total_gross": 3000,
            "weeks_on_release": 1,
        }
    )

    with app.app_context():
        response = etl.transform.get_week_box_office(df)

    assert response is not None
    assert response == 3000


def test_get_week_box_office_no_film(app, add_test_film):
    """
    Test get_week_box_office function
    When the film is not in the database
    """

    df = pd.Series(
        {
            "date": "20220127",
            "film": "7 Years in Tibet",
            "weekend_gross": 500,
            "total_gross": 3000,
            "weeks_on_release": 3,
        }
    )

    with app.app_context():
        response = etl.transform.get_week_box_office(df)

    assert response is not None
    assert response == 500


def test_get_week_box_office_errors(app, add_test_film):
    """
    Test get_week_box_office function
    When there are errors in the data:
    e.g previous week's gross is greater than total gross
    """

    df = pd.Series(
        {
            "date": "20220127",
            "film": "Nope",
            "weekend_gross": 50,
            "total_gross": 100,
            "weeks_on_release": 3,
        }
    )

    with app.app_context():
        response = etl.transform.get_week_box_office(df)

    assert response is not None
    assert response == 50
