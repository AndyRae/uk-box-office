import datetime
from operator import mod
from flask import Blueprint, render_template, request, url_for, make_response, jsonify

from uk_box_office_flask import db, models

from werkzeug.exceptions import abort

import pandas as pd

bp = Blueprint("index", __name__, template_folder="templates")


@bp.route("/")
def index():
    return render_template("index.html")


@bp.errorhandler(404)
def page_not_found(e):
    return render_template("404.html")


@bp.route("/films")
def films():
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Film)
    data = query.order_by(models.Film.title.asc()).paginate(page, 20, False)
    if data is None:
        abort(404)
    next_url = url_for("index.films", page=data.next_num) if data.has_next else None
    prev_url = url_for("index.films", page=data.prev_num) if data.has_prev else None
    return render_template(
        "films.html", data=data.items, next_url=next_url, prev_url=prev_url
    )


@bp.route("/distributors")
def distributors():
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Distributor)
    data = query.order_by(models.Distributor.name.asc()).paginate(page, 20, False)
    if data is None:
        abort(404)
    next_url = (
        url_for("index.distributors", page=data.next_num) if data.has_next else None
    )
    prev_url = (
        url_for("index.distributors", page=data.prev_num) if data.has_prev else None
    )
    return render_template(
        "distributors.html", data=data.items, next_url=next_url, prev_url=prev_url
    )


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

    # Builds the missing dates if needed
    df = pd.DataFrame([i.as_df() for i in data.weeks], columns=["date", "week_gross"])
    df.set_index(pd.DatetimeIndex(df["date"].values), inplace=True)
    df.drop(["date"], axis=1, inplace=True)
    df = df.asfreq("W", fill_value=0)

    return render_template(
        "film_detail.html", data=data, w=df.reset_index().to_dict(orient="records")
    )


@bp.route("/distributors/<slug>/")
def distributor(slug):
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("distributor_detail.html", data=data)


@bp.route("/countries/<slug>/")
def country(slug: str):
    query = db.session.query(models.Country)
    query = query.filter(models.Country.slug == slug)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("country_detail.html", data=data)


def data_grouped_by_date(data):
    df = pd.DataFrame([i.as_df() for i in data], columns=["date", "week_gross"])
    df = df.groupby(["date"]).sum().sort_values(by=["date"])
    return df.reset_index().to_dict(orient="records")


def data_grouped_by_film(data):
    """
    Calculates the total gross for this collection of weeks
    """
    df = pd.DataFrame(
        [i.as_df2() for i in data], columns=["title", "slug", "week_gross"]
    )
    df = (
        df.groupby(["title", "slug"])
        .sum()
        .sort_values(by=["week_gross"], ascending=False)
    )
    return df.reset_index().to_dict(orient="records")


@bp.route("/time/")
def time():
    years = range(2021, 2006, -1)
    months = range(1, 13)

    return render_template("time.html", years=years, months=months)


@bp.route("/time/<int:year>/")
def year(year: int):
    query = db.session.query(models.Week)
    start_date = datetime.date(int(year), 1, 1)
    end_date = datetime.date(int(year), 12, 31)

    query = query.filter(models.Week.date >= start_date)
    query = query.filter(models.Week.date <= end_date)
    data = query.all()

    if len(data) == 0:
        abort(404)

    df = data_grouped_by_film(data)
    df_2 = data_grouped_by_date(data)
    months = range(1, 13)

    return render_template(
        "time_detail.html", data=df, w=df_2, time=year, months=months, year=year
    )


@bp.route("/time/<int:year>/<int:month>/")
def month(year: str, month: str):
    query = db.session.query(models.Week)
    start_date = datetime.date(int(year), int(month), 1)
    end_date = datetime.date(int(year), int(month), 31)

    query = query.filter(models.Week.date >= start_date)
    query = query.filter(models.Week.date <= end_date)
    data = query.all()

    time = end_date.strftime("%B %Y")
    months = range(1, 13)

    if len(data) == 0:
        abort(404)

    df = data_grouped_by_film(data)
    df_2 = data_grouped_by_date(data)

    return render_template(
        "time_detail.html", data=df, w=df_2, time=time, months=months, year=year
    )


@bp.app_template_filter()
def date_convert(datetime):
    return datetime.strftime("%d / %m / %Y")


@bp.app_template_filter()
def date_convert_to_month(m: int):
    date = datetime.date(2020, m, 1)
    return date.strftime("%B")
