from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from datetime import datetime

from uk_box_office_flask import db


class Country(db.Model):
    __tablename__ = "country"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    films = db.relationship("Film", backref="country", lazy=True)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Distributor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    films = db.relationship("Film", backref="distributor", lazy=True)

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, o: object) -> bool:
        return self.name == o


class Film(db.Model):
    __tablename__ = "film"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    weeks = db.relationship("Week", backref="title", lazy="dynamic")
    country_id = db.Column(db.Integer, db.ForeignKey("country.id"), nullable=False)
    distributor_id = db.Column(
        db.Integer, db.ForeignKey("distributor.id"), nullable=False
    )

    def __repr__(self) -> str:
        return self.title

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Week(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    film_id = db.Column(db.Integer, db.ForeignKey("film.title"), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    rank = db.Column(db.Integer, nullable=False)
    weeks_on_release = db.Column(db.Integer, nullable=False)
    number_of_cinemas = db.Column(db.Integer, nullable=False)
    weekend_gross = db.Column(db.Integer, nullable=False)
    week_gross = db.Column(db.Integer, nullable=False)
    total_gross = db.Column(db.Integer, nullable=False)

    def __repr__(self) -> str:
        return f"{self.total_gross}"

    def __eq__(self, o: object) -> bool:
        return self.total_gross > o

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
