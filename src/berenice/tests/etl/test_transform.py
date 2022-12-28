import datetime

import pandas as pd
import pytest
from ukbo import db, etl


@pytest.fixture
def add_test_data(
    app, make_film_week, make_film, make_distributor, make_country
):
    """
    Add test data to the database
    """
    with app.app_context():

        distributor = make_distributor()
        countries = [make_country()]
        film = make_film("Nope", distributor, countries)
        film_week = make_film_week(
            date=datetime.date(2022, 1, 20), film=film, distributor=distributor
        )

        db.session.add(distributor)
        db.session.add(film)
        db.session.add(film_week)
        db.session.commit()


def test_find_recent_film(app, add_test_data):
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


def test_get_week_box_office(app, add_test_data):
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


def test_get_week_box_office_week_1(app, add_test_data):
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


def test_get_week_box_office_no_film(app, add_test_data):
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


def test_get_week_box_office_errors(app, add_test_data):
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
