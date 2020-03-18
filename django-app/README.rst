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
        "FRONTEND": {
            "URL": "example.com",
        },
        # ...
    }

Note that ``FRONTEND.URL`` is a required configuration that does not have a
default. Default configurations are:

::

    DEFAULTS = {
        # Templates for all the email notifications to the user
        "EMAIL_TEMPLATES": {
            # is send when the user is created by registration
            "USER_CREATED": {
                "TITLE": "ai_kit_auth/user_created_title.txt",
                "BODY_PLAINTEXT": "ai_kit_auth/user_created_body.txt",
                "BODY_HTML": "ai_kit_auth/user_created_body.html",
            },
            # is send to the user after they triggered the forget password
            # feature. Contains the time limited password reset link
            "RESET_PASSWORD": {
                "TITLE": "ai_kit_auth/reset_password_title.txt",
                "BODY_PLAINTEXT": "ai_kit_auth/reset_password_body.txt",
                "BODY_HTML": "ai_kit_auth/reset_password_body.html",
            },
        },
        # If true, the user has to specify a username in addition to the
        # mail address
        "USERNAME_REQUIRED": False,
        # information about the frontend, mostly the used routes. In most cases
        # the defaults are fine, but can be changed for localisation of the
        # urls.
        # Only the actual frontend url is unset and you will get an
        # configuration error if you don't specify it.
        "FRONTEND": {
            "URL": "",
            "ACTIVATION_ROUTE": "/auth/activation/",
            "RESET_PW_ROUTE": "/auth/reset_password/",
        },
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
