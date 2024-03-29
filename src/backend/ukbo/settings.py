"""App configuration"""

import os
from logging.config import dictConfig

from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    """
    Base config.

    All other configs inherit from this one.
    """

    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = (False,)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite://")
    SCHEDULER_API_ENABLED = False
    SCHEDULER_TIMEZONE = "UTC"
    CACHE_TYPE = "SimpleCache"
    CACHE_DEFAULT_TIMEOUT = 300
    RATELIMIT_DEFAULT = "200/minute"
    RATELIMIT_API = "200/minute"
    CORS_ORIGIN = os.getenv("CORS_ORIGIN")
    CORS_ORIGIN_2 = os.getenv("CORS_ORIGIN_2")
    RATELIMIT_STORAGE_URI = "memory://"


class DevelopmentConfig(Config):
    """
    Development config.
    """

    DEBUG = True
    CACHE_TYPE = "null"
    FLATPAGES_AUTO_RELOAD = DEBUG
    CORS_ORIGIN = "http://localhost:3000"
    CORS_ORIGIN_2 = "*"
    CACHE_TYPE = "NullCache"
    CACHE_NO_NULL_WARNING = True


class TestConfig(Config):
    """
    Test config.
    """

    DEBUG = True
    CACHE_TYPE = "null"
    TESTING = True
    CACHE_TYPE = "NullCache"
    CACHE_NO_NULL_WARNING = True
    CORS_ORIGIN = "*"


# Logging config
dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
            }
        },
        "handlers": {
            "wsgi": {
                "class": "logging.StreamHandler",
                "stream": "ext://flask.logging.wsgi_errors_stream",
                "formatter": "default",
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "formatter": "default",
                "filename": "error.log",
                "maxBytes": 10000,
                "delay": "True",
            },
        },
        "root": {"level": "INFO", "handlers": ["wsgi", "error_file"]},
    }
)
