import pytest
from unittest.mock import patch, Mock, mock_open
import unittest
from datetime import datetime, timedelta
import pandas as pd

import settings
import helper


@patch("helper.pd.read_csv")
@pytest.mark.parametrize(
    "test_input,expected",
    [
        ("20TH CENTRUY FOX", "20TH CENTURY FOX",),
        ("WARNER BROS.", "WARNER BROS"),
        ("CURZON", "CURZON"),
    ],
)
def test_spellcheck_distributor(mock_read_csv, test_input, expected):
    mock_read_csv.return_value = pd.DataFrame(
        {
            "key": ["20TH CENTRUY FOX", "WARNER BROS."],
            "correction": ["20TH CENTURY FOX", "WARNER BROS"],
        }
    )
    result = helper.spellcheck_distributor(test_input)

    assert result == expected
    mock_read_csv.assert_called_once_with("./data/distributor_check.csv", header=None)


@patch("helper.pd.read_csv")
@pytest.mark.parametrize(
    "test_input,expected",
    [
        (
            "HARRY POTTER AND THE HALF BLOOD PRINCE",
            "HARRY POTTER AND THE HALF-BLOOD PRINCE",
        ),
        ("WOMAN IN BLACK, THE", "THE WOMAN IN BLACK"),
        ("THE WOMAN IN BLACK (MOMENTUM)", "THE WOMAN IN BLACK"),
        ("LA DOLCE VITA", "LA DOLCE VITA"),
    ],
)
def test_spellcheck_film(mock_read_csv, test_input, expected):
    mock_read_csv.return_value = pd.DataFrame(
        {
            "key": [
                "HARRY POTTER AND THE HALF BLOOD PRINCE",
                "WOMAN IN BLACK, THE",
                "THE WOMAN IN BLACK (MOMENTUM)",
            ],
            "correction": [
                "HARRY POTTER AND THE HALF-BLOOD PRINCE",
                "THE WOMAN IN BLACK",
                "THE WOMAN IN BLACK",
            ],
        }
    )
    result = helper.spellcheck_film(test_input)

    assert result == expected
    mock_read_csv.assert_called_once_with("./data/film_check.csv", header=None)


def test_get_last_sunday():
    # TODO: This is not how to test a datetime function.
    today = datetime.now()
    sunday = today - timedelta(days=today.isoweekday())
    assert helper.get_last_sunday() == sunday.strftime("%Y%m%d")


@patch("helper.pd.read_csv")
@pytest.mark.parametrize(
    "test_input,expected", [(1, 43707991.0,), (10, 271538.0),],
)
def test_get_week_box_office(mock_read_csv, test_input, expected):
    d = {
        "date": 20200315,
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
    mock_read_csv.return_value = pd.DataFrame(
        {
            "date": [20200308],
            "rank": [1.0],
            "title": ["1917"],
            "country": ["UK/USA"],
            "weekend_gross": [247291.0],
            "distributor": ["EONE FILMS"],
            "weeks_on_release": [9],
            "number_of_cinemas": [388.0],
            "total_gross": [43436453.0],
        })
    
    result = helper.get_week_box_office(df)
    assert result == expected

