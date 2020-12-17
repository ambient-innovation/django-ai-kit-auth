django-ai-kit-auth
==================

django-ai-kit-auth bundles everything authentication related and is meant to
work seamlessly with the ai-kit-auth react component.

It provides routes for login, password validation, password reset, registration
and account verification.

It also handles email notifications on registration and password reset. Look
at the template section of the settings to configure the email templates.

It works with the standard django and with a custom user model as
long as its provides an email address.

Standard Django sessions are used for authentification.

Index
-----

* `Quick Start`_

* `Api Documentation`_
    * `Login`_
    * `Logout`_
    * `Me`_
    * `Registration`_
    * `Initiate Password Reset`_
    * `Password Reset`_
    * `Validate Password`_
    * `Activate User`_

* `Error Codes`_


Quick Start
-----------

1.) Add ``ai_kit_auth`` to your ``INSTALLED_APPS`` like so:

::

    INSTALLED_APPS = (
        # ...
        "rest_framework",
        # ...
        "ai_kit_auth",
        # ...
        "corsheaders",
    )

``rest_framework`` from the pip package ``djangorestframework`` and ``corsheaders``
from the pip package ``django-cors-headers`` are dependencies and must be
installed.

The cors headers middleware has to be put into the middleware configuration
like so:

::

    MIDDLEWARE = (
        "corsheaders.middleware.CorsMiddleware",
        # ...
    )

This middleware has to be put as high as possible in the middlware list.

For more details see the
`django-cors-headers <https://github.com/adamchainz/django-cors-headers>`__
documentation.

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
        # You can disable any or all of the endpoints created by ai-kit-auth
        # by setting the respective entry in this section to False.
        "ENABLE_ENDPOINTS": {
            "LOGIN": True,
            # Route to activate an email address after registration
            "ACTIVATE_EMAIL": True,
            "LOGOUT": True,
            # Endpoint which checks whether the client making the request is
            # logged in, and if so returns user information
            "ME": True,
            # endpoint to check whether the backend will accept a certain password
            "VALIDATE_PASSWORD": True,
            # Calling this endpoint triggers an email for password recovery to be sent
            "SEND_PW_RESET_MAIL": True,
            # endpoint for actually changing the password
            "RESET_PASSWORD": True,
            # registers a new user
            "REGISTER": True,
        },
        # Templates for all the email notifications to the user
        "EMAIL_TEMPLATES": {
            # Here you can supply a function taking no arguments and returning
            # a dictionary with entries, that you would like to pass to the
            # email template in case you want to provide your own.
            # By default it points to a function that returns an empty dictionary.
            "CUSTOM_DATA_FUNCTION": "ai_kit_auth.services.custom_email_data",
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
        # If you need complete control over how the activation email is sent,
        # override this setting with your own function. Ai-kit-auth will pass
        # two arguments: a user object and url as a string, which points to the
        # frontend page which needs to be visited in order to activate the account
        "SEND_USER_ACTIVATION_MAIL": "ai_kit_auth.services.default_send_user_activation_mail",
        # If you need complete control over how the activation email is sent,
        # override this setting with your own function. Ai-kit-auth will pass
        # two arguments: a user object and url as a string, which points to the
        # frontend page which needs to be visited in order to activate the account
        "SEND_ACTIVATION_BY_ADMIN_MAIL": "ai_kit_auth.services.default_send_activation_by_admin_mail",
        # If you need complete control over how the password reset email is sent,
        # override this setting with your own function. Ai-kit-auth will pass
        # two arguments: a user object and url as a string, which points to the
        # frontend page which needs to be visited in order to reset the password
        "SEND_RESET_PW_MAIL": "ai_kit_auth.services.default_send_reset_pw_mail",
        # Set this to False to prevent ai-kit-auth to register its own admin forms
        # with django admin. It will then use the default admin forms from
        # django.contrib.auth.admin or your own forms.
        "USE_AI_KIT_AUTH_ADMIN": True,
        # If you want to configure the layout of the admin form or you use a
        # use model doesn't have all the fields you need, you can supply your
        # own fieldsets.
        "ADMIN_FIELDSETS": (
            (None, {"fields": ("username", "email", "password")}),
            (_("Personal info"), {"fields": ("first_name", "last_name")}),
            (
                _("Permissions"),
                {
                    "fields": (
                        "is_active",
                        "is_staff",
                        "is_superuser",
                        "groups",
                        "user_permissions",
                    ),
                },
            ),
            (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        ),
        "ADMIN_ADD_FIELDSETS": (
            (
                None,
                {
                    "classes": ("wide",),
                    "fields": ("username", "email", "password1", "password2"),
                },
            ),
        ),
        # If true, the user has to specify a username in addition to the
        # mail address
        "USERNAME_REQUIRED": False,
        # A Serializer which is used by the ai-kit-auth endpoints for
        # sending user information to the frontend. Override it if you need
        # additional information about a user in the frontend, like e.g. avatar
        # image, user role etc.
        # The default USER_SERIALIZER contains id, email and username.
        "USER_SERIALIZER": "ai_kit_auth.serializers.UserSerializer",
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

    CSRF_USE_SESSIONS = True

    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:8000",
        "http://localhost:3000",
        # add other front-end backend urls
    ]

The ``CSRF_USE_SESSIONS`` configuration doesn't need to be set to enable
Ai-Kit-Auth, but in prevents problems with double logins, for example
if a user is logged into the Admin interface and also logged in the
frontend. Django saves CSRF tokens in cookies by default.

Please note that ``CORS_ORIGIN_WHITELIST`` takes the whole URL including the scheme (e.g. 'http://'), whereas ``CSRF_TRUSTED_ORIGINS`` takes
**only** the domain, for example: "example.org".


3.) Include the routes in your ``urls.py``:

::

    urlpatterns = [
        # ...
        path("api/v1/auth/", include("ai_kit_auth.urls"))
        # ...
    ]

4.) Run ``python manage.py migrate``. Only required if you add the
dependencies
to your project since this package does not define models on its own.


Api Documentation
=================

Of course you don't have to use the front and backend components in tandem.
But if you start to mix and match, you have to speak to the Rest-API directly.

To do that, here are the endpoints:


Login
------

POST ``../login/``

visibility: everyone

expects

::

    {
        ident: <username or email>,
        password: <the password>
    }


both fields are required. The endpoint answers with the status code 200
and

::

    {
        user: {
            username: <the username>,
            email: <the email address>,
            id: <the internal id>,
        },
        csrf: <csrf token>
    }


Error cases:

Field specific errors are given back like so:

::

    {
        <field name>: <error code>
    }


fields are ``ident`` or ``password`` and the only possible error code is ``blank``.

Errors that are not field specific are mapped to the key ``non_field_errors``.
Currently, the only error code that can be returned here is ``invalid_credentials``.


Logout
------

POST ``../logout/``

visibility: authenticated users

expects

::

    {}


and answers with status code 200 and

::

    {
        csrf: <csrf token>
    }


At least when the csrf token is stored via session storage, it changes
at logout and you have to update it in the frontend.


Me
-----------

GET ``../me/``

visibility: everyone

The answer is very similar to login: status code 200 and

::

    {
        user: null | {
            username: <the username>,
            email: <the email address>,
            id: <the internal id>,
        },
        csrf: <csrf token>
    }


The only difference is that me is reachable for anonymous users that
are not (yet) logged in. In that case, the user property is set to
``null``.


Registration
============

POST ``register``


visibility: everyone

expects

::

    {
        "username": <username, only if the USERNAME_REQUIRED option is set>,
        "email": <email>,
        "password": <password>,
    }


and answers with status code 201 and

::

    {}

or errors out with status code 400 because fields is missing or the password
validation fails.


Initiate Password Reset
=======================

POST ``send_pw_reset_email``

visibility: everyone

expects

::

    {
        "email": <email>,
    }


and answers with status code 200

::

    {}

This endpoint never gives back errors to not give out unnecessary information.

Password Reset
==============

POST ``reset_password``


visibility: everyone

expects

::

    {
        "ident": <identifer for the user, from the reset link>,
        "token": <reset token, from the reset link>,
        "password": <password>,
    }


and answers with status code 200 and

::

    {}

On error, status code 400 is given back and the errors can be missing fields,
``reset_password_link_invalid`` for invalid identifiers or token or the standard
invalid password errors.

Validate Password
=================

POST ``validate_password``


visibility: everyone

expects

::

    {
        "ident": <identifier>,
        "username": <username>,
        "email": <email>,
        "password": <password>,
    }

you have to supply either ident or both username and email if
``USERNAME_REQUIRED`` is configured. Otherwise you have to supply either ident
or email.


and answers with status code 200 and

::

    {}

if the password respects all the configured password validators or it errors out
on status code 400 and gives back the respective error code to indicate what
rule was violated.

Activate User
=============

POST ``activate_email``

expects

::

    {
        "ident": <identifer for the user, from the reset link>,
        "token": <reset token, from the reset link>,
    }


and answers with status code 200 and

::

    {}

or errors out on status code 400 with the ``activation_link_invalid`` error
code.

Error Codes
-----------

The backend never sends user facing error messages, but general error codes.
Internationalisation happens in the frontend.

+---------------------------+--------------------------------------------------+
| error code                | possible user facing message                     |
+===========================+==================================================+
| `blank`                   | This field may not be blank.                     |
+---------------------------+--------------------------------------------------+
| `username_unique`         | This username has already been taken.            |
+---------------------------+--------------------------------------------------+
| `password_too_short`      | Password too short, it should contain at least 8 |
|                           | characters.                                      |
+---------------------------+--------------------------------------------------+
| `password_too_similar`    | Password too similar to your username or email   |
|                           | address.                                         |
+---------------------------+--------------------------------------------------+
| `password_too_common`     | The password you've entered is too common and    |
|                           | thus unsafe. Please try to think of something    |
|                           | else.                                            |
+---------------------------+--------------------------------------------------+
| `passwords_not_identical` | Both passwords entered are not identical.        |
+---------------------------+--------------------------------------------------+
| `invalid_credentials`     | The combination of username (or email, depending |
|                           | on configuration) and password is invalid. Please|
|                           | try again.                                       |
+---------------------------+--------------------------------------------------+
| `activation_link_invalid` | The activation link you tried to use is invalid. |
|                           | This may be due to a typo, or because it has     |
|                           | been used already.                               |
+---------------------------+--------------------------------------------------+
