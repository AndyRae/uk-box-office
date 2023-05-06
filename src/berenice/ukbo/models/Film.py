from typing import Any, Dict, List

from slugify import slugify  # type: ignore
from sqlalchemy import func, select
from sqlalchemy.ext.hybrid import hybrid_property
from ukbo.extensions import db

from . import Film_Week
from .models import PkModel

countries = db.Table(
    "countries",
    db.Column(
        "country_id", db.Integer, db.ForeignKey("country.id"), primary_key=True
    ),
    db.Column(
        "film_id", db.Integer, db.ForeignKey("film.id"), primary_key=True
    ),
)


class Film(PkModel):  # type: ignore
    """

    This model stores a Film in the UKBO dataset.

    Attributes:
        name: Name of the film.
        slug: Slug of the film.
        weeks: List of Film weeks that the film has been released in.
        countries: List of countries that the film has been released in.
        country_id: ID of the country that the film was released in.
        distributor_id: ID of the distributor that released the film.
        distributor: Distributor that released the film.

    """

    __tablename__ = "film"
    name = db.Column(db.String(160), nullable=False)
    weeks = db.relationship(
        "Film_Week",
        back_populates="film",
        order_by="Film_Week.total_gross",
    )
    countries = db.relationship(
        "Country",
        secondary=countries,
        lazy="joined",
        backref=db.backref("films", lazy="joined"),
    )
    # country_id = db.Column(db.Integer, db.ForeignKey("country.id"))
    distributor_id = db.Column(
        db.Integer, db.ForeignKey("distributor.id"), nullable=True
    )
    slug = db.Column(db.String(300), nullable=False, unique=True)

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o

    @hybrid_property
    def multiple(self) -> float:
        for i in self.weeks:
            if i.weeks_on_release == 1 & i.weekend_gross > 0:
                return (
                    max(week.total_gross for week in self.weeks)
                    / i.weekend_gross
                )
        return 0

    @hybrid_property
    def gross(self) -> int:
        return max((week.total_gross for week in self.weeks), default=0)

    @gross.expression  # type: ignore
    def gross(cls) -> Any:
        return (
            select([func.max(Film_Week.total_gross)])
            .where(Film_Week.film_id == cls.id)
            .as_scalar()
        )
