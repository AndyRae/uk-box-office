"""Front end pages"""

import calendar
import datetime
import json
from typing import Any, Dict, List

import pandas as pd
from flask import Blueprint, g, render_template, request, url_for
from flask.wrappers import Response
from flask_sqlalchemy import model
from werkzeug.exceptions import abort

from ukbo import cache, db, forms, models, pages, utils

bp = Blueprint("index", __name__, template_folder="templates")


@bp.route("/")
@cache.cached()
def index() -> str:
    """
    Main dashboard view - all of work is done in JS. See Template.
    """
    # list of dates card
    query = db.session.query(models.Film_Week)
    query = query.order_by(models.Film_Week.date.desc())
    query = query.distinct(models.Film_Week.date)
    dates = query.all()[:3]

    # initial data for dashboard
    end = datetime.datetime.now()
    start = end - datetime.timedelta(days=90)
    data = get_time_data(start, end)

    return render_template("index.html", dates=dates, data=data)


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
        type="films",
    )


@bp.route("/distributors-search")
def search_distributors() -> str:
    page = request.args.get("page", default=1, type=int)
    results, total = models.Distributor.search(
        g.search_form.q.data, page, 20  # type: ignore
    )
    next_url = (
        url_for(
            "index.search_distributors",
            q=g.search_form.q.data,
            page=page + 1,  # type: ignore
        )
        if total > page * 20  # type: ignore
        else None
    )
    prev_url = (
        url_for(
            "index.search_distributors",
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
        type="distributors",
    )


@bp.route("/films")
def films() -> str:
    """
    List of all films.
    """
    page = request.args.get("page", 1, type=int)
    query = db.session.query(models.Film).options(
        db.joinedload(models.Film.weeks)
    )
    query = query.join(models.Distributor)
    data = query.order_by(models.Film.id.desc()).paginate(
        page, per_page=20, error_out=False
    )
    if data is None:
        abort(404)
    return render_template("list/films.html", data=data)


@bp.route("/distributors")
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
        "list/distributors.html",
        data=data,
    )


@bp.route("/countries")
@cache.cached()
def countries() -> str:
    """
    List of all countries.
    """
    query = db.session.query(models.Country)
    data = query.order_by(models.Country.name.asc()).all()
    if data is None:
        abort(404)
    return render_template("list/countries.html", data=data)


@bp.route("/films/<slug>")
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

    table = pd.DataFrame(
        [i.as_df() for i in data.weeks],
        columns=[
            "date",
            "week_gross",
            "weekend_gross",
            "number_of_cinemas",
            "id",
            "total_gross",
            "weeks_on_release",
            "rank",
            "site_average",
        ],
    )
    table["pct_change_weekend"] = table["weekend_gross"].pct_change() * 100

    # Builds the missing dates if needed for chart
    df = pd.DataFrame(
        [i.as_dict() for i in data.weeks], columns=["id", "date", "week_gross"]
    )
    df.set_index(pd.DatetimeIndex(df["date"].values), inplace=True)
    df.drop(["date"], axis=1, inplace=True)
    df.drop_duplicates(inplace=True)
    df = df.asfreq("W", fill_value=0)

    return render_template(
        "detail/film_detail.html",
        data=data,
        table_data=table.reset_index().to_dict(orient="records"),
        chart_data=df.reset_index().to_dict(orient="records"),
    )


@bp.route("/distributors/<slug>")
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
    data = query.order_by(models.Film.id.asc()).paginate(page, 20, False)

    query = db.session.query(models.Distributor)
    query = query.filter(models.Distributor.slug == slug)
    distributor = query.first()

    if data is None:
        abort(404)
    return render_template(
        "detail/distributor_detail.html",
        data=data,
        distributor=distributor,
    )


@bp.route("/countries/<slug>")
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
    data = query.order_by(models.Film.id.asc()).paginate(page, 20, False)

    if data is None:
        abort(404)
    return render_template(
        "detail/country_detail.html",
        country=country,
        data=data,
    )


@bp.route("/time")
@cache.cached()
def time() -> str:
    """
    List of all time periods.
    Data per year.
    """
    query = db.session.query(models.Week)
    data = query.all()
    data = utils.group_by_year(data)

    return render_template("list/time.html", data=data)


@bp.route("/time/<int:year>")
def year_detail(year: int) -> str:
    """
    Year Detail.
    """
    start_date = datetime.date(int(year), 1, 1)
    end_date = datetime.date(int(year), 12, 31)
    data = get_time_data(start_date, end_date)

    time = start_date.strftime("%Y")

    if len(data) == 0:
        render_template(
            "detail/time_detail.html",
            table_data=[],
            graph_data=[],
            time=time,
            year=year,
        )

    table_data = utils.group_by_film(data)
    graph_data = utils.group_by_date(data)

    return render_template(
        "detail/time_detail.html",
        table_data=table_data,
        graph_data=graph_data,
        time=time,
        year=year,
    )


@bp.route("/time/<int:year>/<int:month>")
def month_detail(year: int, month: int) -> str:
    """
    Month detail.
    """
    # Get the last day of the month
    end_day = calendar.monthrange(year, month)[1]
    start_date = datetime.date(year, month, 1)
    end_date = datetime.date(year, month, end_day)

    time = start_date.strftime("%B %Y")

    data = get_time_data(start_date, end_date)

    if len(data) == 0:
        render_template(
            "detail/time_detail.html",
            table_data=[],
            graph_data=[],
            time=time,
            year=year,
        )

    table_data = utils.group_by_film(data)
    graph_data = utils.group_by_date(data)

    return render_template(
        "detail/time_detail.html",
        table_data=table_data,
        graph_data=graph_data,
        time=time,
        year=year,
    )


@bp.route("/time/<int:year>/<int:month>/<int:start_day>")
def week_detail(year: int, month: int, start_day: int) -> str:
    """
    Week detail.
    """
    start_date = datetime.date(year, month, start_day)
    data = get_time_data(start_date, start_date)

    time = start_date.strftime("%d %B %Y")

    if len(data) == 0:
        render_template(
            "detail/time_detail.html",
            table_data=[],
            graph_data=[],
            time=time,
            year=year,
        )

    table_data = utils.group_by_film(data)
    graph_data = utils.group_by_date(data)

    return render_template(
        "detail/time_detail.html",
        table_data=table_data,
        graph_data=graph_data,
        time=time,
        year=year,
    )


@bp.route("/reports")
def reports() -> str:
    """
    Listview for reports
    """
    return render_template("list/reports.html")


@bp.route("/reports/distributor-market-share")
def market_share() -> str:
    """
    Market share for distributors
    Data loaded from static for speed
    """
    path = "./data/distributor_market_data.json"
    with open(path) as json_file:
        data = json.load(json_file)

    now = datetime.datetime.now()
    years = list(range(2001, now.year + 1))

    return render_template("reports/market_share.html", data=data, years=years)


# @bp.route("/reports/country-market-share")
# def market_share_country() -> str:
#     """
#     Market share for countries
#     Data loaded from static for speed
#     """
#     # path = "./data/distributor_market_data.json"
#     # with open(path) as json_file:
#     #     data = json.load(json_file)

#     # now = datetime.datetime.now()
#     # years = list(range(2001, now.year + 1))

#     query = db.session.query(models.Film_Week)
#     data = query.all()
#     data, years = utils.group_by_country(data)

#     # json_data = data
#     # path = "./data/distributor_market_data.json"
#     # with open(path, "w") as outfile:
#     #     json.dump(json_data, outfile)
#     # return render_template("reports/market_share.html", data=data, years=years)


@bp.route("/reports/highest-grossing-films-all-time")
def top_films() -> str:
    """
    Highest grossing films.
    Data loaded from static for speed
    """
    path = "./data/top_films_data.json"
    with open(path) as json_file:
        data = json.load(json_file)

    return render_template("reports/top_films.html", data=data)


@bp.route("/<path>")
def flat(path: str) -> str:
    """
    Flat pages view.
    """
    post = pages.get_or_404(path)
    return render_template("page.html", text=post, title=path)


def get_time_data(start_date: datetime.date, end_date: datetime.date) -> Any:
    """
    Queries the weeks database with a start and end filter
    Returns the query object
    """
    query = db.session.query(models.Film_Week)
    query = query.filter(models.Film_Week.date >= start_date)
    query = query.filter(models.Film_Week.date <= end_date)
    query = query.order_by(models.Film_Week.date.desc())
    return query.all()


@bp.app_template_filter()
def date_convert(datetime: datetime.datetime) -> str:
    return datetime.strftime("%d/%m/%Y")


@bp.app_template_filter()
def date_convert_to_month(m: int) -> str:
    d = datetime.date(2020, m, 1)
    return d.strftime("%B")
