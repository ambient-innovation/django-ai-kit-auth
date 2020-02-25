SECRET_KEY = "SLIDFHVsdkjlr3lrnnlrvnker"

DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:",}}


INSTALLED_APPS = (
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "rest_framework",
)

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

MIDDLEWARE = (
    # "django.contrib.sessions.middleware.SessionMiddleware",
    # "django.contrib.auth.middleware.AuthenticationMiddleware",
)

ROOT_URLCONF = "auth.urls"
