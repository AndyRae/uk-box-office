from flask import Blueprint, flash, g, json, redirect, render_template, request, url_for, jsonify

from werkzeug.exceptions import abort

from uk_box_office_flask.db import get_db

bp = Blueprint("api", __name__)

@bp.route("/api", methods=("GET",))
def api():
    id = 0
    if 'id' in request.args:
        id = int(request.args['id'])
    db = get_db()
    posts = []
    # posts = db.execute(
    # "SELECT p.id, title, body, created, author_id, username"
    # " FROM post p JOIN user u ON p.author_id = u.id"
    # f" WHERE author_id={author}"
    # " ORDER BY created DESC"
    # ).fetchall()
    return json.dumps( [dict(ix) for ix in posts] )