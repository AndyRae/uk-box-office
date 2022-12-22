import datetime


def test_film_week(make_film, make_distributor, make_country, make_film_week):
    """
    Test film week model

    :param app: Flask app
    """

    distributor = make_distributor()
    country = make_country()
    film = make_film("The Lion King", distributor, [country])

    film_week = make_film_week(
        date=datetime.date(2019, 7, 6),
        rank=1,
        weeks_on_release=1,
        number_of_cinemas=100,
        weekend_gross=500,
        week_gross=1000,
        total_gross=1000,
        site_average=5.0,
        film=film,
        distributor=distributor,
    )

    assert film.gross == 1000
    assert film.multiple == 0
    assert film_week.film == film
    assert film_week.distributor == distributor
    assert film_week.date == datetime.date(2019, 7, 6)
    assert film_week.rank == 1
    assert film_week.weeks_on_release == 1
    assert film_week.number_of_cinemas == 100
    assert film_week.weekend_gross == 500
    assert film_week.week_gross == 1000
    assert film_week.total_gross == 1000
    assert film_week.site_average == 5.0
