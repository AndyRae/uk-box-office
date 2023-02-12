import enum
from datetime import datetime

from sqlalchemy import Enum
from ukbo.extensions import db

from .models import PkModel


class State(enum.Enum):
    """
    This enum stores the state of an event.

    Attributes:
        Success: The event was successful.
        Warning: The event was a warning.
        Failure: The event was a failure.

    """

    Success = 1
    Warning = 2
    Failure = 3


class Area(enum.Enum):
    """
    This enum stores the area of an event.

    Attributes:
        ETL: The event was related to the ETL process.
        Forecast: The event was related to the Forecast process.
        Archive: The event was related to the Archive process.

    """

    ETL = 1
    Forecast = 2
    Archive = 3


class Event(PkModel):  # type: ignore
    """

    This model stores an Event in the system.

    Attributes:
        date: Date of the event.
        area: Area of the event.
        message: Message of the event.
        state: State of the event.

    """

    __tablename__ = "event"
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    area = db.Column(Enum(Area), nullable=False)
    message = db.Column(db.Text(), nullable=True)
    state = db.Column(Enum(State), nullable=False)

    def __repr__(self) -> str:
        return self.id
