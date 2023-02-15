from ukbo import models
from ukbo.extensions import ma


class EventSchema(ma.SQLAlchemyAutoSchema):
    """
    Event schema for serialisation.
    """

    class Meta:
        model = models.Event

    state = ma.Enum(models.State)
