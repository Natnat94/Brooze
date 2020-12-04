from . import *
import os

DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": "projet13",
        "USER": "nathan",
        "PASSWORD": os.environ.get("SQLPWD"),
    }
}
SECRET_KEY = os.environ.get("SECRET_KEY")
CORS_ORIGIN_ALLOW_ALL = True
ALLOWED_HOSTS = ["www.nathan-mimoun.live", "nathan-mimoun.live", "projet13.nathan-mimoun.live",]

#####################
#   email setting   #
#####################

# do not work (api key compromised)


EMAIL_HOST = "smtp.sendgrid.net"
EMAIL_HOST_USER = "apikey"  # this is exactly the value 'apikey'
if "EMAIL_PWD" in os.environ:
    EMAIL_HOST_PASSWORD = os.environ["EMAIL_PWD"]
    print(
        "EMAIL_HOST_PASSWORD environment variable is already defined. Value =",
        os.environ["EMAIL_PWD"],
    )
else:
    EMAIL_HOST_PASSWORD = "123456789"
    print(
        "EMAIL_HOST_PASSWORD environment variable is not defined. Default Value =",
        EMAIL_HOST_PASSWORD,
    )
EMAIL_PORT = 587
EMAIL_USE_TLS = True


#################################
#   Admin env. notice setting   #
#################################


ENVIRONMENT_FLOAT = True
ENVIRONMENT_NAME = "Production server"
ENVIRONMENT_COLOR = "#FF2222"