from marshmallow import fields
from ukbo import models
from ukbo.extensions import ma

from .CountrySchema import CountrySchema
from .DistributorSchema import DistributorSchema


class FilmWeekSchemaStrict(ma.SQLAlchemyAutoSchema):
    """
    FilmWeek schema for serialisation, not including Film object.
    """

    class Meta:
        model = models.Film_Week

    date = ma.Function(lambda obj: obj.date.strftime("%Y-%m-%d"))


class FilmSchema(ma.SQLAlchemyAutoSchema):
    """
    Film schema for serialisation with nested objects.
    Includes distributor, countries, weeks and gross.
    """

    class Meta:
        model = models.Film

    distributors = ma.Nested(DistributorSchema, many=True)
    countries = ma.Nested(CountrySchema, many=True)
    weeks = ma.Nested(FilmWeekSchemaStrict, many=True)
    gross = ma.Function(lambda obj: obj.gross)


class FilmSchemaStrict(ma.SQLAlchemyAutoSchema):
    """
    Film schema for serialisation with nested objects.
    Does not include weeks.
    """

    class Meta:
        model = models.Film

    distributors = ma.Nested(DistributorSchema, many=True)
    countries = ma.Nested(CountrySchema, many=True)
    gross = ma.Function(lambda obj: obj.gross)


class FilmSchemaValues(ma.SQLAlchemyAutoSchema):
    """
    Strict film schema for search options.
    """

    class Meta:
        model = models.Film
        exclude = ["name", "id", "slug"]

    label = fields.String(attribute="name")
    value = fields.String(attribute="id")


class FilmWeekSchema(ma.SQLAlchemyAutoSchema):
    """
    FilmWeek schema for serialisation.
    """

    class Meta:
        model = models.Film_Week

    date = ma.Function(lambda obj: obj.date.strftime("%Y-%m-%d"))
    film_slug = ma.Function(lambda obj: obj.film.slug)
    film = ma.Function(lambda obj: obj.film.name)
    distributor = ma.Function(
        lambda obj: ", ".join(
            distributor.name for distributor in obj.film.distributors
        )
        if obj.film.distributors
        else ""
    )


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
