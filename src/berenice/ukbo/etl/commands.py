import click
from flask.cli import with_appcontext

from . import tasks


@click.command("clear-db")
@with_appcontext
def init_db_command() -> None:
    """Drops all database tables. Useful for testing."""
    tasks.clear_db()
    click.echo("Initialised the database.")


@click.command("fill-db")
@with_appcontext
def fill_db_command() -> None:
    """Fills db with archive data"""
    path = "./data/archive.csv"
    tasks.seed_db(path)
    click.echo("Filled the database.")


@click.command("test-db")
@with_appcontext
def test_db_command() -> None:
    """Fills db with some test data"""
    path = "./data/test.csv"
    tasks.seed_db(path)
    click.echo("Filled the database with test data.")


@click.command("seed-films")
@with_appcontext
def seed_films_command() -> None:
    """Seeds db with countries/distributors/films data"""
    path = "./data/archive.csv"
    tasks.seed_films(path)
    click.echo("Seeded films data.")


@click.command("seed-box-office")
@click.option("--year", help="Year to seed", type=int)
@with_appcontext
def seed_box_office_command(year: int) -> None:
    """Seeds db with box office data"""
    path = "./data/archive.csv"
    tasks.seed_box_office(path, year=year)
    click.echo("Seeded box office data")


@click.command("forecast")
@with_appcontext
def forecast_command() -> None:
    """Runs the forecast pipeline."""
    tasks.forecast_task()
    click.echo("Built new forecast.")


@click.command("weekly-etl")
@with_appcontext
def weekly_etl_command() -> None:
    """Runs the weekly etl for new box office data."""
    tasks.weekly_etl()
    click.echo("Ran weekly etl.")


@click.command("backup-etl")
@click.argument("source_url")
@with_appcontext
def backup_etl_command(source_url: str) -> None:
    """
    A backup CLI for the pipeline - pass the excel file link directly
    """
    tasks.backup_etl_command(source_url)


@click.command("rollback-etl")
@with_appcontext
def rollback_etl_command() -> None:
    """
    Deletes the last week of data.
    Film Weeks and Weeks
    """
    tasks.rollback_etl_command()


@click.command("rollback-year")
@click.option("--year", help="Year to rollback", type=int)
@with_appcontext
def rollback_year_command(year: int) -> None:
    """Deletes year of box office data"""

    tasks.rollback_year(year)
    click.echo(f"Deleted {year}")


@click.command("delete-film")
@click.option("--film", help="Film ID to rollback", type=int)
@with_appcontext
def delete_film_command(film: int) -> None:
    """Deletes film of box office data"""

    tasks.delete_film(film)
    click.echo(f"Deleted {film}")