from ukbo import models
from ukbo.extensions import ma


class CountrySchema(ma.SQLAlchemyAutoSchema):
    """
    Country schema for serialisation.
    """

    class Meta:
        model = models.Country
        include_fk = True
