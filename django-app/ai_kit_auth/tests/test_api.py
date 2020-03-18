from django.urls import reverse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.middleware.csrf import _compare_salted_tokens
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from model_bakery import baker
from .. import services

PASSWORD = "jafsdfah24agdsfghasdf"
EMAIL = "example@example.com"
UserModel = get_user_model()


class LoginTests(APITestCase):
    def setUp(self) -> None:
        self.user = baker.make(UserModel, email=EMAIL)
        self.user.set_password(PASSWORD)
        self.user.save()

        self.login_url = reverse("ai_kit_auth:login")
        self.logout_url = reverse("ai_kit_auth:logout")
        self.me_url = reverse("ai_kit_auth:me")
        self.validate_password_url = reverse("ai_kit_auth:validate_password")
        self.send_pw_reset_email_url = reverse("ai_kit_auth:send_pw_reset_email")
        self.pw_reset_url = reverse("ai_kit_auth:pw_reset")
        self.client.logout()

    def isLoggedIn(self) -> bool:
        user_id = self.client.session.get("_auth_user_id", None)
        return user_id is not None and int(user_id) == self.user.id

    def test_login_with_username(self):
        self.assertFalse(self.isLoggedIn())
        response = self.client.post(
            self.login_url,
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
            self.login_url,
            {"ident": self.user.email, "password": PASSWORD},
            format="json",
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
            self.login_url,
            {"ident": self.user.email, "password": "wrong" + PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(self.isLoggedIn())

    def test_access_protected(self):
        self.client.login(username=self.user.username, password=PASSWORD)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("csrf" in response.data)
        self.assertEqual(response.data["user"]["email"], self.user.email)
        self.assertEqual(response.data["user"]["username"], self.user.username)

    def test_access_me_not_logged_in(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("csrf" in response.data)
        self.assertEqual(response.data["user"], None)

    def test_logout(self):
        self.client.login(username=self.user.username, password=PASSWORD)
        self.assertTrue(self.isLoggedIn())
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(self.isLoggedIn())

    def test_access_protected_fail(self):
        self.assertFalse(self.isLoggedIn())
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_validate_password(self):
        response = self.client.post(
            self.validate_password_url,
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
            self.validate_password_url,
            {"password": PASSWORD, "ident": ident,},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_validate_password_fail(self):
        response = self.client.post(
            self.validate_password_url,
            {"password": "username", "username": "username", "email": EMAIL},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_activate_user(self):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        ident, token = services.send_user_activation_mail(user)
        response = self.client.post(
            reverse("ai_kit_auth:activate", args=[ident, token])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # we have to get the user object again to see the updates
        self.assertTrue(UserModel.objects.get(pk=user.id).is_active)

    def test_csrf_token_after_login(self):
        response = self.client.post(
            self.login_url,
            {"ident": self.user.username, "password": PASSWORD},
            format="json",
        )
        self.assertTrue(
            _compare_salted_tokens(
                response.cookies["csrftoken"].value, response.data["csrf"]
            )
        )

    def test_init_password_reset(self):
        response = self.client.post(
            self.send_pw_reset_email_url, {"email": self.user.email}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_init_password_reset_fail(self):
        response = self.client.post(
            self.send_pw_reset_email_url, {"email": "invalid_email@example.com"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_password(self):
        new_password = "new_awesome_password"
        # manually create reset session
        ident = str(services.scramble_id(self.user.pk))
        token_gen = PasswordResetTokenGenerator()
        token = token_gen.make_token(self.user)

        response = self.client.post(
            self.pw_reset_url,
            {"password": new_password, "ident": ident, "token": token},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(self.isLoggedIn())
        self.client.post(
            self.login_url,
            {"ident": self.user.username, "password": new_password},
            format="json",
        )
        self.assertTrue(self.isLoggedIn())

    def test_reset_password_fail(self):
        new_password = "new_awesome_password"
        ident = str(services.scramble_id(self.user.pk))
        response = self.client.post(
            self.pw_reset_url,
            {"password": new_password, "ident": ident, "token": "notavalidtoken"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
