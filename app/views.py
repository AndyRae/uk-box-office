"""Front end pages"""

import calendar
import datetime
from typing import Any, Dict, List

import pandas as pd
from flask import (
    Blueprint,
    current_app,
    g,
    make_response,
    render_template,
    request,
    url_for,
)
from flask.wrappers import Response
from flask_sqlalchemy import model
from werkzeug.exceptions import abort

from . import cache, db, forms, models

bp = Blueprint("index", __name__, template_folder="templates")


@bp.route("/")
@cache.cached()
def index() -> str:
    """
    Main dashboard view - all of work is done in JS. See Template.
    """
    # list of dates card
    query = db.session.query(models.Week)
    query = query.order_by(models.Week.date.desc())
    query = query.distinct(models.Week.date)
    dates = query.all()[:6]
    return render_template("index.html", dates=dates)


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


@bp.route("/films/")
@cache.cached()
def films() -> str:
    """
    List of all films.
    TODO: Should be ordered by last updated
    """
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Film).options(
        db.joinedload(models.Film.weeks)
    )
    query = query.join(models.Distributor)
    data = query.order_by(models.Film.name).paginate(
        page, per_page=20, error_out=False
    )
    if data is None:
        abort(404)
    return render_template("films.html", data=data)


@bp.route("/distributors/")
@cache.cached()
def distributors() -> str:
    """
    List of all distributors.
    """
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Distributor)
    data = query.order_by(models.Distributor.name.asc()).paginate(
        page, 20, False
    )
    if data is None:
        abort(404)
    return render_template(
        "distributors.html",
        data=data,
    )


@bp.route("/countries/")
@cache.cached()
def countries() -> str:
    """
    List of all countries.
    """
    query = db.session.query(models.Country)
    data = query.order_by(models.Country.name.asc()).all()
    if data is None:
        abort(404)
    return render_template("countries.html", data=data)


@bp.route("/films/<slug>/")
@cache.cached()
def film(slug: str) -> str:
    """
    Film detail.
    """
    query = db.session.query(models.Film)
    query = query.filter(models.Film.slug == slug)
    data = query.first()

    if data is None:
        abort(404)

    # Builds the missing dates if needed
    df = pd.DataFrame(
        [i.as_df_film() for i in data.weeks], columns=["date", "week_gross"]
    )
    df.set_index(pd.DatetimeIndex(df["date"].values), inplace=True)
    df.drop(["date"], axis=1, inplace=True)
    df = df.asfreq("W", fill_value=0)

    return render_template(
        "film_detail.html",
        data=data,
        chart_data=df.reset_index().to_dict(orient="records"),
    )


@bp.route("/distributors/<slug>/")
@cache.cached()
def distributor(slug: str) -> str:
    """
    Distributor detail.
    """
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Film).options(
        db.joinedload(models.Film.weeks)
    )
    query = query.join(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    data = query.paginate(page, 20, False)

    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    distributor = query.first()

    if data is None:
        abort(404)
    return render_template(
        "distributor_detail.html",
        data=data,
        distributor=distributor,
    )


@bp.route("/countries/<slug>/")
@cache.cached()
def country(slug: str) -> str:
    """
    Country detail.
    """
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Country)
    query = query.filter(models.Country.slug == slug)
    country = query.first()

    query = db.session.query(models.Film).options(
        db.selectinload(models.Film.weeks)
    )
    query = query.filter(models.Film.countries.contains(country))
    data = query.paginate(page, 20, False)

    if data is None:
        abort(404)
    return render_template(
        "country_detail.html",
        country=country,
        data=data,
    )


def data_grouped_by_date(data: List[Any]) -> Dict[str, Any]:
    """
    Calculates the statistics by date given a list of weeks
    """
    df = pd.DataFrame(
        [i.as_df() for i in data],
        columns=[
            "date",
            "week_gross",
            "weekend_gross",
            "number_of_cinemas",
            "id",
        ],
    )

    df = (
        df.groupby(["date"])
        .agg(
            {
                "week_gross": ["sum"],
                "weekend_gross": ["sum"],
                "number_of_cinemas": ["max"],
                "id": ["size"],
            }
        )
        .sort_values(by=["date"])
    )
    df.columns = df.columns.get_level_values(0)

    df["pct_change_weekend"] = df["week_gross"].pct_change()
    df["pct_change_week"] = df["week_gross"].pct_change()
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


def get_time_data(start_date: datetime.date, end_date: datetime.date) -> Any:
    """
    Queries the weeks database with a start and end filter
    Returns the query object
    """
    query = db.session.query(models.Week)
    query = query.filter(models.Week.date >= start_date)
    query = query.filter(models.Week.date <= end_date)
    return query.all()


@bp.route("/time/")
def time() -> str:
    """
    List of all time periods.
    """
    years = range(2022, 2006, -1)
    months = range(1, 13)

    return render_template("time.html", years=years, months=months)


@bp.route("/time/<int:year>/")
def year_detail(year: int) -> str:
    """
    Year Detail.
    """
    start_date = datetime.date(int(year), 1, 1)
    end_date = datetime.date(int(year), 12, 31)

    data = get_time_data(start_date, end_date)

    if len(data) == 0:
        abort(404)

    table_data = data_grouped_by_film(data)
    graph_data = data_grouped_by_date(data)

    time = start_date.strftime("%Y")

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
    """
    Month detail.
    """
    # Get the last day of the month
    end_day = calendar.monthrange(year, month)[1]

    start_date = datetime.date(year, month, 1)
    end_date = datetime.date(year, month, end_day)

    data = get_time_data(start_date, end_date)

    if len(data) == 0:
        abort(404)

    table_data = data_grouped_by_film(data)
    graph_data = data_grouped_by_date(data)

    next = (start_date + datetime.timedelta(days=end_day)).strftime("%Y/%m")
    time = start_date.strftime("%B %Y")

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
    """
    Week detail.
    """
    start_date = datetime.date(year, month, start_day)

    data = get_time_data(start_date, start_date)

    if len(data) == 0:
        abort(404)

    table_data = data_grouped_by_film(data)
    graph_data = data_grouped_by_date(data)

    next = (start_date + datetime.timedelta(days=7)).strftime("%Y/%m/%d")
    time = start_date.strftime("%d %B %Y")

    return render_template(
        "time_detail.html",
        table_data=table_data,
        graph_data=graph_data,
        time=time,
        year=year,
        next=next,
    )


@bp.route("/sitemap.xml")
@cache.cached()
def sitemap() -> Response:
    """
    Sitemap generator - queries all models for all slugs.
    """
    data = []
    url = "https://boxofficedata.co.uk"
    now = datetime.datetime.now() - datetime.timedelta(days=10)
    lastmod = now.strftime("%Y-%m-%d")

    # Main Views
    for rule in current_app.url_map.iter_rules():
        if rule.methods is not None:
            if (
                "GET" in rule.methods
                and len(rule.arguments) == 0
                and not rule.rule.startswith("/api")
                and not rule.rule.startswith("/auth")
                and not rule.rule.startswith("/scheduler")
                and not rule.rule.startswith("/test")
            ):
                data.append([url + rule.rule, lastmod])

    films = db.session.query(models.Film.slug).all()
    for i in films:
        slug = f"{url}/films/{i.slug}/"
        data.append([slug, lastmod])

    countries = db.session.query(models.Country.slug).all()
    for i in countries:
        slug = f"{url}/countries/{i.slug}/"
        data.append([slug, lastmod])

    distributors = db.session.query(models.Distributor.slug).all()
    for i in distributors:
        slug = f"{url}/distributors/{i.slug}/"
        data.append([slug, lastmod])

    time = db.session.query(models.Week.date)
    for i in time:
        date = i.date.strftime("%Y/%m/%d")
        slug = f"{url}/time/{date}"
        data.append([slug, i.date])

    # Creates time range slugs
    for i in range(2007, now.year):
        slug = f"{url}/time/{i}/"
        data.append([slug, i])

        for j in range(1, 13):
            slug = f"{url}/time/{i}/{j}/"
            data.append([slug, i])

    sitemap_template = render_template("sitemap.xml", data=data)
    response = make_response(sitemap_template)
    response.headers["Content-Type"] = "application/xml"

    return response


@bp.app_template_filter()
def date_convert(datetime: datetime.datetime) -> str:
    return datetime.strftime("%d/%m/%Y")


@bp.app_template_filter()
def date_convert_to_month(m: int) -> str:
    d = datetime.date(2020, m, 1)
    return d.strftime("%B")