from datetime import datetime
from typing import Any, Dict, List

from ukbo.extensions import db

from .models import PkModel


class Week(PkModel):  # type: ignore

    __tablename__ = "week"
    date = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, unique=True
    )
    number_of_cinemas = db.Column(db.Integer, nullable=True, default=0)

    # The number of new releases that week - so weeks_on_release == 1
    number_of_releases = db.Column(db.Integer, nullable=True, default=0)
    weekend_gross = db.Column(db.Integer, nullable=True, default=0)
    week_gross = db.Column(db.Integer, nullable=True, default=0)
    forecast_high = db.Column(db.Integer, nullable=True, default=0)
    forecast_medium = db.Column(db.Integer, nullable=True, default=0)
    forecast_low = db.Column(db.Integer, nullable=True, default=0)

    def __repr__(self) -> str:
        return f"{self.date}"

    def as_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "date": datetime.strftime(self.date, "%Y-%m-%d"),
            "number_of_cinemas": self.number_of_cinemas,
            "weekend_gross": self.weekend_gross,
            "week_gross": self.week_gross,
        }

    def as_df(self) -> List[Any]:
        return [
            self.date,
            self.week_gross,
            self.weekend_gross,
            self.number_of_releases,
            self.number_of_cinemas,
        ]
