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


class FilmWeekSchemaArchive(ma.SQLAlchemyAutoSchema):
    """
    FilmWeek Archive schema for serialisation.
    Strictly for the archive endpoint.
    """

    class Meta:
        model = models.Film_Week

    date = ma.Function(lambda obj: obj.date.strftime("%Y%m%d"))
    film = ma.Function(lambda obj: obj.film.name)
    country = ma.Function(lambda obj: [x.name for x in obj.film.countries])
