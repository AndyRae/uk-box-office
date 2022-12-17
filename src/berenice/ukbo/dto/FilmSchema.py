from ukbo import models
from ukbo.extensions import ma

from .CountrySchema import CountrySchema
from .DistributorSchema import DistributorSchema
from .FilmWeekSchema import FilmWeekSchema


class FilmSchema(ma.SQLAlchemyAutoSchema):
    """
    TODO: Implement these schemas.
    Schema to dump - currently unused.

    """

    class Meta:
        model = models.Film

    distributor = ma.Nested(DistributorSchema)
    countries = ma.Nested(CountrySchema, many=True)
    weeks = ma.Nested(FilmWeekSchema, many=True)
    gross = ma.Function(lambda obj: obj.gross)


class FilmSchemaStrict(ma.SQLAlchemyAutoSchema):
    """ """

    class Meta:
        model = models.Film

    distributor = ma.Nested(DistributorSchema)
    countries = ma.Nested(CountrySchema, many=True)
    gross = ma.Function(lambda obj: obj.gross)
