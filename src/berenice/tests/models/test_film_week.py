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


def test_film_weeks(
    make_film, make_distributor, make_country, make_film_weeks
):
    """
    Test multiple film weeks
    """

    distributor = make_distributor()
    country = make_country()
    film = make_film("Avatar", distributor, [country])

    make_film_weeks(film, distributor, 10)

    assert film.gross == 10000
    assert film.multiple == 0
    assert len(film.weeks) == 10
    assert film.weeks[0].film == film
    assert film.weeks[0].distributor == distributor
    assert film.weeks[0].rank == 1
    assert film.weeks[0].weeks_on_release == 1
    assert film.weeks[0].number_of_cinemas == 100
    assert film.weeks[0].weekend_gross == 500
    assert film.weeks[0].week_gross == 1000
    assert film.weeks[0].total_gross == 1000
    assert film.weeks[0].site_average == 5.0
    assert film.weeks[9].film == film
    assert film.weeks[9].distributor == distributor
    assert film.weeks[9].rank == 10
    assert film.weeks[9].weeks_on_release == 10
    assert film.weeks[9].number_of_cinemas == 100
    assert film.weeks[9].weekend_gross == 500
    assert film.weeks[9].week_gross == 1000
    assert film.weeks[9].total_gross == 10000
    assert film.weeks[9].site_average == 5.0
