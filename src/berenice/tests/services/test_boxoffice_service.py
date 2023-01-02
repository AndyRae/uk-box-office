import datetime
import json

import pytest
from ukbo import services


def test_all(app, add_test_film):
    with app.app_context():
        response = services.boxoffice.all()

    data = json.loads(response.data)

    assert data["count"] == 1
    assert data["previous"] == ""
    assert data["next"] == ""
    assert data["results"][0]["date"] == "2022-01-20"
    assert data["results"][0]["film"] == "Nope"
    assert data["results"][0]["film_slug"] == "nope"
    assert data["results"][0]["week_gross"] == 1000
    assert data["results"][0]["weekend_gross"] == 500
    assert data["results"][0]["number_of_cinemas"] == 100
    assert data["results"][0]["rank"] == 1
    assert data["results"][0]["total_gross"] == 1000
    assert data["results"][0]["site_average"] == 5.0
    assert data["results"][0]["weeks_on_release"] == 1
    assert data["results"][0]["distributor"] == "20th Century Fox"
    assert data["results"][0]["distributor_slug"] == "20th-century-fox"


def test_all_filtered(app, add_test_film):
    with app.app_context():
        response = services.boxoffice.all(start="2022-01-20", end="2022-01-21")

    data = json.loads(response.data)

    assert data["count"] == 1
    assert data["previous"] == ""
    assert data["next"] == ""
    assert data["results"][0]["date"] == "2022-01-20"
    assert data["results"][0]["film"] == "Nope"
    assert data["results"][0]["film_slug"] == "nope"
    assert data["results"][0]["week_gross"] == 1000
    assert data["results"][0]["weekend_gross"] == 500
    assert data["results"][0]["number_of_cinemas"] == 100
    assert data["results"][0]["rank"] == 1
    assert data["results"][0]["total_gross"] == 1000
    assert data["results"][0]["site_average"] == 5.0
    assert data["results"][0]["weeks_on_release"] == 1
    assert data["results"][0]["distributor"] == "20th Century Fox"
    assert data["results"][0]["distributor_slug"] == "20th-century-fox"


def test_all_filtered_empty(app, add_test_film):
    with app.app_context():
        response = services.boxoffice.all(start="2022-01-21", end="2022-01-22")

    data = json.loads(response.data)

    assert data["count"] == 0
    assert data["previous"] == ""
    assert data["next"] == ""
    assert data["results"] == []


def test_topfilms(app, add_test_film):
    with app.app_context():
        response = services.boxoffice.topfilms()

    data = json.loads(response.data)

    assert data["results"][0]["film"]["name"] == "Nope"
    assert data["results"][0]["film"]["slug"] == "nope"
    assert data["results"][0]["film"]["gross"] == 1000
    assert (
        data["results"][0]["film"]["distributor"]["name"] == "20th Century Fox"
    )
    assert (
        data["results"][0]["film"]["distributor"]["slug"] == "20th-century-fox"
    )


def test_summary(app, add_test_week):
    with app.app_context():
        response = services.boxoffice.summary("2022-01-19", "2022-01-21", 1)

    data = json.loads(response.data)

    assert data["results"][0]["year"] == 2022
    assert data["results"][0]["week_gross"] == 1000
    assert data["results"][0]["weekend_gross"] == 500
    assert data["results"][0]["number_of_cinemas"] == 700
    assert data["results"][0]["number_of_releases"] == 10


def test_summary_single_week(app, add_test_week):
    with app.app_context():
        response = services.boxoffice.summary("2022-01-20", "2022-01-20", 1)

    data = json.loads(response.data)

    assert data["results"][0]["year"] == 2022
    assert data["results"][0]["week_gross"] == 1000
    assert data["results"][0]["weekend_gross"] == 500
    assert data["results"][0]["number_of_cinemas"] == 700
    assert data["results"][0]["number_of_releases"] == 10


def test_summary_empty(app, add_test_week):
    with app.app_context():
        response = services.boxoffice.summary("2022-01-21", "2022-01-22", 1)

    data = json.loads(response.data)

    assert data["results"] == []


def test_previous(app, add_test_week):
    with app.app_context():
        response = services.boxoffice.previous("2023-01-19", "2023-01-21")

    data = json.loads(response.data)

    assert data["results"][0]["year"] == 2022
    assert data["results"][0]["week_gross"] == 1000
    assert data["results"][0]["weekend_gross"] == 500
    assert data["results"][0]["number_of_cinemas"] == 700
    assert data["results"][0]["number_of_releases"] == 10


def test_previous_single_week(app, add_test_week):
    with app.app_context():
        response = services.boxoffice.previous("2023-01-20", "2023-01-20")

    data = json.loads(response.data)

    assert data["results"][0]["year"] == 2022
    assert data["results"][0]["week_gross"] == 1000
    assert data["results"][0]["weekend_gross"] == 500
    assert data["results"][0]["number_of_cinemas"] == 700
    assert data["results"][0]["number_of_releases"] == 10


def test_previous_empty(app, add_test_week):
    with app.app_context():
        response = services.boxoffice.previous("2022-01-10", "2022-01-17")

    data = json.loads(response.data)

    assert data["results"] == []


def test_topline(app, add_test_week):
    with app.app_context():
        response = services.boxoffice.topline("2022-01-19", "2022-01-21")

    data = json.loads(response.data)

    assert data["results"][0]["week_gross"] == 1000
    assert data["results"][0]["weekend_gross"] == 500
    assert data["results"][0]["number_of_releases"] == 10
    assert data["results"][0]["number_of_cinemas"] == 700
    assert data["results"][0]["forecast_high"] == 1500
    assert data["results"][0]["forecast_medium"] == 1000
    assert data["results"][0]["forecast_low"] == 500


def test_topline_empty(app, add_test_week):
    with app.app_context():
        response = services.boxoffice.topline("2022-01-21", "2022-01-22")

    data = json.loads(response.data)

    assert data["results"] == []


@pytest.mark.skip(reason="Fix the build archive function")
def test_build_archive(app, add_test_week):
    """
    TODO: Fix the build archive function.
    """
    with app.app_context():
        response = services.boxoffice.build_archive()

    assert response.columns == [
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
    assert response.shape == (10, 1)
    assert response["date"].iloc[0] == "2022-01-20"
    assert response["rank"].iloc[0] == 1
    assert response["film"].iloc[0] == "Nope"
    assert response["country"].iloc[0] == "UK"
    assert response["weekend_gross"].iloc[0] == 500
    assert response["distributor"].iloc[0] == "20th Century Fox"
    assert response["weeks_on_release"].iloc[0] == 1
    assert response["number_of_cinemas"].iloc[0] == 700
    assert response["total_gross"].iloc[0] == 1000
    assert response["week_gross"].iloc[0] == 1000


def test_to_date():
    response = services.boxoffice.to_date("2022-01-19")
    assert response == datetime.datetime(2022, 1, 19)
