from datetime import datetime
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


# @bp.route("/api", methods=("GET",))
# def api():
#     data = models.Week.query.all()

#     title = ""
#     if "title" in request.args:
#         print(title)
#         title = str(request.args["title"])
#         data = models.Week.query.filter(models.Week.film_id == title).all()

#     return json.dumps([ix.as_dict() for ix in data])

def to_date(date_string: str):
    print(date_string)
    return datetime.strptime(date_string, "%Y-%m-%d")

@bp.errorhandler(404)
def page_not_found(e):
    return make_response(jsonify({'error': 'Not found'}), 404)

@bp.route('/api')
def api():
    start_date = to_date(request.args.get("start_date"))
    # data = models.Week.query.filter_by(**request.args).all()
    data = models.Week.query.filter(models.Week.date>=start_date).all()
    if data is None:
        abort(404)
    # request_type = str(request.args.get("type"))

    # if request_type == "country":
    #     data = models.Country.query.all()

    # elif request_type == "distributor":
    #     data = models.Distributor.query.all()
    # elif request_type == "weeks":
    #     title = request.args["title"] if "title" in request.args else ""
    #     data = models.Week.query.filter(models.Film.title == title).all()
    results = ([ix.as_dict() for ix in data])
    return jsonify(get_paginated_list(
        results, 
        '/api', 
        start=int(request.args.get('start', 1)), 
        limit=int(request.args.get('limit', 20))
    ))

@bp.route('/api/film')
def film():
    if "title" in request.args:
        title = str(request.args["title"])
        data = models.Film.query.filter(models.Film.title == title).first()
        if data is None:
            abort(404)
        return data.as_dict()
    abort(404)

@bp.route('/api/distributor')
def distributor():
    if "name" in request.args:
        name = str(request.args["name"])
        data = models.Distributor.query.filter(models.Distributor.name == name).first()
        if data is None:
            abort(404)
        return data.as_dict()
    abort(404)

def get_paginated_list(results: List[Dict], url: str, start: int, limit: int):
    # check if page exists
    count = len(results)
    print(type(start))

    if (count < start):
        abort(404)
    # make response
    obj = {}
    obj['start'] = start
    obj['limit'] = limit
    obj['count'] = count
    # make URLs
    # make previous url
    if start == 1:
        obj['previous'] = ''
    else:
        start_copy = max(1, start - limit)
        limit_copy = start - 1
        obj['previous'] = url + '?start=%d&limit=%d' % (start_copy, limit_copy)
    # make next url
    if start + limit > count:
        obj['next'] = ''
    else:
        start_copy = start + limit
        obj['next'] = url + '?start=%d&limit=%d' % (start_copy, limit)
    # finally extract result according to bounds
    obj['results'] = results[(start - 1):(start - 1 + limit)]
    return obj