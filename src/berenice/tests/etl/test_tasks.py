import os

import click
import pandas as pd
from ukbo import db, etl, models, services


def test_forecast_task(app, add_test_weeks):
    """
    Test forecast_task function.
    Test that the forecast field of the week is updated.

    Args:
        app: Flask app
        add_test_weeks: Add multiple test weeks to database
    """
    with app.app_context():
        # Get click context and run forecast_task
        ctx = click.Context(click.Command("cmd"), obj={"prop": "A Context"})
        with ctx:
            etl.tasks.forecast_task()

            # Check that the forecast field of the week is updated
            week = models.Week.query.first()
            assert week.forecast_high is not None
            assert week.forecast_low is not None
            assert week.forecast_medium is not None


def test_seed_films(app, tmp_path):
    """
    Test seed_films function.
    Test that the films table is updated.

    Args:
        app: Flask app
        tmp_path: Temporary path
    """
    path = tmp_path / "films.csv"
    # Create test csv file
    df = pd.DataFrame(
        {
            "film": ["Test Film"],
            "distributor": ["Test Distributor"],
            "country": ["Test Country"],
        }
    )
    df.to_csv(path, index=False)

    with app.app_context():
        # Get click context and run seed_films
        ctx = click.Context(click.Command("cmd"), obj={"prop": "A Context"})
        with ctx:
            etl.tasks.seed_films(path)

            # Check that the films table has been updated
            assert len(models.Film.query.all()) == 1
            film = models.Film.query.first()
            assert film.name == "Test Film"
            assert film.distributor.name == "Test Distributor"
            assert film.countries[0].name == "TEST COUNTRY"


def test_seed_box_office(app, tmp_path):
    """
    Test seed_box_office function.
    Test that the box_office field of the week is updated.

    Args:
        app: Flask app
        tmp_path: Temporary path
    """
    path = tmp_path / "box_office.csv"
    # Create test csv file
    df = pd.DataFrame(
        {
            "date": ["20220120"],
            "rank": [1],
            "film": ["Test Film"],
            "country": ["Test Country"],
            "weekend_gross": [500],
            "distributor": ["Test Distributor"],
            "weeks_on_release": [1],
            "number_of_cinemas": [100],
            "total_gross": [1000],
            "week_gross": [1000],
        }
    )
    df.to_csv(path, index=False)

    with app.app_context():
        # Get click context and run seed_box_office
        ctx = click.Context(click.Command("cmd"), obj={"prop": "A Context"})
        with ctx:
            etl.tasks.seed_box_office(path)

            # Check that the week has been updated
            assert len(models.Week.query.all()) == 1
            assert models.Week.query.first().week_gross == 1000

            # Check that the film has been updated
            assert len(models.Film.query.all()) == 1
            assert models.Film.query.first().name == "Test Film"

            # Check that the film_week has been updated
            assert len(models.Film_Week.query.all()) == 1
            assert models.Film_Week.query.first().week_gross == 1000


def test_seed_admissions(app, tmp_path, add_test_week):
    """
    Test seed_admissions function.
    Test that the admissions field of the week is updated.

    Args:
        app: Flask app
        tmp_path: Temporary path
        add_test_week: Fixture to add test week
    """
    path = tmp_path / "admissions.csv"
    # Create test csv file
    df = pd.DataFrame(
        {
            "date": ["01/01/2022"],
            "admissions": [100],
        }
    )
    df.to_csv(path, index=False)

    with app.app_context():
        # Get click context and run seed_admissions
        ctx = click.Context(click.Command("cmd"), obj={"prop": "A Context"})
        with ctx:
            etl.tasks.seed_admissions(path)

            # Check that the week has been updated
            assert models.Week.query.first().admissions == 100


def test_update_admissions(app, add_test_week):
    """
    Test update_admissions function updates the admissions field of the week.

    Args:
        app: Flask app
        add_test_week: Fixture to add test week
    """
    with app.app_context():
        # Get click context and run rollback_etl
        ctx = click.Context(click.Command("cmd"), obj={"prop": "A Context"})
        with ctx:
            etl.tasks.update_admissions(2022, 1, 200)

            # Check that the week has been updated
            assert models.Week.query.first().admissions == 200


def test_rollback_etl(app, add_test_film, add_test_week):
    """
    Test rollback_etl function.
    Only the last week of data should be deleted, but not the film, country, or distributor.

    Args:
        app: Flask app
        add_test_film: Fixture to add test film
        add_test_week: Fixture to add test week
    """
    with app.app_context():
        # Get click context and run rollback_etl
        ctx = click.Context(click.Command("cmd"), obj={"prop": "A Context"})
        with ctx:
            etl.tasks.rollback_etl()

            # Check that the week has been reset
            assert models.Week.query.first().weekend_gross == 0

            # Check that the film_week has been deleted
            assert len(models.Film_Week.query.all()) == 0

            # Check that the film has not been deleted
            assert len(models.Film.query.all()) == 1

            # Check that the country has not been deleted
            assert len(models.Country.query.all()) == 1

            # Check that the distributor has not been deleted
            assert len(models.Distributor.query.all()) == 1


def test_rollback_year(app, add_test_film, add_test_week):
    """
    Test rollback_year function.
    Only the year of data should be deleted, but not the film, country, or distributor.

    Args:
        app: Flask app
        add_test_film: Fixture to add test film
        add_test_week: Fixture to add test week
    """
    with app.app_context():
        # Get click context and run rollback_year
        ctx = click.Context(click.Command("cmd"), obj={"prop": "A Context"})
        with ctx:
            etl.tasks.rollback_year(2022)

            # Check that the week has been reset
            assert models.Week.query.first().weekend_gross == 0

            # Check that the film_week has been deleted
            assert len(models.Film_Week.query.all()) == 0

            # Check that the film has not been deleted
            assert len(models.Film.query.all()) == 1

            # Check that the country has not been deleted
            assert len(models.Country.query.all()) == 1

            # Check that the distributor has not been deleted
            assert len(models.Distributor.query.all()) == 1


def test_build_archive_task(app, add_test_film, tmp_path):
    """
    Test build_archive_task function.

    Args:
        app: Flask app
        add_test_film: Fixture to add test film
        tmp_path: Temporary path fixture
    """
    # Create a temporary file with click context
    path = tmp_path / "archive_export.csv"
    ctx = click.Context(click.Command("cmd"), obj={"prop": "A Context"})
    with app.app_context():
        with ctx:
            etl.tasks.build_archive(path)

    # Test if the archive file exists
    assert os.path.exists(path)

    # Test if the archive file has the expected number of rows
    df = pd.read_csv(path)
    assert df.shape[0] == 1

    # Test if the archive file has the expected columns
    assert list(df.columns) == [
        "date",
        "rank",
        "film",
        "country",
        "weekend_gross",
        "distributor",
        "weeks_on_release",
        "number_of_cinemas",
        "total_gross",
        "week_gross",
    ]
    assert df.shape == (1, 10)
    assert df["film"].iloc[0] == "Nope"


def test_delete_film_task(app, add_test_distributor, add_test_country):
    """
    Test delete_film_task function.

    Args:
        app: Flask app
        add_test_distributor: Fixture to add test distributor
        add_test_country: Fixture to add test country
    """
    with app.app_context():
        # Add a film to the database
        distributor = (
            db.session.query(models.Distributor)
            .filter_by(slug="20th-century-fox")
            .first()
        )
        country = (
            db.session.query(models.Country)
            .filter_by(slug="united-kingdom")
            .first()
        )

        services.film.add_film(
            "Nope",
            distributor,
            [country],
        )
        # Get click context and run delete_film_task
        ctx = click.Context(click.Command("cmd"), obj={"prop": "A Context"})
        with ctx:
            etl.tasks.delete_film(1)

            # Check that the film has been deleted
            assert len(models.Film.query.all()) == 0
