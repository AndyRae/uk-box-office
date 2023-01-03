import datetime

from ukbo import models, services


def test_add_week(app):
    """
    Test that the add_week() method adds a new week to the database.

    Args:
        app: The Flask application
    """
    with app.app_context():
        date = datetime.datetime(2022, 1, 20)

        services.week.add_week(
            date=date,
            week_gross=1000,
            weekend_gross=500,
            number_of_cinemas=700,
            weeks_on_release=1,
            commit=True,
        )

        response = models.Week.query.filter_by(date=date).first()

        assert response.week_gross == 1000
        assert response.weekend_gross == 500
        assert response.number_of_cinemas == 700
        assert response.number_of_releases == 1


def test_add_existing_week(app, add_test_week):
    """
    Test that the add_week() method updates an existing week in the database.

    Args:
        app: The Flask application
        add_test_week: Fixture to add a test week to the database.
    """
    with app.app_context():
        date = datetime.datetime(2022, 1, 20)

        services.week.add_week(
            date=date,
            week_gross=1000,
            weekend_gross=500,
            number_of_cinemas=800,
            weeks_on_release=1,
            commit=True,
        )

        response = models.Week.query.filter_by(date=date).first()

        assert response.week_gross == 2000
        assert response.weekend_gross == 1000
        assert response.number_of_cinemas == 800
        assert response.number_of_releases == 11
        assert response.admissions == 100
        assert response.forecast_high == 1500
        assert response.forecast_low == 500
        assert response.forecast_medium == 1000


def test_add_week_with_no_new_releases(app):
    """
    Test that the add_week() method adds a new week to the database with no new releases.

    Args:
        app: The Flask application
    """
    with app.app_context():
        date = datetime.datetime(2022, 1, 20)

        services.week.add_week(
            date=date,
            week_gross=1000,
            weekend_gross=500,
            number_of_cinemas=700,
            weeks_on_release=10,
            commit=True,
        )

        response = models.Week.query.filter_by(date=date).first()

        assert response.week_gross == 1000
        assert response.weekend_gross == 500
        assert response.number_of_cinemas == 700
        assert response.number_of_releases == 0


def test_update_admissions(app, add_test_week):
    """
    Test that the update_admissions() method updates the admissions for a week.

    Args:
        app: The Flask application
        add_test_week: Fixture to add a test week to the database.
    """
    with app.app_context():
        date = datetime.datetime(2022, 1, 20)

        services.week.update_admissions(year=2022, month=1, admissions=100)

        response = models.Week.query.filter_by(date=date).first()

        assert response.admissions == 100
