from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple, Type, TypeVar
from xmlrpc.client import Boolean

from slugify import slugify  # type: ignore
from sqlalchemy import func, select
from sqlalchemy.ext.hybrid import hybrid_property
from ukbo.extensions import db

from .search import add_to_index, query_index, remove_from_index

T = TypeVar("T", bound="PkModel")


class CRUDMixin(object):
    """Mixin that adds convenience methods for CRUD operations."""

    @classmethod
    def create(cls, commit: bool = True, **kwargs: Any) -> Any:
        """Create a new record and save it the database."""
        instance = cls(**kwargs)
        if commit:
            return instance.save()
        return instance.save(commit=False)

    def update(self, commit: bool = True, **kwargs: Any) -> Any:
        """Update specific fields of a record."""
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        if commit:
            return self.save()
        return self

    def save(self, commit: bool = True) -> Any:
        """Save the record."""
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def delete(self, commit: bool = True) -> None:
        """Remove the record from the database."""
        db.session.delete(self)
        if commit:
            return db.session.commit()
        return


class Model(CRUDMixin, db.Model):
    """Base model class that includes CRUD convenience methods."""

    __abstract__ = True


class PkModel(Model):
    """Base model class that includes CRUD convenience methods, plus adds a 'primary key' column named ``id``."""

    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)

    @classmethod
    def get_by_id(cls: Type[T], record_id: Any) -> Optional[T]:
        """Get record by ID."""
        if any(
            (
                isinstance(record_id) and record_id.isdigit(),  # type: ignore
                isinstance(record_id, (int, float)),
            )
        ):
            return cls.query.get(int(record_id))
        return None


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


class Country(PkModel):  # type: ignore

    __tablename__ = "country"
    name = db.Column(db.String(160), unique=True, nullable=False)
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


class Distributor(SearchableMixin, PkModel):  # type: ignore

    __tablename__ = "distributor"
    __searchable__ = ["name"]
    name = db.Column(db.String(160), unique=True, nullable=False)
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


class Week(PkModel):  # type: ignore

    __tablename__ = "week"
    date = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, unique=True
    )
    number_of_cinemas = db.Column(db.Integer, nullable=True, default=0)
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


class Film_Week(PkModel):  # type: ignore

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