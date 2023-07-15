"""

Extensions module

This module initializes the extensions used by the application.

"""

from flask_apscheduler import APScheduler
from flask_caching import Cache
from flask_compress import Compress
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

scheduler = APScheduler()
cache = Cache()
compress = Compress()
db = SQLAlchemy()
limiter = Limiter(key_func=get_remote_address)
ma = Marshmallow()
migrate = Migrate()
