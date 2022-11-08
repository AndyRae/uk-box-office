"""Front end pages"""

import calendar
import datetime
import json
from typing import Any

import pandas as pd
from flask import Blueprint, g, render_template, request, url_for
from ukbo import cache, db, models, pages, services  # type: ignore
from werkzeug.exceptions import abort


bp = Blueprint("index", __name__, template_folder="templates")


@bp.route("/")
@cache.cached()
def index() -> str:
    """
    Main dashboard view - all of work is done in JS. See Template.
    """
    # list of dates card
    dates = []
    query = db.session.query(models.Film_Week)
    query = query.order_by(models.Film_Week.date.desc())
    query = query.distinct(models.Film_Week.date)
    dates = query.all()[:3]

    # initial data for dashboard
    data = []
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=90)
    data = get_box_office_data(models.Film_Week, start_date, end_date)

    return render_template("index.html", dates=dates, data=data)


@bp.before_app_request
def before_request() -> None:
    db.session.commit()


@bp.errorhandler(404)
def page_not_found(e: Any) -> str:
    return render_template("404.html")


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
    data = services.utils.group_by_year(data)

    return render_template("list/time.html", data=data)


@bp.route("/time/<int:year>")
def year_detail(year: int) -> str:
    """
    Year Detail.
    """
    start_date = datetime.date(year, 1, 1)
    end_date = datetime.date(year, 12, 31)

    time_string = f"{year}"

    return render_time(start_date, end_date, time_string, year)


@bp.route("/time/<int:year>/m<int:month>")
def month_detail(year: int, month: int) -> str:
    """
    Month detail.
    """
    # Get the last day of the month
    end_day = calendar.monthrange(year, month)[1]
    start_date = datetime.date(year, month, 1)
    end_date = datetime.date(year, month, end_day)

    time_string = start_date.strftime("%B %Y")

    return render_time(start_date, end_date, time_string, year)


@bp.route("/time/<int:year>/q<int:quarter>")
@bp.route("/time/<int:year>/q<int:quarter>/q<int:quarter_end>")
def quarter_detail(year: int, quarter: int, quarter_end: int = 0) -> str:
    """
    Quarter detail.
    """
    # Convert the quarter
    time_string = f"{year} Q{quarter}"
    start_month = (quarter * 3) - 2
    if quarter_end != 0:
        end_month = quarter_end * 3
        time_string += f" - Q{quarter_end}"
    else:
        end_month = quarter * 3

    end_day = calendar.monthrange(year, end_month)[1]
    start_date = datetime.date(year, start_month, 1)
    end_date = datetime.date(year, end_month, end_day)

    return render_time(start_date, end_date, time_string, year)


@bp.route("/time/<int:year>/m<int:month>/d<int:start_day>")
def week_detail(year: int, month: int, start_day: int) -> str:
    """
    Week detail.
    """
    start_date = datetime.date(year, month, start_day)
    time_string = start_date.strftime("%d %B %Y")

    return render_time(start_date, start_date, time_string, year)


def render_time(
    start_date: datetime.date,
    end_date: datetime.date,
    time_string: str,
    year: int,
) -> render_template:

    # Forces a to-date comparison.
    if end_date > datetime.date.today():
        end_date = datetime.date.today()

    film_data = get_box_office_data(models.Film_Week, start_date, end_date)

    if len(film_data) == 0:
        return render_template(
            "detail/time_detail.html",
            table_data=[],
            graph_data=[],
            time=time_string,
            year=year,
        )

    film_graph_data = services.utils.group_by_film(film_data)
    week_data = get_box_office_data(models.Week, start_date, end_date)

    prev_year_start = start_date - datetime.timedelta(days=365)
    prev_year_end = end_date - datetime.timedelta(days=365)
    previous_data = get_box_office_data(
        models.Week, prev_year_start, prev_year_end
    )

    statistics = services.utils.get_statistics(week_data, previous_data)

    return render_template(
        "detail/time_detail.html",
        table_data=film_graph_data,
        line_graph_data=week_data,
        statistics=statistics,
        time=time_string,
        year=year,
    )


@bp.route("/reports")
@cache.cached()
def reports() -> str:
    """
    Listview for reports
    """
    return render_template("list/reports.html")


@bp.route("/reports/distributor-market-share")
@cache.cached()
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
@cache.cached()
def top_films() -> str:
    """
    Highest grossing films.
    Data loaded from static for speed
    """
    return services.boxoffice.top()


@bp.route("/reports/forecast")
@cache.cached()
def forecast() -> str:
    """
    Box Office Forecast view
    """
    now = datetime.datetime.now()
    last_year = datetime.timedelta(days=365)
    start_date = now - last_year
    end_date = now + last_year

    data = get_box_office_data(models.Week, start_date, end_date)

    return render_template("reports/forecast.html", data=data)


@bp.route("/<path>")
def flat(path: str) -> str:
    """
    Flat pages view.
    """
    post = pages.get_or_404(path)
    return render_template("page.html", text=post, title=path)


def get_box_office_data(
    model: Any, start_date: datetime.date, end_date: datetime.date
) -> Any:
    """
    Queries the models database with a start and end filter
    Returns the query object
    """
    query = db.session.query(model)
    query = query.filter(model.date >= start_date)
    query = query.filter(model.date <= end_date)
    query = query.order_by(model.date.desc())
    return query.all()


@bp.app_template_filter()
def date_convert(datetime: datetime.datetime) -> str:
    return datetime.strftime("%d/%m/%Y")


@bp.app_template_filter()
def date_convert_to_month(m: int) -> str:
    d = datetime.date(2020, m, 1)
    return d.strftime("%B")
