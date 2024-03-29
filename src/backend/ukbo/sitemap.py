import datetime
import string
from typing import Any

from flask import Blueprint, current_app, make_response, render_template
from flask.wrappers import Response
from ukbo import cache, db, models  # type: ignore
from werkzeug.exceptions import abort

bp = Blueprint("sitemap", __name__, template_folder="sitemap")


def return_sitemap(data: Any) -> Response:
    """
    Return sitemap XML.

    Args:
        data: Data to render in sitemap.

    Returns:
        Response object with sitemap XML.
    """
    sitemap_template = render_template("sitemap.xml", data=data)
    response = make_response(sitemap_template)
    response.headers["Content-Type"] = "application/xml"

    return response


@bp.route("/sitemap.xml")
@cache.cached()
def sitemap() -> Response:
    """
    Sitemap root for all sitemaps.

    Returns:
        Response object with sitemap XML.
    """
    numbers = list(range(10)) + list(string.ascii_lowercase)  # type: ignore

    sitemap_template = render_template("sitemapindex.xml", data=numbers)
    response = make_response(sitemap_template)
    response.headers["Content-Type"] = "application/xml"
    return response


@bp.route("/sitemap_<char>.xml")
@cache.cached()
def films_letter(char: str) -> Response:
    """
    Sitemap for films.

    There are 10,000 films - so we split sitemap alphabetically.
    Args:
        char: Letter to filter films by.

    Returns:
        Response object with sitemap XML.
    """
    data = []
    url = "https://boxofficedata.co.uk"
    now = datetime.datetime.now() - datetime.timedelta(days=10)
    lastmod = now.strftime("%Y-%m-%d")

    query = db.session.query(models.Film)
    query = query.filter(models.Film.name.startswith(str.upper(char)))
    films = query.all()

    for i in films:
        slug = f"{url}/film/{i.slug}"
        data.append([slug, lastmod])

    return return_sitemap(data)


@bp.route("/sitemap_countries.xml")
@cache.cached()
def countries() -> Response:
    """
    Sitemap for countries.

    Returns:
        Response object with sitemap XML.
    """
    data = []
    url = "https://boxofficedata.co.uk"
    now = datetime.datetime.now() - datetime.timedelta(days=10)
    lastmod = now.strftime("%Y-%m-%d")

    countries = db.session.query(models.Country.slug).all()
    for i in countries:
        slug = f"{url}/countries/{i.slug}"
        data.append([slug, lastmod])

    return return_sitemap(data)


@bp.route("/sitemap_distributors.xml")
@cache.cached()
def distributors() -> Response:
    """
    Sitemap for distributors.

    Returns:
        Response object with sitemap XML.
    """
    data = []
    url = "https://boxofficedata.co.uk"
    now = datetime.datetime.now() - datetime.timedelta(days=10)
    lastmod = now.strftime("%Y-%m-%d")

    distributors = db.session.query(models.Distributor.slug).all()
    for i in distributors:
        slug = f"{url}/distributors/{i.slug}"
        data.append([slug, lastmod])

    return return_sitemap(data)


@bp.route("/sitemap_time.xml")
@cache.cached()
def time() -> Response:
    """
    Time sitemap.

    Builds sitemap for all the time pages.

    Returns:
        Response object with sitemap XML.
    """
    data = []
    url = "https://boxofficedata.co.uk"
    now = datetime.datetime.now() - datetime.timedelta(days=10)

    time = db.session.query(models.Film_Week.date)
    for i in time:
        date = i.date.strftime("%Y/m%m/d%d")
        slug = f"{url}/time/{date}"
        data.append([slug, i.date])

    # Creates time range slugs
    for i in range(2001, now.year):
        slug = f"{url}/time/{i}"
        data.append([slug, i])

        for j in range(1, 13):
            slug = f"{url}/time/{i}/m{j}"
            data.append([slug, i])

    return return_sitemap(data)
