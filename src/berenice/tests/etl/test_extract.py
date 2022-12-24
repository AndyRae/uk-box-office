import datetime

from ukbo import db, etl, models


def test_check_file_new(
    app, make_film_week, make_film, make_distributor, make_country
):
    """
    Test check_file_new function

    :param app: Flask app
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
    Test check_file_new function with no film weeks

    :param app: Flask app
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
    Test extract_box_office function
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
    assert "United Kingdom" in df["country"].tolist()
    assert "DISNEY" in df["distributor"].tolist()
    assert 1 in df["rank"].tolist()
    assert 643 in df["number_of_cinemas"].tolist()
    assert 44301 in df["weekend_gross"].tolist()
    assert 981057 in df["total_gross"].tolist()
    assert 7 in df["weeks_on_release"].tolist()
    assert "20221113" in df["date"].tolist()
