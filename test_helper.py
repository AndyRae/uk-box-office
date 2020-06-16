import pytest
from datetime import datetime, timedelta
import pandas as pd

import helper


def test_get_excel_file():
    assert helper.get_excel_file(
        "https://www.bfi.org.uk/education-research/film-industry-statistics-research/weekend-box-office-figures"
    ).endswith(".xls")


def test_spellcheck_distributor():
    assert helper.spellcheck_distributor("20TH CENTRUY FOX") == "20TH CENTURY FOX"


@pytest.mark.parametrize(
    "test_input,expected",
    [
        (
            "HARRY POTTER AND THE HALF BLOOD PRINCE",
            "HARRY POTTER AND THE HALF-BLOOD PRINCE",
        ),
        ("WOMAN IN BLACK, THE", "THE WOMAN IN BLACK"),
    ],
)
def test_spellcheck_film(test_input, expected):
    assert helper.spellcheck_film(test_input) == expected


def test_get_last_sunday():
    # TODO: This is not how to test a datetime function.
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    assert helper.get_last_sunday() == sunday.strftime("%Y%m%d")


@pytest.mark.parametrize(
    "test_input,expected", [(1, 43707991.0,), (10, 271538.0),],
)
def test_get_week_box_office(test_input, expected):
    d = {
        "date": 20200607,
        "rank": 1.0,
        "title": "1917",
        "country": "UK/USA",
        "weekend_gross": 108947.0,
        "distributor": "EONE FILMS",
        "weeks_on_release": test_input,
        "number_of_cinemas": 293.0,
        "total_gross": 43707991.0,
    }
    df = pd.Series(data=d)
    assert helper.get_week_box_office(df) == expected
