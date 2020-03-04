django-ai-kit-auth
==================

django-ai-kit-auth bundles everything authentication related and is meant to
work seamlessly with the ai-kit-auth react component.

It provides routes for login, password validation, password reset, registration
and account verification.

It includes a services to trigger the account validation and other
functionality. It works with the standard django and with a custom user model as
long as its provides an email address.

Standard Django sessions are used for authentification.

Quick Start
-----------

1.) Add ``ai-kit-auth`` to your ``INSTALLED_APPS`` like so:

::

    INSTALLED_APPS = (
        # ...
        "rest_framework",
        # ...
        "ai-kit-auth",
        # ...
        "corsheaders",
    )

``rest_framework`` and ``corsheaders`` are dependencies and must be
installed.

2.) Configuration is namespaced unter ``AI_KIT_AUTH`` like so:

::

    AI_KIT_AUTH = {
        "ACTIVATION_ROUTE": "activation",
        "FRONTEND_URL": "example.com",
        # ...
    }

Note that ``FRONTEND_URL`` is a required configuration that does not have a
default. Default configurations are:

::

    AI_KIT_AUTH = {
        "ACTIVATION_ROUTE": "activation",
        "EMAIL_TEMPLATE_USER_CREATED_TITLE": "user_created_title.txt",
        "EMAIL_TEMPLATE_USER_CREATED_BODY_PLAINTEXT": "user_created_body.txt",
        "EMAIL_TEMPLATE_USER_CREATED_BODY_HTML": "user_created_body.html",
        "USERNAME_REQUIRED": False,
        "FRONTEND_URL": None,
    }

In addition to that some general configuration is required:

::

    CORS_ORIGIN_WHITELIST = [
        "http://localhost:8000",
        "http://localhost:3000",
        # add other front-end backend urls
    ]

    CORS_ALLOW_CREDENTIALS = True

    # otherwise authentification to the django admin and the frontend can
    # interfere with eath other
    CSRF_USE_SESSIONS = True

    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:8000",
        "http://localhost:3000",
        # add other front-end backend urls
    ]

See the
`django-cors-headers <https://github.com/adamchainz/django-cors-headers>`__
for details.

3.) Include the routes in your ``urls.py``:

::

    urlpatterns = [
        # ...
        re_path("^api/v1/", include("ai_kit.urls"))
        # ...
    ]

4.) Run ``python manage.py migrate``. Only required if you add the
dependencies
to your project since this package does not define models on its own.
