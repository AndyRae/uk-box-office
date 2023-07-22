from ukbo import models
from ukbo.extensions import ma

from .CountrySchema import CountrySchema
from .DistributorSchema import DistributorSchema


class FilmSchemaStrictWeek(ma.SQLAlchemyAutoSchema):
    """
    Film schema for serialisation with nested objects.
    Does not include weeks.
    """

    class Meta:
        model = models.Film

    distributors = ma.Nested(DistributorSchema, many=True)
    countries = ma.Nested(CountrySchema, many=True)


class FilmWeekSchema(ma.SQLAlchemyAutoSchema):
    """
    FilmWeek schema for serialisation.
    """

    class Meta:
        model = models.Film_Week

    date = ma.Function(lambda obj: obj.date.strftime("%Y-%m-%d"))
    film = ma.Nested(FilmSchemaStrictWeek)


class FilmWeekSchemaArchive(ma.SQLAlchemyAutoSchema):
    """
    FilmWeek Archive schema for serialisation.
    Strictly for the archive endpoint.
    """

    class Meta:
        model = models.Film_Week

    date = ma.Function(lambda obj: obj.date.strftime("%Y%m%d"))
    film = ma.Function(lambda obj: obj.film.name)
    distributor = ma.Function(
        lambda obj: [x.name for x in obj.film.distributors]
    )
    country = ma.Function(lambda obj: [x.name for x in obj.film.countries])
