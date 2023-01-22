import datetime

import pytest
import requests  # type: ignore
from bs4 import BeautifulSoup
from ukbo import db, etl


@pytest.fixture
def test_url():
    """
    Create a test URL fixture.
    """
    return "https://www.example.com"


def test_get_soup(test_url):
    """
    Test get_soup function that returns a BeautifulSoup object.

    Args:
        test_url: URL to test
    """
    soup = etl.extract.get_soup(test_url)
    assert isinstance(soup, BeautifulSoup)


def test_get_soup_raises_value_error_on_invalid_url(test_url):
    """
    Test get_soup function that raises a ValueError on invalid URL.

    Args:
        test_url: URL to test
    """
    with pytest.raises(ValueError):
        etl.extract.get_soup("invalid url")


def test_get_soup_raises_request_exception_on_request_timeout(test_url):
    """
    Test get_soup function that raises a RequestException on request timeout.

    Args:
        test_url: URL to test
    """
    with pytest.raises(requests.RequestException):
        etl.extract.get_soup(test_url, timeout=0.001)


def test_download_excel_raises_value_error_on_invalid_link():
    """
    Test download_excel function that raises a ValueError on invalid link.

    Args:
        test_url: URL to test
    """
    with pytest.raises(ValueError):
        etl.extract.download_excel("invalid link", "test_title")


def test_check_file_new(
    app, make_film_week, make_film, make_distributor, make_country
):
    """
    Test check_file_new function with a film week in the database.

    Args:
        app: Flask app
        make_film_week: Fixture to make a film week
        make_film: Fixture to make a film
        make_distributor: Fixture to make a distributor
        make_country: Fixture to make a country
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

        future_excel_title = "21 January 2022"
        current_excel_title = "20 January 2022"
        past_excel_title = "19 January 2021"
        assert etl.extract.check_file_new(future_excel_title) is True
        assert etl.extract.check_file_new(current_excel_title) is False
        assert etl.extract.check_file_new(past_excel_title) is False


def test_check_file_new_no_film_weeks(app):
    """
    Test check_file_new function with no film weeks in the database.

    Args:
        app: Flask app
    """
    with app.app_context():
        future_excel_title = "21 January 2022"
        current_excel_title = "20 January 2022"
        past_excel_title = "19 January 2021"
        assert etl.extract.check_file_new(future_excel_title) is True
        assert etl.extract.check_file_new(current_excel_title) is True
        assert etl.extract.check_file_new(past_excel_title) is True


def test_extract_box_office(app):
    """
    Test extract_box_office function with a test excel file.

    Args:
        app: Flask app
    """
    test_excel_path = "tests/test_data/13 November 2022.xls"

    with app.app_context():
        df = etl.extract.extract_box_office(test_excel_path)

    assert df.columns.tolist() == [
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
    assert "SMILE" in df["film"].tolist()
    assert "DISNEY" in df["distributor"].tolist()
    assert 1 in df["rank"].tolist()
    assert 643 in df["number_of_cinemas"].tolist()
    assert 44301 in df["weekend_gross"].tolist()
    assert 981057 in df["total_gross"].tolist()
    assert 7 in df["weeks_on_release"].tolist()
    assert "20221113" in df["date"].tolist()


def test_find_excel_file(app):
    """
    Test find_excel_file function with a test html file.

    Args:
        app: Flask app
    """
    soup = BeautifulSoup(open("tests/test_data/source.html"), "html.parser")

    with app.app_context():
        excel = etl.extract.find_excel_file(soup=soup)
    assert excel["link"] is not None
    assert excel["link"].endswith(".xls")
    assert excel["title"] == "13 November 2022"
