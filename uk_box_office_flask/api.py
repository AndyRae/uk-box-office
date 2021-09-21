from flask import (
    Blueprint,
    flash,
    g,
    json,
    redirect,
    render_template,
    request,
    url_for,
    jsonify,
)

from werkzeug.exceptions import abort

from uk_box_office_flask import db, models

bp = Blueprint("api", __name__)


@bp.route("/api", methods=("GET",))
def api():
    data = models.Week.query.all()

    title = ""
    if "title" in request.args:
        print(title)
        title = str(request.args["title"])
        data = models.Week.query.filter(models.Week.film_id == title).all()

    return json.dumps([ix.as_dict() for ix in data])
