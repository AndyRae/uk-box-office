import click
from flask.cli import with_appcontext

from ukbo import tasks


@click.command("init-db")
@with_appcontext
def init_db_command() -> None:
    """Clears data and creates new tables."""
    tasks.init_db()
    click.echo("Initialised the database.")


@click.command("fill-db")
@with_appcontext
def fill_db_command() -> None:
    """Fills db with archive data"""
    path = "./data/archive.csv"
    tasks.fill_db(path)
    click.echo("Filled the database.")


@click.command("test-db")
@with_appcontext
def test_db_command() -> None:
    """Fills db with some test data"""
    path = "./data/test.csv"
    tasks.fill_db(path)
    click.echo("Filled the database with test data.")


@click.command("build-static")
@with_appcontext
def build_static_command() -> None:
    """
    Builds a cache of the reports.
    For the fast load on the static report views.
    """
    tasks.static_top_films()
    click.echo("Built top films cache")
    tasks.static_distributor_market()
    click.echo("Built distributor market cache")
    click.echo("Built static data cache")


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
