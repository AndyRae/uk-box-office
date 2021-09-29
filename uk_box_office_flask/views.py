from flask import Blueprint, render_template

from uk_box_office_flask import db, models

from werkzeug.exceptions import abort

bp = Blueprint("index", __name__, template_folder='templates')


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


@bp.route("/films/<slug>/")
def film(slug):
    query = db.session.query(models.Film)
    query = query.filter(models.Film.slug == slug)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("film_detail.html", data=data)


@bp.route("/distributors/<slug>/")
def distributor(slug):
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("distributor_detail.html", data=data)


@bp.route("/countries/<slug>/")
def country(slug):
    query = db.session.query(models.Country)
    query = query.filter(models.Country.slug == slug)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("country_detail.html", data=data)

@bp.app_template_filter()
def date_convert(datetime):
    return datetime.strftime("%d / %m / %Y")