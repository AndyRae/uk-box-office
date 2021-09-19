from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"
db = SQLAlchemy(app)


class Film(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), unique=True, nullable=False)
    weeks = db.Relationship("Week", backref="film", lazy=True)
    country = db.Column(db.String(80), db.ForeignKey("Country.name"), nullable=False)
    distributor = db.Column(db.String(80), db.ForeignKey("Distributor.name"), nullable=False)

    def __repr__(self) -> str:
        return self.title


class Week(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), db.ForeignKey("Film.title"), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    rank = db.Column(db.Integer, nullable=False)
    weekend_gross = db.Column(db.Integer, nullable=False)
    week_on_release = db.Column(db.Integer, nullable=False)
    number_of_cinemas = db.Column(db.Integer, nullable=False)
    week_gross = db.Column(db.Integer, nullable=False)
    total_gross = db.Column(db.Integer, nullable=False)

    def __repr__(self) -> str:
        return f"{self.date}, {self.title}"


class Country(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    films = db.Relationship("Film", backref="country", lazy=True)

    def __repr__(self) -> str:
        return self.name


class Distributor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    films = db.Relationship("Film", backref="distributor", lazy=True)

    def __repr__(self) -> str:
        return self.name
