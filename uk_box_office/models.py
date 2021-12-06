from datetime import datetime

from uk_box_office import db
from uk_box_office.search import add_to_index, remove_from_index, query_index
from slugify import slugify


class SearchableMixin(object):
    @classmethod
    def search(cls, expression, page, per_page):
        ids, total = query_index(cls.__tablename__, expression, page, per_page)
        if total == 0:
            return cls.query.filter_by(id=0), 0
        when = [(ids[i], i) for i in range(len(ids))]
        return (
            cls.query.filter(cls.id.in_(ids)).order_by(db.case(when, value=cls.id)),
            total,
        )

    @classmethod
    def before_commit(cls, session):
        session._changes = {
            "add": list(session.new),
            "update": list(session.dirty),
            "delete": list(session.deleted),
        }

    @classmethod
    def after_commit(cls, session):
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
    def reindex(cls):
        for obj in cls.query:
            add_to_index(cls.__tablename__, obj)


db.event.listen(db.session, "before_commit", SearchableMixin.before_commit)
db.event.listen(db.session, "after_commit", SearchableMixin.after_commit)


class Country(db.Model):
    __tablename__ = "country"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    films = db.relationship("Film", backref="country", lazy=True)
    weeks = db.relationship("Week", backref="country", lazy="dynamic")
    slug = db.Column(db.String(160), nullable=False, unique=True)

    def __init__(self, *args, **kwargs):
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Distributor(SearchableMixin, db.Model):
    __tablename__ = "distributor"
    __searchable__ = ["name"]
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    films = db.relationship("Film", backref="distributor", lazy=True)
    weeks = db.relationship("Week", backref="distributor", lazy="dynamic")
    slug = db.Column(db.String(160), nullable=False, unique=True)

    def __init__(self, *args, **kwargs):
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Film(SearchableMixin, db.Model):
    __tablename__ = "film"
    __searchable__ = ["name"]
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    weeks = db.relationship("Week", back_populates="film")
    country_id = db.Column(db.Integer, db.ForeignKey("country.id"), nullable=False)
    distributor_id = db.Column(
        db.Integer, db.ForeignKey("distributor.id"), nullable=False
    )
    slug = db.Column(db.String(160), nullable=False, unique=True)

    def __init__(self, *args, **kwargs):
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("name", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "weeks": self.serialize_weeks(),
            "country": self.country_id,
            "distributor": self.distributor_id,
        }

    def serialize_weeks(self):
        return [item.as_dict() for item in self.weeks]


class Week(db.Model):
    __tablename__ = "week"
    id = db.Column(db.Integer, primary_key=True)
    film_id = db.Column(db.Integer, db.ForeignKey("film.id"), nullable=False)
    film = db.relationship(
        "Film", back_populates="weeks", innerjoin=True, lazy="joined"
    )
    country_id = db.Column(db.Integer, db.ForeignKey("country.id"), nullable=False)
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

    def as_dict(self):
        return {
            "id": self.id,
            "film": self.film.name,
            "film_slug": self.film.slug,
            "country_id": self.country_id,
            "distributor_id": self.distributor_id,
            "date": datetime.strftime(self.date, "%Y-%m-%d"),
            "rank": self.rank,
            "weeks_on_release": self.weeks_on_release,
            "number_of_cinemas": self.number_of_cinemas,
            "weekend_gross": self.weekend_gross,
            "week_gross": self.week_gross,
            "total_gross": self.total_gross,
        }

    def as_df(self):
        return [self.date, self.week_gross]

    def as_df2(self):
        return [self.film.name, self.film.slug, self.week_gross]
