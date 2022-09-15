from flask_apscheduler import APScheduler
from flask_caching import Cache
from flask_debugtoolbar import DebugToolbarExtension
from flask_flatpages import FlatPages
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
scheduler = APScheduler()
pages = FlatPages()
toolbar = DebugToolbarExtension()
cache = Cache()
limiter = Limiter(key_func=get_remote_address)
