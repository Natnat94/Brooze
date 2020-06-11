from . import *
import os

DEBUG = True

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": "projet13",
        "USER": "nathan",
        "PASSWORD": os.environ.get("SQLPWD"),
    }
}
SECRET_KEY = os.environ.get("SECRET_KEY")

ALLOWED_HOSTS = ["www.nathan-mimoun.live", "nathan-mimoun.live", "projet13.nathan-mimoun.live"]
