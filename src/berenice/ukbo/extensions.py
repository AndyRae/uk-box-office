from flask_apscheduler import APScheduler
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import app

origins = [app.config.get("CORS_ORIGIN")]

scheduler = APScheduler()
cache = Cache()
cors = CORS(resources={r"/api/*": {"origins": origins, "methods": ["GET"]}})
db = SQLAlchemy()
limiter = Limiter(key_func=get_remote_address)
ma = Marshmallow()
migrate = Migrate()
