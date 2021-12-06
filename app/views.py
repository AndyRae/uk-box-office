"""Front end pages"""

import calendar
import datetime

import pandas as pd

from flask import Blueprint, render_template, request, url_for, make_response, g
from . import db, models, forms
from werkzeug.exceptions import abort


bp = Blueprint("index", __name__, template_folder="templates")


@bp.route("/")
def index():
    return render_template("index.html")


@bp.before_app_request
def before_request():
    db.session.commit()
    g.search_form = forms.SearchForm()


@bp.errorhandler(404)
def page_not_found(e):
    return render_template("404.html")


@bp.route("/search")
def search():
    page = request.args.get("page", 1, type=int)
    results, total = models.Film.search(g.search_form.q.data, page, 20)
    next_url = (
        url_for("index.search", q=g.search_form.q.data, page=page + 1)
        if total > page * 20
        else None
    )
    prev_url = (
        url_for("index.search", q=g.search_form.q.data, page=page - 1)
        if page > 1
        else None
    )
    return render_template(
        "search.html",
        title=("Search"),
        results=results,
        next_url=next_url,
        prev_url=prev_url,
    )


@bp.route("/films")
def films():
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Film)
    data = query.order_by(models.Film.name.asc()).paginate(page, 20, False)
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
        "film_detail.html",
        data=data,
        chart_data=df.reset_index().to_dict(orient="records"),
    )


@bp.route("/film-csv/<slug>")
def film_csv(slug):
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

    resp = make_response(df.to_csv())
    resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
    resp.headers["Content-Type"] = "text/csv"
    return resp


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
    """
    Calculates the gross by date
    """
    df = pd.DataFrame([i.as_df() for i in data], columns=["date", "week_gross"])
    df = df.groupby(["date"]).sum().sort_values(by=["date"])
    return df.reset_index().to_dict(orient="records")


def data_grouped_by_film(data):
    """
    Calculates the total gross per film for this collection of weeks
    """
    df = pd.DataFrame(
        [i.as_df2() for i in data], columns=["title", "slug", "week_gross"]
    )
    df = (
        df.groupby(["title", "slug"])
        .sum()
        .sort_values(by=["week_gross"], ascending=False)
    ).head(50)
    return df.reset_index().to_dict(orient="records")


@bp.route("/time/")
def time():
    years = range(2021, 2006, -1)
    months = range(1, 13)

    return render_template("time.html", years=years, months=months)


def get_time_data(year: int, start_month: int = 1, end_month: int = 12):
    """ """
    last_day = calendar.monthrange(int(year), int(end_month))[1]

    query = db.session.query(models.Week)
    start_date = datetime.date(int(year), start_month, 1)
    end_date = datetime.date(int(year), end_month, last_day)

    query = query.filter(models.Week.date >= start_date)
    query = query.filter(models.Week.date <= end_date)
    return query.all()


@bp.route("/time/<int:year>/")
@bp.route("/time/<int:year>/<int:month>/<int:end_month>")
def time_detail(year: str, month: str = 1, end_month: str = 12):
    data = get_time_data(year, month, end_month)

    time = datetime.date(int(year), month, 1).strftime("%Y")

    months = range(1, 13)

    if len(data) == 0:
        abort(404)

    table_data = data_grouped_by_film(data)
    graph_data = data_grouped_by_date(data)

    return render_template(
        "time_detail.html",
        table_data=table_data,
        graph_data=graph_data,
        time=time,
        months=months,
        year=year,
    )


@bp.route("/time-csv/<year>")
@bp.route("/time-csv/<year>/<month>")
def time_csv(year, month=1):
    data = get_time_data(year, month)

    if data is None:
        abort(404)

    df = pd.DataFrame(data_grouped_by_film(data))

    resp = make_response(df.to_csv())
    resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
    resp.headers["Content-Type"] = "text/csv"
    return resp


@bp.app_template_filter()
def date_convert(datetime):
    return datetime.strftime("%d / %m / %Y")


@bp.app_template_filter()
def date_convert_to_month(m: int):
    date = datetime.date(2020, m, 1)
    return date.strftime("%B")
