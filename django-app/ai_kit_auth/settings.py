"""
Settings module for ai_kit_auth.

Settings are namespaces under AI_KIT_AUTH in
the settings module. So your projects settings.py might look like

AI_KIT_AUTH = {
    "ACTIVATION_ROUTE": "aktivierung",
    ...
}

To access the settings, a api_settings object is provided that gives back the
configured settings or falls back on defaults
"""

from django.conf import settings
from django.test.signals import setting_changed

DEFAULTS = {
    "ACTIVATION_ROUTE": "activation",
    "EMAIL_TEMPLATE_USER_CREATED_TITLE": "user_created_title.txt",
    "EMAIL_TEMPLATE_USER_CREATED_BODY_PLAINTEXT": "user_created_body.txt",
    "EMAIL_TEMPLATE_USER_CREATED_BODY_HTML": "user_created_body.html",
    "USERNAME_REQUIRED": False,
    "FRONTEND_URL": None,
}


class UnkownConfigurationError(Exception):
    pass


class InvalidConfigurationError(Exception):
    pass


class APISettings:
    """
    The settings are implemented as an object for two reasons: it allows access
    to the configuration parameters as properties and it enables validation
    of the settings.

    In your code you can use this object like so:

    from ai_kit_auth.settings import api_settings
    print(api_settings.ACTIVATION_ROUTE)
    """

    def __init__(self, user_settings={}):
        for setting in user_settings:
            if setting not in DEFAULTS:
                raise UnkownConfigurationError(setting)
        self._settings = {**DEFAULTS, **user_settings}

        # specialized validation
        if not self._settings["FRONTEND_URL"]:
            raise InvalidConfigurationError(
                "Please configure FRONTEND_URL in the AI_KIT_AUTH namespace"
            )

    def __getattr__(self, attr):
        return self._settings[attr]


api_settings = APISettings(getattr(settings, "AI_KIT_AUTH", {}))


def reload_api_settings(*args, **kwargs):
    setting = kwargs["setting"]
    if setting == "AI_KIT_AUTH":
        global api_settings
        api_settings = APISettings(getattr(settings, "AI_KIT_AUTH", {}))


setting_changed.connect(reload_api_settings)
