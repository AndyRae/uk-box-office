import datetime

from ukbo import models


def test_film_week(app):
    """
    Test film week model

    :param app: Flask app
    """
    with app.app_context():
        disney = models.Distributor(name="Disney")
        film = models.Film(name="The Lion King", distributor=disney)

        week = {
            "date": datetime.date(2019, 7, 6),
            "rank": 1,
            "weeks_on_release": 1,
            "number_of_cinemas": 100,
            "weekend_gross": 500,
            "week_gross": 1000,
            "total_gross": 1000,
            "site_average": 5.0,
        }
        record = {
            "film": film,
            "distributor": disney,
        }

        record.update(**week)

        film_week = models.Film_Week.create(**record, commit=True)

        assert film.gross == 1000
        assert film.multiple == 0
        assert film_week.film == film
        assert film_week.distributor == disney
        assert film_week.date == datetime.datetime(2019, 7, 6)
        assert film_week.rank == 1
        assert film_week.weeks_on_release == 1
        assert film_week.number_of_cinemas == 100
        assert film_week.weekend_gross == 500
        assert film_week.week_gross == 1000
        assert film_week.total_gross == 1000
        assert film_week.site_average == 5.0
