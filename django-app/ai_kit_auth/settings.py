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
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from importlib import import_module

DEFAULTS = {
    "EMAIL_TEMPLATES": {
        "USER_CREATED": {
            "TITLE": "ai_kit_auth/user_created_title.txt",
            "BODY_PLAINTEXT": "ai_kit_auth/user_created_body.txt",
            "BODY_HTML": "ai_kit_auth/user_created_body.html",
        },
        "RESET_PASSWORD": {
            "TITLE": "ai_kit_auth/reset_password_title.txt",
            "BODY_PLAINTEXT": "ai_kit_auth/reset_password_body.txt",
            "BODY_HTML": "ai_kit_auth/reset_password_body.html",
        },
        "SET_PASSWORD": {
            "TITLE": "ai_kit_auth/reset_password_title.txt",
            "BODY_PLAINTEXT": "ai_kit_auth/reset_password_body.txt",
            "BODY_HTML": "ai_kit_auth/reset_password_body.html",
        },
    },
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
    "USERNAME_REQUIRED": False,
    "USER_SERIALIZER": "ai_kit_auth.serializers.UserSerializer",
    "FRONTEND": {
        "URL": "",
        "ACTIVATION_ROUTE": "/auth/activation/",
        "RESET_PW_ROUTE": "/auth/reset-password/",
    },
}


class UnknownConfigurationError(Exception):
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
    print(api_settings.FRONTEND.ACTIVATION_ROUTE)
    """

    def __init__(self, user_settings, default=DEFAULTS):
        for setting in user_settings:
            if setting not in default:
                raise UnknownConfigurationError(setting)
            elif not isinstance(user_settings[setting], type(default[setting])):
                raise InvalidConfigurationError(
                    f"Type of setting {setting} should be {type(default[setting])}, "
                    f"but was {type(user_settings[setting])}."
                )

        merged = {**default, **user_settings}
        self._settings = {
            k: APISettings.convert_settings_node(v, default[k])
            for k, v in merged.items()
        }

    def __getattr__(self, attr):
        if attr == "USER_SERIALIZER" and type(self._settings[attr]) == str:
            module, name = self._settings[attr].rsplit(".", 1)
            self._settings[attr] = getattr(import_module(module), name)
        return self._settings[attr]

    @classmethod
    def convert_settings_node(cls, node, default):
        if isinstance(node, dict):
            return cls(node, default)
        return node


api_settings = APISettings(getattr(settings, "AI_KIT_AUTH", {}))


@receiver(setting_changed)
def reload_api_settings(*args, **kwargs):
    setting = kwargs["setting"]
    if setting == "AI_KIT_AUTH":
        global api_settings
        api_settings = APISettings(getattr(settings, "AI_KIT_AUTH", {}))

        # specialized validation
        if not api_settings.FRONTEND.URL:
            raise InvalidConfigurationError(
                "Please configure FRONTEND_URL in the AI_KIT_AUTH namespace"
            )
