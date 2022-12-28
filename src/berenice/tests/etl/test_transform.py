import datetime

import pandas as pd
from flask import current_app
from ukbo import db, etl, models


def test_find_recent_film(
    app, make_film_week, make_film, make_distributor, make_country
):
    """
    Test find_recent_film function
    """
    with app.app_context():

        #  Set up test data
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

        df = pd.Series(
            {
                "date": "20220127",
                "film": "Nope",
            }
        )

        response = etl.transform.find_recent_film(df)

        current_app.logger.warning(response)

    assert response is not None
    assert response.film.name == "Nope"
    assert response.total_gross == 1000
    assert response.week_gross == 1000
    assert response.weekend_gross == 500


# def test_get_week_box_office():
#     """
#     Test get_week_box_office function
#     """

#     df["week_gross"] = df.apply(etl.transform.get_week_box_office, axis=1)
#     assert df is not None
