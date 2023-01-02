from ukbo import models
from ukbo.extensions import ma


class FilmWeekSchema(ma.SQLAlchemyAutoSchema):
    """
    FilmWeek schema for serialisation.
    """

    class Meta:
        model = models.Film_Week

    date = ma.Function(lambda obj: obj.date.strftime("%Y-%m-%d"))
    film_slug = ma.Function(lambda obj: obj.film.slug)
    film = ma.Function(lambda obj: obj.film.name)
    distributor = ma.Function(lambda obj: obj.distributor.name)
    distributor_slug = ma.Function(lambda obj: obj.distributor.slug)
