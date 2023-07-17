def test_film(make_film, make_distributor, make_country):
    """
    Test film model creation.

    A film matches another film if they have the same name and distributor.

    Args:
        make_film: Fixture to create a film
        make_distributor: Fixture to create a distributor
        make_country: Fixture to create a country
    """
    distributor = make_distributor()
    country = make_country()
    country_us = make_country(name="United States")

    film = make_film("The Lion King", [distributor], [country, country_us])

    film_duplicate = make_film("The Lion King", [distributor], [country])
    film_alt = make_film("Clerks", [distributor], [country])

    assert film.name == "The Lion King"
    assert film.slug == "the-lion-king"
    assert film.distributors == [distributor]
    assert film.countries == [country, country_us]
    assert film_alt.countries == [country]

    assert film == film_duplicate
    assert film != film_alt
