from ukbo import models


def test_film_week(app):
    film = models.Film(
        title="Test film",
        date="2020-01-01",
        distributor="Test distributor",
        box_office=1000000,
        admissions=1000000,
    )
    app.db.session.add(film)
    app.db.session.commit()

    week = models.FilmWeek(
        film_id=film.id,
        week_start="2020-01-01",
        box_office=1000000,
        admissions=1000000,
    )
    app.db.session.add(week)
    app.db.session.commit()

    assert week.film_id == film.id
    assert week.film.title == "Test film"
