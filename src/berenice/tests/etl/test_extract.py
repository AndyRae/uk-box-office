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
