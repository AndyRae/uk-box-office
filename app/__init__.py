from flask import Blueprint, Flask

bp = Blueprint("index", __name__, template_folder="templates")


@bp.route("/")
def index() -> str:
    """
    Main dashboard view - all of work is done in JS. See Template.
    """
    return "hello world!"


def create_app() -> Flask:
    app = Flask(__name__, instance_relative_config=True)

    with app.app_context():
        app.register_blueprint(bp)
        return app
