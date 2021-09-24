from datetime import datetime
from operator import and_
import re
from typing import Dict, List
from flask import (
    Blueprint,
    flash,
    g,
    json,
    redirect,
    render_template,
    make_response,
    request,
    url_for,
    jsonify,
)

from werkzeug.exceptions import abort

from uk_box_office_flask import db, models

bp = Blueprint("api", __name__)


@bp.errorhandler(404)
def page_not_found(e):
    return make_response(jsonify({"error": "Not found"}), 404)


@bp.route("/api")
def api():
    """
    Main API endpoint.
    """
    query = db.session.query(models.Week)

    if "title" in request.args:
        title = str(request.args.get("title"))
        query = query.filter(models.Week.film_id == title)
    if "distributor" in request.args:
        distributor = str(request.args.get("distributor"))
        query = query.filter(models.Week.distributor_id == distributor)
    if "start_date" in request.args:
        start_date = to_date(request.args.get("start_date"))
        query = query.filter(models.Week.date >= start_date)
    if "end_date" in request.args:
        end_date = to_date(request.args.get("end_date"))
        query = query.filter(models.Week.date <= end_date)

    data = query.order_by(models.Week.date.desc()).all()
    if data is None:
        abort(404)

    results = [ix.as_dict() for ix in data]
    return jsonify(
        get_paginated_list(
            results,
            "/api",
            start=int(request.args.get("start", 1)),
            limit=int(request.args.get("limit", 20)),
        )
    )


@bp.route("/api/films")
def films():
    query = db.session.query(models.Film)
    if "title" in request.args:
        title = str(request.args["title"])
        query = query.filter(models.Film.title == title)
    data = query.order_by(models.Film.title.asc()).all()
    if data is None:
        abort(404)

    results = [ix.as_dict() for ix in data]
    return jsonify(
        get_paginated_list(
            results,
            "/api",
            start=int(request.args.get("start", 1)),
            limit=int(request.args.get("limit", 20)),
        )
    )

@bp.route("/api/film")
def film(): # need to query weeks + join on film
    # query = db.session.query(models.Film).join(models.Week, models.Week.film_id==models.Film.title)
    if "title" in request.args:
        query = db.session.query(models.Film)
        # query = db.session.query(models.Film).join(models.Week, models.Week.film_id==models.Film.title)
        title = str(request.args["title"])
        query = query.filter(models.Film.title == title)
        data = query.first()
        if data is None:
            abort(404)

        for i in data.weeks:
            print(i)
        return data.as_dict()
    abort(404)


@bp.route("/api/distributors")
def distributors():
    query = db.session.query(models.Distributor)
    if "name" in request.args:
        name = str(request.args["name"])
        query = query.filter(models.Distributor.name == name)
    data = query.order_by(models.Distributor.name.asc()).all()
    if data is None:
        abort(404)

    results = [ix.as_dict() for ix in data]
    return jsonify(
        get_paginated_list(
            results,
            "/api/distributor",
            start=int(request.args.get("start", 1)),
            limit=int(request.args.get("limit", 20)),
        )
    )


def to_date(date_string: str):
    return datetime.strptime(date_string, "%Y-%m-%d")


def get_paginated_list(results: List[Dict], url: str, start: int, limit: int):
    """
    Pagination for the API.
    Returns a dict of the results, with additions
    """
    # check if page exists
    count = len(results)

    if count < start:
        abort(404)
    # make response
    obj = {"start": start, "limit": limit, "count": count}
    # make URLs
    # make previous url
    if start == 1:
        obj["previous"] = ""
    else:
        start_copy = max(1, start - limit)
        limit_copy = start - 1
        obj["previous"] = url + "?start=%d&limit=%d" % (start_copy, limit_copy)
    # make next url
    if start + limit > count:
        obj["next"] = ""
    else:
        start_copy = start + limit
        obj["next"] = url + "?start=%d&limit=%d" % (start_copy, limit)
    # finally extract result according to bounds
    obj["results"] = results[(start - 1) : (start - 1 + limit)]
    return obj


def test_data():
    country = models.Country(name="UK")
    distributor = models.Distributor(name="SONY")

    db.session.add(country)
    db.session.add(distributor)
    db.session.commit()

    film1 = models.Film(
        title="CANDYMAN",
        country=country,
        distributor=distributor,
    )

    db.session.add(film1)
    db.session.commit()

    test_date = datetime.strptime("29 Aug 2021", "%d %b %Y")
    test_date2 = datetime.strptime("05 Sep 2021", "%d %b %Y")
    test_date4 = datetime.strptime("29 Sep 2020", "%d %b %Y")

    test_week = {
        "date": test_date,
        "title": film1,
        "distributor": distributor,
        "country": country,
        "number_of_cinemas": 653,
        "rank": 1,
        "total_gross": 1112674,
        "week_gross": 5759504,
        "weekend_gross": 5759504,
        "weeks_on_release": 1,
    }
    test_week2 = {
        "date": test_date2,
        "title": film1,
        "distributor": distributor,
        "country": country,
        "number_of_cinemas": 653,
        "rank": 1,
        "total_gross": 2912029,
        "week_gross": 5759504,
        "weekend_gross": 5759504,
        "weeks_on_release": 2,
    }
    test_week4 = {
        "date": test_date4,
        "title": film1,
        "distributor": distributor,
        "country": country,
        "number_of_cinemas": 653,
        "rank": 1,
        "total_gross": 2912030,
        "week_gross": 5759504,
        "weekend_gross": 5759504,
        "weeks_on_release": 4,
    }
    week1 = models.Week(**test_week)
    week2 = models.Week(**test_week2)
    week4 = models.Week(**test_week4)

    db.session.add(week1)
    db.session.add(week2)
    db.session.add(week4)
    db.session.commit()
