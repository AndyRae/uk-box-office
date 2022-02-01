import datetime
import string
from typing import Any

from flask import Blueprint, current_app, make_response, render_template
from flask.wrappers import Response
from werkzeug.exceptions import abort

from ukbo import cache, db, models

bp = Blueprint("sitemap", __name__, template_folder="templates")


def return_sitemap(data: Any) -> Response:
    sitemap_template = render_template("sitemap.xml", data=data)
    response = make_response(sitemap_template)
    response.headers["Content-Type"] = "application/xml"

    return response


@bp.route("/sitemap.xml")
@cache.cached()
def sitemap() -> Response:
    """
    Sitemap root.
    """
    letters = list(string.ascii_lowercase)

    sitemap_template = render_template("sitemapindex.xml", data=letters)
    response = make_response(sitemap_template)
    response.headers["Content-Type"] = "application/xml"
    return response


@bp.route("/sitemap_static.xml")
@cache.cached()
def base() -> Response:
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
                and not rule.rule.startswith("/sitemap")
            ):
                data.append([url + rule.rule, lastmod])

    return return_sitemap(data)


@bp.route("/sitemap_<char>.xml")
@cache.cached()
def films_letter(char: str) -> Response:
    """
    10k+ films - so split sitemap alphabetically
    """
    data = []
    url = "https://boxofficedata.co.uk"
    now = datetime.datetime.now() - datetime.timedelta(days=10)
    lastmod = now.strftime("%Y-%m-%d")

    query = db.session.query(models.Film)
    query = query.filter(models.Film.name.startswith(str.upper(char)))
    films = query.all()

    for i in films:
        slug = f"{url}/films/{i.slug}/"
        data.append([slug, lastmod])

    return return_sitemap(data)


@bp.route("/sitemap_countries.xml")
@cache.cached()
def countries() -> Response:
    data = []
    url = "https://boxofficedata.co.uk"
    now = datetime.datetime.now() - datetime.timedelta(days=10)
    lastmod = now.strftime("%Y-%m-%d")

    countries = db.session.query(models.Country.slug).all()
    for i in countries:
        slug = f"{url}/countries/{i.slug}/"
        data.append([slug, lastmod])

    return return_sitemap(data)


@bp.route("/sitemap_distributors.xml")
@cache.cached()
def distributors() -> Response:
    data = []
    url = "https://boxofficedata.co.uk"
    now = datetime.datetime.now() - datetime.timedelta(days=10)
    lastmod = now.strftime("%Y-%m-%d")

    distributors = db.session.query(models.Distributor.slug).all()
    for i in distributors:
        slug = f"{url}/distributors/{i.slug}/"
        data.append([slug, lastmod])

    return return_sitemap(data)


@bp.route("/sitemap_time.xml")
@cache.cached()
def time() -> Response:
    """
    Time sitemap
    """
    data = []
    url = "https://boxofficedata.co.uk"
    now = datetime.datetime.now() - datetime.timedelta(days=10)

    time = db.session.query(models.Film_Week.date)
    for i in time:
        date = i.date.strftime("%Y/%m/%d")
        slug = f"{url}/time/{date}"
        data.append([slug, i.date])

    # Creates time range slugs
    for i in range(2001, now.year):
        slug = f"{url}/time/{i}/"
        data.append([slug, i])

        for j in range(1, 13):
            slug = f"{url}/time/{i}/{j}/"
            data.append([slug, i])

    return return_sitemap(data)
