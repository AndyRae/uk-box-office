from ukbo import models
from ukbo.extensions import ma


class DistributorSchema(ma.SQLAlchemyAutoSchema):
    """
    Distributor schema to dump - currently unused.
    """

    class Meta:
        model = models.Distributor
        include_fk = True
