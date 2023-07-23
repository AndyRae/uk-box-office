from datetime import datetime
from typing import Any, Dict

from ukbo.extensions import db

from .models import PkModel


class Film_Week(PkModel):  # type: ignore
    """

    This model stores a Film Week in the UKBO database.

    This is a week that a film has been released in the UK.
    And is the main model to store box office data.

    Attributes:
        film_id: ID of the film.
        film: Film object.
        date: Date of the film week.
        rank: Rank of the film in the film week.
        weeks_on_release: Number of weeks the film has been on release.
        number_of_cinemas: Number of cinemas the film was released in.
        weekend_gross: Weekend gross of the film.
        week_gross: Week gross of the film.

    """

    __tablename__ = "film_week"
    film_id = db.Column(db.Integer, db.ForeignKey("film.id"), nullable=False)
    film = db.relationship(
        "Film", back_populates="weeks", innerjoin=True, lazy="joined"
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
        """
        Serializes the model as a dictionary.
        This is used to create the archive.

        Returns:
            Dictionary representation of the model.
        """
        return {
            "id": self.id,
            "film": self.film.name,
            "country": self.film.serialize_countries(),
            "film_slug": self.film.slug,
            "distributor": self.film.distributor.name,
            "date": datetime.strftime(self.date, "%Y-%m-%d"),
            "rank": self.rank,
            "weeks_on_release": self.weeks_on_release,
            "number_of_cinemas": self.number_of_cinemas,
            "weekend_gross": self.weekend_gross,
            "week_gross": self.week_gross,
            "total_gross": self.total_gross,
            "site_average": self.site_average,
        }
