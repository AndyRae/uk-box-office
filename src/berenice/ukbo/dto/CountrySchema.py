from ukbo import models
from ukbo.extensions import ma


class CountrySchema(ma.SQLAlchemyAutoSchema):
    """
    Country schema to dump - currently unused.
    """

    class Meta:
        model = models.Country
        include_fk = True
