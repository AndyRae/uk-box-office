import enum
from datetime import datetime

from sqlalchemy import Enum
from ukbo.extensions import db

from .models import PkModel


class Area(enum.Enum):
    """
    This enum stores the state of an event.

    Attributes:
        Success: The event was successful.
        Warning: The event raised a warning.
        Error: The event raised an error and failed.

    """

    etl = "etl"
    forecast = "forecast"
    archive = "archive"


class State(enum.Enum):
    """
    This enum stores the state of an event.

    Attributes:
        Success: The event was successful.
        Warning: The event raised a warning.
        Error: The event raised an error and failed.

    """

    success = 1
    warning = 2
    error = 3


class Event(PkModel):  # type: ignore
    """

    This model stores an Event in the system.

    Attributes:
        date: Date of the event.
        area: Product area of the event.
        message: Message of the event.
        state: State of the event.

    """

    __tablename__ = "event"
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    area = db.Column(db.String(160), nullable=False)
    message = db.Column(db.Text(), nullable=True)
    state = db.Column(Enum(State), nullable=False)

    def __repr__(self) -> str:
        return self.id
