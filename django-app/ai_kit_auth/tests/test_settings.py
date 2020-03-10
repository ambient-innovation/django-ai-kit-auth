from unittest import TestCase
from unittest.mock import patch

from ai_kit_auth.settings import (
    APISettings,
    UnknownConfigurationError,
    InvalidConfigurationError,
    reload_api_settings,
)


class APISettingsTests(TestCase):
    def test_raises_if_unknown_setting(self):
        user_settings = {"NOT_A_KEY_IN_DEFAULT": "value"}
        with self.assertRaises(UnknownConfigurationError):
            APISettings(user_settings)

    def test_raises_if_improper_setting(self):
        user_settings = {"USERNAME_REQUIRED": "yes"}
        with self.assertRaises(InvalidConfigurationError):
            APISettings(user_settings)

    def test_values_are_overridden(self):
        user_settings = {"USERNAME_REQUIRED": True}
        api_settings = APISettings(user_settings)
        self.assertEqual(
            user_settings["USERNAME_REQUIRED"], api_settings.USERNAME_REQUIRED
        )

    def test_conversion_is_nested(self):
        api_settings = APISettings({})
        self.assertEqual(api_settings.FRONTEND.URL, "")


class ReloadAPISettingsTests(TestCase):
    @patch("ai_kit_auth.settings.settings")
    def test_raises_if_FRONTEND_URL_is_not_set(self, mock_settings):
        mock_settings["AI_KIT_AUTH"] = {}
        with self.assertRaises(InvalidConfigurationError):
            reload_api_settings(setting="AI_KIT_AUTH")
