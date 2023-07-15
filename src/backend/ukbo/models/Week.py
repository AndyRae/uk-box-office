from datetime import datetime
from typing import Any, Dict, List

from ukbo.extensions import db

from .models import PkModel


class Week(PkModel):  # type: ignore
    """

    This model stores a week in the UKBO dataset.
    No details are stored about the films that were released in that week.

    For film details, see the ``Film_Week`` model.

    Attributes:
        date: Date of the week.
        number_of_cinemas: Number of cinemas that week.
        number_of_releases: Number of new releases that week.
        weekend_gross: Weekend gross that week.
        week_gross: Week gross that week.
        forecast_high: Forecast high for the week.
        forecast_medium: Forecast medium for the week.
        forecast_low: Forecast low for the week.

    """

    __tablename__ = "week"
    date = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, unique=True
    )
    number_of_cinemas = db.Column(db.Integer, nullable=True, default=0)

    # The number of new releases that week - so weeks_on_release == 1
    number_of_releases = db.Column(db.Integer, nullable=True, default=0)
    weekend_gross = db.Column(db.Integer, nullable=True, default=0)
    week_gross = db.Column(db.Integer, nullable=True, default=0)
    admissions = db.Column(db.Integer, nullable=True, default=0)
    forecast_high = db.Column(db.Integer, nullable=True, default=0)
    forecast_medium = db.Column(db.Integer, nullable=True, default=0)
    forecast_low = db.Column(db.Integer, nullable=True, default=0)

    def __repr__(self) -> str:
        return f"{self.date}"

    def as_df(self) -> List[Any]:
        """
        Serialise the week as a list.

        This is used to create the Pandas dataframe.
        This is currently only used in the ``Forecast`` model.
        TODO: Remove this method and use ``Marshmallow`` instead.

        Returns:
            A list representation of the week.
        """
        return [
            self.date,
            self.week_gross,
            self.weekend_gross,
            self.number_of_releases,
            self.number_of_cinemas,
        ]
