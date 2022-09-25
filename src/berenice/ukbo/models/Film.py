from typing import Any, Dict, List

from slugify import slugify  # type: ignore
from sqlalchemy import func, select
from sqlalchemy.ext.hybrid import hybrid_property
from ukbo.extensions import db

from . import Film_Week
from .models import PkModel, SearchableMixin

countries = db.Table(
    "countries",
    db.Column(
        "country_id", db.Integer, db.ForeignKey("country.id"), primary_key=True
    ),
    db.Column(
        "film_id", db.Integer, db.ForeignKey("film.id"), primary_key=True
    ),
)


class Film(SearchableMixin, PkModel):  # type: ignore

    __tablename__ = "film"
    __searchable__ = ["name"]
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
    country_id = db.Column(db.Integer, db.ForeignKey("country.id"))
    distributor_id = db.Column(
        db.Integer, db.ForeignKey("distributor.id"), nullable=False
    )
    distributor = db.relationship(
        "Distributor", back_populates="films", innerjoin=True, lazy="joined"
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

    def as_dict(self, weeks=True) -> Dict[str, Any]:
        obj = {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "country": self.serialize_countries(),
            "distributor": {
                "name": self.distributor.name,
                "slug": self.distributor.slug,
            },
            "gross": self.gross,
        }
        if weeks:
            obj["weeks"] = self.serialize_weeks()
        return obj

    def serialize_weeks(self) -> List[Any]:
        return [item.as_dict() for item in self.weeks]

    def serialize_countries(self) -> List[Any]:
        return [item.as_dict() for item in self.countries]

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
        return max(week.total_gross for week in self.weeks)

    @gross.expression  # type: ignore
    def gross(cls) -> Any:
        return (
            select([func.max(Film_Week.total_gross)])
            .where(Film_Week.film_id == cls.id)
            .as_scalar()
        )
