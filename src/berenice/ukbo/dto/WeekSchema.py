from ukbo import models
from ukbo.extensions import ma


class WeekSchema(ma.SQLAlchemyAutoSchema):
    """
    Week schema to dump - currently unused.
    """

    class Meta:
        model = models.Week

    date = ma.Function(lambda obj: obj.date.strftime("%Y-%m-%d"))
