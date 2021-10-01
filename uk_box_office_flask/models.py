from datetime import datetime

from uk_box_office_flask import db

from slugify import slugify

import pandas as pd


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


class Distributor(db.Model):
    __tablename__ = "distributor"
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


class Film(db.Model):
    __tablename__ = "film"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    weeks = db.relationship("Week", backref="title", lazy="dynamic")
    country_id = db.Column(db.Integer, db.ForeignKey("country.name"), nullable=False)
    distributor_id = db.Column(
        db.Integer, db.ForeignKey("distributor.name"), nullable=False
    )
    slug = db.Column(db.String(160), nullable=False, unique=True)

    def __init__(self, *args, **kwargs):
        if "slug" not in kwargs:
            kwargs["slug"] = slugify(kwargs.get("title", ""))
        super().__init__(*args, **kwargs)

    def __repr__(self) -> str:
        return self.title

    def __eq__(self, o: object) -> bool:
        return self.title == o

    def as_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "weeks": self.serialize_weeks(),
            "country": self.country_id,
            "distributor": self.distributor_id,
        }

    def serialize_weeks(self):
        return [item.as_dict() for item in self.weeks]


class Week(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    film_id = db.Column(db.Integer, db.ForeignKey("film.title"), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey("country.name"), nullable=False)
    distributor_id = db.Column(
        db.Integer, db.ForeignKey("distributor.name"), nullable=False
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
            "film_id": self.film_id,
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
