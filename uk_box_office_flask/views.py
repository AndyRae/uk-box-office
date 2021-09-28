from flask import Blueprint, render_template

from uk_box_office_flask import db, models

from werkzeug.exceptions import abort

bp = Blueprint("index", __name__)


@bp.route("/")
def index():
    return render_template("index.html")


@bp.route("/films")
def films():
    query = db.session.query(models.Film)
    data = query.order_by(models.Film.title.asc()).all()
    if data is None:
        abort(404)
    return render_template("films.html", data=data)


@bp.route("/distributors")
def distributors():
    query = db.session.query(models.Distributor)
    data = query.order_by(models.Distributor.name.asc()).all()
    if data is None:
        abort(404)
    return render_template("distributors.html", data=data)


@bp.route("/countries")
def countries():
    query = db.session.query(models.Country)
    data = query.order_by(models.Country.name.asc()).all()
    if data is None:
        abort(404)
    return render_template("countries.html", data=data)


@bp.route("/films/<int:id>/")
def film(id):
    query = db.session.query(models.Film)
    query = query.filter(models.Film.id == id)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("film_detail.html", data=data)


@bp.route("/distributors/<int:id>/")
def distributor(id):
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.id == id)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("distributor_detail.html", data=data)


@bp.route("/countries/<int:id>/")
def country(id):
    query = db.session.query(models.Country)
    query = query.filter(models.Country.id == id)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("country_detail.html", data=data)
