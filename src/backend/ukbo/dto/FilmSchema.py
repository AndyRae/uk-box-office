from marshmallow import fields
from ukbo import models
from ukbo.extensions import ma

from .CountrySchema import CountrySchema
from .DistributorSchema import DistributorSchema
from .FilmWeekSchema import FilmWeekSchema


class FilmSchema(ma.SQLAlchemyAutoSchema):
    """
    Film schema for serialisation with nested objects.
    Includes distributor, countries, weeks and gross.
    """

    class Meta:
        model = models.Film

    distributors = ma.Nested(DistributorSchema, many=True)
    countries = ma.Nested(CountrySchema, many=True)
    weeks = ma.Nested(FilmWeekSchema, many=True)
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
