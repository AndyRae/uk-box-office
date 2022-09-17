from datetime import datetime
from typing import Any, Dict, List

from ukbo.extensions import db

from .models import PkModel


class Film_Week(PkModel):  # type: ignore
    """
    DB class for the weekly data of a film.
    """

    __tablename__ = "film_week"
    film_id = db.Column(db.Integer, db.ForeignKey("film.id"), nullable=False)
    film = db.relationship(
        "Film", back_populates="weeks", innerjoin=True, lazy="joined"
    )
    distributor_id = db.Column(
        db.Integer, db.ForeignKey("distributor.id"), nullable=False
    )
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    rank = db.Column(db.Integer, nullable=False)
    weeks_on_release = db.Column(db.Integer, nullable=False)
    number_of_cinemas = db.Column(db.Integer, nullable=False)
    weekend_gross = db.Column(db.Integer, nullable=False)
    week_gross = db.Column(db.Integer, nullable=False)
    total_gross = db.Column(db.Integer, nullable=False)
    site_average = db.Column(db.Float, nullable=False)

    def __repr__(self) -> str:
        return f"{self.week_gross}"

    def __eq__(self, o: object) -> bool:
        return self.total_gross > o

    def as_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "film": self.film.name,
            "film_slug": self.film.slug,
            "distributor": self.film.distributor.name,
            "date": datetime.strftime(self.date, "%Y-%m-%d"),
            "rank": self.rank,
            "weeks_on_release": self.weeks_on_release,
            "number_of_cinemas": self.number_of_cinemas,
            "weekend_gross": self.weekend_gross,
            "week_gross": self.week_gross,
            "total_gross": self.total_gross,
        }

    def as_df(self) -> List[Any]:
        return [
            self.date,
            self.week_gross,
            self.weekend_gross,
            self.number_of_cinemas,
            self.id,
            self.total_gross,
            self.weeks_on_release,
            self.rank,
            self.site_average,
        ]

    def as_df_film(self) -> List[Any]:
        return [self.date, self.week_gross]

    def as_df2(self) -> List[Any]:
        return [
            self.film.name,
            self.film.slug,
            self.weekend_gross,
            self.week_gross,
            self.number_of_cinemas,
            self.weeks_on_release,
            self.site_average,
        ]
