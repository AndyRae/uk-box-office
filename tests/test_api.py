
def test_data():
    country = models.Country(name="UK")
    distributor = models.Distributor(name="SONY")

    db.session.add(country)
    db.session.add(distributor)
    db.session.commit()

    film1 = models.Film(
        name="CANDYMAN",
        country=country,
        distributor=distributor,
    )

    db.session.add(film1)
    db.session.commit()

    test_date = datetime.strptime("29 Aug 2021", "%d %b %Y")
    test_date2 = datetime.strptime("05 Sep 2021", "%d %b %Y")
    test_date4 = datetime.strptime("29 Sep 2020", "%d %b %Y")

    test_week = {
        "date": test_date,
        "film": film1,
        "distributor": distributor,
        "country": country,
        "number_of_cinemas": 653,
        "rank": 1,
        "total_gross": 1112674,
        "week_gross": 5759504,
        "weekend_gross": 5759504,
        "weeks_on_release": 1,
    }
    test_week2 = {
        "date": test_date2,
        "film": film1,
        "distributor": distributor,
        "country": country,
        "number_of_cinemas": 653,
        "rank": 1,
        "total_gross": 2912029,
        "week_gross": 5759504,
        "weekend_gross": 5759504,
        "weeks_on_release": 2,
    }
    test_week4 = {
        "date": test_date4,
        "film": film1,
        "distributor": distributor,
        "country": country,
        "number_of_cinemas": 653,
        "rank": 1,
        "total_gross": 2912030,
        "week_gross": 5759504,
        "weekend_gross": 5759504,
        "weeks_on_release": 4,
    }
    week1 = models.Week(**test_week)
    week2 = models.Week(**test_week2)
    week4 = models.Week(**test_week4)

    db.session.add(week1)
    db.session.add(week2)
    db.session.add(week4)
    db.session.commit()
