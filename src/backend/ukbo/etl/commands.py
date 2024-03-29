import click
from flask.cli import with_appcontext

from . import tasks


@click.command("clear-db")
@with_appcontext
def init_db_command() -> None:
    """
    Drops all database tables.

    Only useful for testing.
    """
    tasks.clear_db()
    click.echo("Initialised the database.")


@click.command("fill-db")
@click.option("--path", help="Path to archive.csv", type=str)
@with_appcontext
def fill_db_command(path: str = "./data/archive.csv") -> None:
    """
    Seeds database with archive data.
    """
    tasks.seed_db(path)
    click.echo("Filled the database.")


@click.command("test-db")
@click.option("--path", help="Path to test.csv", type=str)
@with_appcontext
def test_db_command(path: str = "./data/test.csv") -> None:
    """
    Seeds database with test data.
    """
    tasks.seed_db(path)
    click.echo("Filled the database with test data.")


@click.command("seed-films")
@click.option("--path", help="Path to archive.csv", type=str)
@with_appcontext
def seed_films_command(path: str = "./data/archive.csv") -> None:
    """
    Seeds database with countries/distributors/films data.
    """
    tasks.seed_films(path)
    click.echo("Seeded films data.")


@click.command("seed-box-office")
@click.option("--year", help="Year to seed", type=int)
@click.option("--path", help="Path to archive.csv", type=str)
@with_appcontext
def seed_box_office_command(
    year: int, path: str = "./data/archive.csv"
) -> None:
    """
    Seeds database with box office data.

    Args:
        year: Year to seed.

    """
    tasks.seed_box_office(path, year=year)
    click.echo("Seeded box office data")


@click.command("seed-admissions")
@click.option("--path", help="Path to admissions.csv", type=str)
@with_appcontext
def seed_admissions_command(path: str = "./data/admissions.csv") -> None:
    """
    Seeds database with admissions data.
    """
    tasks.seed_admissions(path)
    click.echo("Seeded admissions data")


@click.command("update-admissions")
@click.option("--year", prompt=True, type=int)
@click.option("--month", prompt=True, type=int)
@click.option("--admissions", prompt=True, type=int)
@with_appcontext
def update_admissions_command(year: int, month: int, admissions: int) -> None:
    """
    Updates admissions data for a given month.

    Args:
        year: Year of admissions data.
        month: Month of admissions data.
        admissions: Number of admissions.

    """
    tasks.update_admissions(year, month, admissions)
    click.echo("Updated admissions data")


@click.command("forecast")
@with_appcontext
def forecast_command() -> None:
    """
    Runs the forecast pipeline.

    Builds a new forecast and saves it to the database.
    """
    tasks.forecast_task()
    click.echo("Built new forecast.")


@click.command("marketshare")
@with_appcontext
def market_share_command() -> None:
    """
    Runs the market share task.

    """
    tasks.load_market_share()
    click.echo("Loaded market share data.")


@click.command("weekly-etl")
@with_appcontext
def weekly_etl_command() -> None:
    """
    Runs the weekly etl for new box office data.

    Downloads the latest box office data and saves it to the database.
    """
    tasks.weekly_etl()
    click.echo("Ran weekly etl.")


@click.command("backup-etl")
@click.argument("source_url")
@click.argument("date")
@with_appcontext
def backup_etl_command(source_url: str, date: str) -> None:
    """
    A backup interface for the ETL pipeline.

    Args:
        source_url: URL of the excel file to download.
        date: Date of the excel file. %d %B %Y format.

    """
    tasks.backup_etl(source_url, date)


@click.command("rollback-etl")
@with_appcontext
def rollback_etl_command() -> None:
    """
    Deletes the last week of data.
    Film Weeks and Weeks tables are updated.

    Actual Films are not deleted.
    """
    tasks.rollback_etl()


@click.command("rollback-year")
@click.option("--year", help="Year to rollback", type=int)
@with_appcontext
def rollback_year_command(year: int) -> None:
    """
    Deletes year of box office data.

    Args:
        year: Year to rollback.

    """

    tasks.rollback_year(year)
    click.echo(f"Deleted {year}")


@click.command("delete-film")
@click.option("--film", help="Film ID to rollback", type=int)
@with_appcontext
def delete_film_command(film: int) -> None:
    """
    Deletes film of box office data.

    Args:
        film: Film ID to rollback.

    """

    tasks.delete_film(film)
    click.echo(f"Deleted {film}")


@click.command("build-archive")
@with_appcontext
def build_archive_command() -> None:
    """
    Builds the box office archive file from the database.
    """
    tasks.build_archive()
    click.echo("Built archive file.")
