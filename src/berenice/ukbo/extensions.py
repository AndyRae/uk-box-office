from flask_apscheduler import APScheduler
from flask_caching import Cache
from flask_debugtoolbar import DebugToolbarExtension
from flask_flatpages import FlatPages
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()
ma = Marshmallow()
scheduler = APScheduler()
pages = FlatPages()
toolbar = DebugToolbarExtension()
cache = Cache()
limiter = Limiter(key_func=get_remote_address)
cors = CORS(resources={r"/api2/*": {"origins": ["http://localhost:3000"], "methods": ["GET"]}})
