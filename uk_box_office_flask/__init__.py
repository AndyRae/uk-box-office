import os

from dotenv import load_dotenv
from flask import Flask


def create_app(test_config=None):
    # create the app
    app = Flask(__name__, instance_relative_config=True)
    load_dotenv()
    SECRET = os.environ.get("secret")
    app.config.from_mapping(
        SECRET_KEY=SECRET,
        DATABASE=os.path.join(app.instance_path, "flaskr.sqlite"),
    )

    if test_config is None:
        # load the instance config - if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/hello")
    def hello():
        return "Hello, World!"

    # Database
    from uk_box_office_flask import db
    db.init_app(app)

    

    return app
