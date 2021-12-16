"""Front end pages"""

import calendar

# from datetime import datetime, date, timedelta
import datetime
from typing import Any, Dict, List
from flask.wrappers import Response

import pandas as pd

from flask import (
    Blueprint,
    render_template,
    request,
    url_for,
    make_response,
    g,
)
from . import db, models, forms
from werkzeug.exceptions import abort


bp = Blueprint("index", __name__, template_folder="templates")


@bp.route("/")
def index() -> str:
    return render_template("index.html")


@bp.before_app_request
def before_request() -> None:
    db.session.commit()
    g.search_form = forms.SearchForm()


@bp.errorhandler(404)
def page_not_found(e: Any) -> str:
    return render_template("404.html")


@bp.route("/search")
def search() -> str:
    page = request.args.get("page", default=1, type=int)
    results, total = models.Film.search(
        g.search_form.q.data, page, 20  # type: ignore
    )
    next_url = (
        url_for(
            "index.search",
            q=g.search_form.q.data,
            page=page + 1,  # type: ignore
        )
        if total > page * 20  # type: ignore
        else None
    )
    prev_url = (
        url_for(
            "index.search",
            q=g.search_form.q.data,
            page=page - 1,  # type: ignore
        )
        if page > 1  # type: ignore
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
def films() -> str:
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Film)
    data = query.order_by(models.Film.name.asc()).paginate(page, 20, False)
    if data is None:
        abort(404)
    next_url = (
        url_for("index.films", page=data.next_num) if data.has_next else None
    )
    prev_url = (
        url_for("index.films", page=data.prev_num) if data.has_prev else None
    )
    return render_template(
        "films.html", data=data.items, next_url=next_url, prev_url=prev_url
    )


@bp.route("/distributors")
def distributors() -> str:
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Distributor)
    data = query.order_by(models.Distributor.name.asc()).paginate(
        page, 20, False
    )
    if data is None:
        abort(404)
    next_url = (
        url_for("index.distributors", page=data.next_num)
        if data.has_next
        else None
    )
    prev_url = (
        url_for("index.distributors", page=data.prev_num)
        if data.has_prev
        else None
    )
    return render_template(
        "distributors.html",
        data=data.items,
        next_url=next_url,
        prev_url=prev_url,
    )


@bp.route("/countries")
def countries() -> str:
    query = db.session.query(models.Country)
    data = query.order_by(models.Country.name.asc()).all()
    if data is None:
        abort(404)
    return render_template("countries.html", data=data)


@bp.route("/films/<slug>/")
def film(slug: str) -> str:
    query = db.session.query(models.Film)
    query = query.filter(models.Film.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    # Builds the missing dates if needed
    df = pd.DataFrame(
        [i.as_df() for i in data.weeks], columns=["date", "week_gross"]
    )
    df.set_index(pd.DatetimeIndex(df["date"].values), inplace=True)
    df.drop(["date"], axis=1, inplace=True)
    df = df.asfreq("W", fill_value=0)

    return render_template(
        "film_detail.html",
        data=data,
        chart_data=df.reset_index().to_dict(orient="records"),
    )


@bp.route("/film-csv/<slug>")
def film_csv(slug: str) -> Response:
    query = db.session.query(models.Film)
    query = query.filter(models.Film.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    # Builds the missing dates if needed
    df = pd.DataFrame(
        [i.as_df() for i in data.weeks], columns=["date", "week_gross"]
    )
    df.set_index(pd.DatetimeIndex(df["date"].values), inplace=True)
    df.drop(["date"], axis=1, inplace=True)
    df = df.asfreq("W", fill_value=0)

    resp = make_response(df.to_csv())
    resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
    resp.headers["Content-Type"] = "text/csv"
    return resp


@bp.route("/distributors/<slug>/")
def distributor(slug: str) -> str:
    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("distributor_detail.html", data=data)


@bp.route("/countries/<slug>/")
def country(slug: str) -> str:
    query = db.session.query(models.Country)
    query = query.filter(models.Country.slug == slug)
    data = query.first()

    if data is None:
        abort(404)
    return render_template("country_detail.html", data=data)


def data_grouped_by_date(data: List[Any]) -> Dict[str, Any]:
    """
    Calculates the gross by date
    """
    df = pd.DataFrame(
        [i.as_df() for i in data], columns=["date", "week_gross"]
    )
    df = df.groupby(["date"]).sum().sort_values(by=["date"])
    return df.reset_index().to_dict(orient="records")


def data_grouped_by_film(data: List[Any]) -> Dict[str, Any]:
    """
    Calculates the total gross per film for this collection of weeks
    """
    table_size = 100
    df = pd.DataFrame(
        [i.as_df2() for i in data], columns=["title", "slug", "week_gross"]
    )
    df = (
        df.groupby(["title", "slug"])
        .sum()
        .sort_values(by=["week_gross"], ascending=False)
    ).head(table_size)
    return df.reset_index().to_dict(orient="records")


@bp.route("/time/")
def time() -> str:
    years = range(2021, 2006, -1)
    months = range(1, 13)

    return render_template("time.html", years=years, months=months)


def get_time_data(start_date: datetime.date, end_date: datetime.date) -> Any:
    """
    Queries the weeks database with a start and end filter
    Returns the query object
    """
    query = db.session.query(models.Week)
    query = query.filter(models.Week.date >= start_date)
    query = query.filter(models.Week.date <= end_date)
    return query.all()


@bp.route("/time/<int:year>/")
def year_detail(year: int) -> str:

    start_date = datetime.date(int(year), 1, 1)
    end_date = datetime.date(int(year), 12, 31)

    data = get_time_data(start_date, end_date)

    if len(data) == 0:
        abort(404)

    table_data = data_grouped_by_film(data)
    graph_data = data_grouped_by_date(data)

    time = start_date.strftime("%Y")
    # previous = (start_date.replace(start_date.year - 1)).strftime("%Y")
    # next = (start_date.replace(start_date.year + 1)).strftime("%Y")

    return render_template(
        "time_detail.html",
        table_data=table_data,
        graph_data=graph_data,
        time=time,
        year=year,
        next=year + 1,
    )


@bp.route("/time/<int:year>/<int:month>/")
def month_detail(year: int, month: int) -> str:

    # Get the last day of the month
    end_day = calendar.monthrange(year, month)[1]

    start_date = datetime.date(year, month, 1)
    end_date = datetime.date(year, month, end_day)

    data = get_time_data(start_date, end_date)

    time = start_date.strftime("%B %Y")

    if len(data) == 0:
        abort(404)

    table_data = data_grouped_by_film(data)
    graph_data = data_grouped_by_date(data)

    # previous = (start_date.replace(start_date.month - 1)).strftime("%Y")
    next = (start_date.replace(start_date.month + 1)).strftime("%Y/%m")

    return render_template(
        "time_detail.html",
        table_data=table_data,
        graph_data=graph_data,
        time=time,
        year=year,
        next=next,
    )


@bp.route("/time/<int:year>/<int:month>/<int:start_day>/")
def week_detail(year: int, month: int, start_day: int) -> str:

    start_date = datetime.date(year, month, start_day)

    data = get_time_data(start_date, start_date)

    time = start_date.strftime("%d %B %Y")

    if len(data) == 0:
        abort(404)

    table_data = data_grouped_by_film(data)
    graph_data = data_grouped_by_date(data)

    return render_template(
        "time_detail.html",
        table_data=table_data,
        graph_data=graph_data,
        time=time,
        year=year,
    )


# TODO: Refactor the csv export functions
@bp.route("/time-csv/<year>")
@bp.route("/time-csv/<year>/<month>")
def time_csv(year: int, month: int = 1) -> Response:
    start_date = datetime.date(year, month, 1)

    data = get_time_data(start_date, start_date)

    if data is None:
        abort(404)

    df = pd.DataFrame(data_grouped_by_film(data))

    resp = make_response(df.to_csv())
    resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
    resp.headers["Content-Type"] = "text/csv"
    return resp


@bp.app_template_filter()
def date_convert(datetime: datetime.datetime) -> str:
    return datetime.strftime("%d / %m / %Y")


@bp.app_template_filter()
def date_convert_to_month(m: int) -> str:
    d = datetime.date(2020, m, 1)
    return d.strftime("%B")
