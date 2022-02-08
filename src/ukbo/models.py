from datetime import datetime
from typing import Any, Dict, List, Tuple

from slugify import slugify  # type: ignore
from sqlalchemy import func, select
from sqlalchemy.ext.hybrid import hybrid_property

from ukbo import db

from .search import add_to_index, query_index, remove_from_index


class SearchableMixin(object):
    __tablename__: str
    query: Any
    id: Any

    @classmethod
    def search(
        cls, expression: str, page: int, per_page: int
    ) -> Tuple[Any, int]:
        ids, total = query_index(cls.__tablename__, expression, page, per_page)
        if total == 0:
            return cls.query.filter_by(id=0), 0
        when = [(ids[i], i) for i in range(len(ids))]
        return (
            cls.query.filter(cls.id.in_(ids)).order_by(
                db.case(when, value=cls.id)
            ),
            total,
        )

    @classmethod
    def before_commit(cls, session: Any) -> None:
        session._changes = {
            "add": list(session.new),
            "update": list(session.dirty),
            "delete": list(session.deleted),
        }

    @classmethod
    def after_commit(cls, session: Any) -> None:
        for obj in session._changes["add"]:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        for obj in session._changes["update"]:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        for obj in session._changes["delete"]:
            if isinstance(obj, SearchableMixin):
                remove_from_index(obj.__tablename__, obj)
        session._changes = None

    @classmethod
    def reindex(cls) -> None:
        for obj in cls.query:
            add_to_index(cls.__tablename__, obj)


db.event.listen(db.session, "before_commit", SearchableMixin.before_commit)
db.event.listen(db.session, "after_commit", SearchableMixin.after_commit)


countries = db.Table(
    "countries",
    db.Column(
        "country_id", db.Integer, db.ForeignKey("country.id"), primary_key=True
    ),
    db.Column(
        "film_id", db.Integer, db.ForeignKey("film.id"), primary_key=True
    ),
)


class Country(db.Model):  # type: ignore
    __tablename__ = "country"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    slug = db.Column(db.String(160), nullable=False, unique=True)

    def __init__(self, *args: str, **kwargs: str) -> None:
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o

    def as_dict(self) -> Dict[str, Any]:
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Distributor(db.Model):  # type: ignore
    __tablename__ = "distributor"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    films = db.relationship("Film", back_populates="distributor")
    weeks = db.relationship("Film_Week", backref="distributor", lazy="dynamic")
    slug = db.Column(db.String(160), nullable=False, unique=True)

    def __init__(self, *args: str, **kwargs: str) -> None:
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o

    def as_dict(self) -> Dict[str, Any]:
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Film(SearchableMixin, db.Model):  # type: ignore
    __tablename__ = "film"
    __searchable__ = ["name"]
    id = db.Column(db.Integer, primary_key=True)
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
    slug = db.Column(db.String(160), nullable=False, unique=True)

    def __init__(self, *args: str, **kwargs: str) -> None:
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o

    def as_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "weeks": self.serialize_weeks(),
            "country": self.country_id,
            "distributor": self.distributor.name,
        }

    def serialize_weeks(self) -> List[Any]:
        return [item.as_dict() for item in self.weeks]

    @hybrid_property
    def multiple(self) -> float:
        for i in self.weeks:
            if i.weeks_on_release == 1:
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


class Week(db.Model):  # type: ignore
    __tablename__ = "week"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, unique=True
    )
    number_of_cinemas = db.Column(db.Integer, nullable=False)
    number_of_releases = db.Column(db.Integer, nullable=False)
    weekend_gross = db.Column(db.Integer, nullable=False)
    week_gross = db.Column(db.Integer, nullable=False)
    forecast_high = db.Column(db.Integer, nullable=True)
    forecast_medium = db.Column(db.Integer, nullable=True)
    forecast_low = db.Column(db.Integer, nullable=True)

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
        return [self.date, self.week_gross, self.number_of_releases]


class Film_Week(db.Model):  # type: ignore
    __tablename__ = "film_week"
    id = db.Column(db.Integer, primary_key=True)
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
        ]

    def as_df_film(self) -> List[Any]:
        return [self.date, self.week_gross]

    def as_df2(self) -> List[Any]:
        return [self.film.name, self.film.slug, self.week_gross]
