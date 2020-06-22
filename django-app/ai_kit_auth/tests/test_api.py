from unittest.mock import Mock, patch
from django.urls import reverse
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.middleware.csrf import _compare_salted_tokens
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from model_bakery import baker
from ai_kit_auth import services

from ai_kit_auth.signals import (
    user_pre_login,
    user_post_login,
    user_pre_logout,
    user_post_logout,
    user_pre_registered,
    user_post_registered,
    user_pre_activated,
    user_post_activated,
    user_pre_forgot_password,
    user_post_forgot_password,
    user_pre_reset_password,
    user_post_reset_password,
)

PASSWORD = "jafsdfah24agdsfghasdf"
EMAIL = "example@example.com"
UserModel = get_user_model()

login_url = reverse("ai_kit_auth:login")
logout_url = reverse("ai_kit_auth:logout")
me_url = reverse("ai_kit_auth:me")
validate_password_url = reverse("ai_kit_auth:validate_password")
activate_url = reverse("ai_kit_auth:activate")
register_url = reverse("ai_kit_auth:register")
send_pw_reset_email_url = reverse("ai_kit_auth:send_pw_reset_email")
pw_reset_url = reverse("ai_kit_auth:pw_reset")


class AuthTestCase(APITestCase):
    def setUp(self) -> None:
        self.user = baker.make(UserModel, email=EMAIL)
        self.user.set_password(PASSWORD)
        self.user.save()

        self.client.logout()

    def isLoggedIn(self) -> bool:
        user_id = self.client.session.get("_auth_user_id", None)
        return user_id is not None and int(user_id) == self.user.id


class LoginTests(AuthTestCase):
    def test_login_with_username(self):
        self.assertFalse(self.isLoggedIn())
        response = self.client.post(
            login_url,
            {"ident": self.user.username, "password": PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("csrf" in response.data)
        self.assertEqual(response.data["user"]["username"], self.user.username)
        self.assertEqual(response.data["user"]["id"], self.user.id)
        self.assertEqual(response.data["user"]["email"], self.user.email)
        self.assertTrue(self.isLoggedIn())

    def test_login_with_email(self):
        self.assertFalse(self.isLoggedIn())
        response = self.client.post(
            login_url, {"ident": self.user.email, "password": PASSWORD}, format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("csrf" in response.data)
        self.assertEqual(response.data["user"]["username"], self.user.username)
        self.assertEqual(response.data["user"]["id"], self.user.id)
        self.assertEqual(response.data["user"]["email"], self.user.email)
        self.assertTrue(self.isLoggedIn())

    def test_login_wrong_pw(self):
        self.assertFalse(self.isLoggedIn())
        response = self.client.post(
            login_url,
            {"ident": self.user.email, "password": "wrong" + PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(self.isLoggedIn())

    @patch("ai_kit_auth.views.login")
    def test_login_emits_signals(self, mock_login):
        received = Mock()

        def receiver_pre(sender, user, **kwargs):
            mock_login.assert_not_called()
            received(pre=True)

        def receiver_post(sender, user, **kwargs):
            mock_login.assert_called()
            received(post=True)

        user_pre_login.connect(receiver_pre)
        user_post_login.connect(receiver_post)

        self.client.post(
            login_url,
            {"ident": self.user.username, "password": PASSWORD},
            format="json",
        )

        user_pre_login.disconnect(receiver_pre)
        user_post_login.disconnect(receiver_post)

        received.assert_any_call(pre=True)
        received.assert_any_call(post=True)

    def test_csrf_token_after_login(self):
        response = self.client.post(
            login_url,
            {"ident": self.user.username, "password": PASSWORD},
            format="json",
        )
        self.assertTrue(
            _compare_salted_tokens(
                response.cookies["csrftoken"].value, response.data["csrf"]
            )
        )


class MeViewTests(AuthTestCase):
    def setUp(self) -> None:
        self.user = baker.make(UserModel, email=EMAIL)
        self.user.set_password(PASSWORD)
        self.user.save()

        self.client.logout()

    def test_access_protected(self):
        self.client.login(username=self.user.username, password=PASSWORD)
        response = self.client.get(me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("csrf" in response.data)
        self.assertEqual(response.data["user"]["email"], self.user.email)
        self.assertEqual(response.data["user"]["username"], self.user.username)

    def test_access_me_not_logged_in(self):
        response = self.client.get(me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("csrf" in response.data)
        self.assertEqual(response.data["user"], None)

    def test_custom_user_serializer(self):
        self.client.login(username=self.user.username, password=PASSWORD)
        response = self.client.get(me_url)
        self.assertTrue("is_active" in response.data["user"])


class LogoutTests(AuthTestCase):
    def test_logout(self):
        self.client.login(username=self.user.username, password=PASSWORD)
        self.assertTrue(self.isLoggedIn())
        response = self.client.post(logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(self.isLoggedIn())

    @patch("ai_kit_auth.views.logout")
    def test_logout_emits_signals(self, mock_logout):
        self.client.login(username=self.user.username, password=PASSWORD)
        received = Mock()

        def receiver_pre(sender, user, **kwargs):
            mock_logout.assert_not_called()
            received(pre=True)

        def receiver_post(sender, user, **kwargs):
            mock_logout.assert_called()
            received(post=True)

        user_pre_logout.connect(receiver_pre)
        user_post_logout.connect(receiver_post)

        response = self.client.post(logout_url)

        user_pre_logout.disconnect(receiver_pre)
        user_post_logout.disconnect(receiver_post)

        received.assert_any_call(pre=True)
        received.assert_any_call(post=True)

    def test_access_protected_fail(self):
        self.assertFalse(self.isLoggedIn())
        response = self.client.post(logout_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ValidatePasswordTests(AuthTestCase):
    def test_validate_password(self):
        response = self.client.post(
            validate_password_url,
            {
                "password": "longandvalidpassword",
                "username": "username",
                "email": EMAIL,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_validate_password_with_ident(self):
        ident = str(services.scramble_id(self.user.pk))
        response = self.client.post(
            validate_password_url,
            {"password": PASSWORD, "ident": ident,},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_validate_password_fail(self):
        response = self.client.post(
            validate_password_url,
            {"password": "username", "username": "username", "email": EMAIL},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ActivateEmailTests(AuthTestCase):
    def test_activate_user(self):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        ident, token = services.send_user_activation_mail(user)
        response = self.client.post(
            activate_url, {"ident": ident, "token": token}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # we have to get the user object again to see the updates
        self.assertTrue(UserModel.objects.get(pk=user.id).is_active)

    def test_activate_user_emits_signals(self):
        received = Mock()

        def receiver_pre(sender, user, **kwargs):
            self.assertFalse(user.is_active)
            received(pre=True)

        def receiver_post(sender, user, **kwargs):
            self.assertTrue(user.is_active)
            received(post=True)

        user_pre_activated.connect(receiver_pre)
        user_post_activated.connect(receiver_post)

        user = baker.make(UserModel, is_active=False, email="to@example.com")
        ident, token = services.send_user_activation_mail(user)
        response = self.client.post(
            activate_url, {"ident": ident, "token": token}, format="json"
        )

        user_pre_activated.disconnect(receiver_pre)
        user_post_activated.disconnect(receiver_post)

        received.assert_any_call(pre=True)
        received.assert_any_call(post=True)


class ResetPWTests(AuthTestCase):
    def test_init_password_reset(self):
        response = self.client.post(send_pw_reset_email_url, {"email": self.user.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("ai_kit_auth.views.services.send_reset_pw_mail")
    def test_init_password_reset_emits_signals(self, mock_service):
        received = Mock()

        def receiver_pre(sender, user, **kwargs):
            mock_service.assert_not_called()
            received(pre=True)

        def receiver_post(sender, user, **kwargs):
            mock_service.assert_called()
            received(post=True)

        user_pre_forgot_password.connect(receiver_pre)
        user_post_forgot_password.connect(receiver_post)

        response = self.client.post(send_pw_reset_email_url, {"email": self.user.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user_pre_forgot_password.disconnect(receiver_pre)
        user_post_forgot_password.disconnect(receiver_post)

        received.assert_any_call(pre=True)
        received.assert_any_call(post=True)

    def test_init_password_reset_fail(self):
        response = self.client.post(
            send_pw_reset_email_url, {"email": "invalid_email@example.com"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_password(self):
        new_password = "new_awesome_password"
        # manually create reset session
        ident = str(services.scramble_id(self.user.pk))
        token_gen = PasswordResetTokenGenerator()
        token = token_gen.make_token(self.user)

        response = self.client.post(
            pw_reset_url,
            {"password": new_password, "ident": ident, "token": token},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(
            authenticate(username=self.user.username, password=new_password)
        )

    def test_reset_password_emits_signals(self):
        received = Mock()

        def receiver_pre(sender, user, **kwargs):
            self.assertIsNone(
                authenticate(username=self.user.username, password=new_password)
            )
            received(pre=True)

        def receiver_post(sender, user, **kwargs):
            self.assertIsNotNone(
                authenticate(username=self.user.username, password=new_password)
            )
            received(post=True)

        user_pre_reset_password.connect(receiver_pre)
        user_post_reset_password.connect(receiver_post)

        new_password = "new_awesome_password"
        # manually create reset session
        ident = str(services.scramble_id(self.user.pk))
        token_gen = PasswordResetTokenGenerator()
        token = token_gen.make_token(self.user)

        response = self.client.post(
            pw_reset_url,
            {"password": new_password, "ident": ident, "token": token},
            format="json",
        )
        user_pre_reset_password.disconnect(receiver_pre)
        user_post_reset_password.disconnect(receiver_post)

        received.assert_any_call(pre=True)
        received.assert_any_call(post=True)

    def test_reset_password_invalid_token(self):
        new_password = "new_awesome_password"
        ident = str(services.scramble_id(self.user.pk))
        response = self.client.post(
            pw_reset_url,
            {"password": new_password, "ident": ident, "token": "notavalidtoken"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RegisterTests(AuthTestCase):
    def test_register_user(self):
        response = self.client.post(
            register_url,
            {
                "username": "testuser",
                "email": "testuser@example.com",
                "password": PASSWORD,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = UserModel.objects.get(email="testuser@example.com")
        self.assertEqual(user.username, "testuser")
        self.assertFalse(user.is_active)
        # Make sure that password is not stored in plain text
        self.assertNotEqual(user.password, PASSWORD)

    def test_register_user_emits_signals(self):
        received = Mock()

        def receiver_pre(sender, user_data, **kwargs):
            self.assertFalse(
                UserModel.objects.filter(username=user_data["username"]).exists()
            )
            received(pre=True)

        def receiver_post(sender, user, **kwargs):
            self.assertIsNotNone(user.pk)
            received(post=True)

        user_pre_registered.connect(receiver_pre)
        user_post_registered.connect(receiver_post)

        response = self.client.post(
            register_url,
            {
                "username": "testuser_emit_signals",
                "email": "testuser_emit_signals@example.com",
                "password": PASSWORD,
            },
            format="json",
        )
        user_pre_registered.disconnect(receiver_pre)
        user_post_registered.disconnect(receiver_post)

        received.assert_any_call(pre=True)
        received.assert_any_call(post=True)

    def test_register_user_same_username_fail(self):
        response = self.client.post(
            register_url,
            {
                "username": self.user.username,
                "email": "testuser@example.de",
                "password": PASSWORD,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(str(response.data["username"][0]), "username_unique")

    def test_register_user_same_email_fail(self):
        response = self.client.post(
            register_url,
            {"username": "testuser", "email": self.user.email, "password": PASSWORD,},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(str(response.data["email"][0]), "email_unique")

    def test_register_user_invalid_password_fail(self):
        response = self.client.post(
            register_url,
            {
                "username": "testuser",
                "email": "testuser@example.com",
                "password": "short",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(str(response.data["password"][0]), "password_too_short")

    def test_register_blank_username_when_not_required(self):
        response = self.client.post(
            register_url,
            {"username": "", "email": "a@example.com", "password": PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_required_email_error(self):
        response = self.client.post(
            register_url,
            {"username": "username123", "password": PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(str(response.data["email"][0]), "required")

    def test_register_blank_email_error(self):
        response = self.client.post(
            register_url,
            {"username": "username123", "email": "", "password": PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue("blank" in response.data["email"])

    def test_password_too_short_error(self):
        response = self.client.post(
            register_url,
            {
                "username": "newuser42",
                "email": "lasjdvh@example.com",
                "password": "b3dkjA3",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue("password_too_short" in response.data["password"])
