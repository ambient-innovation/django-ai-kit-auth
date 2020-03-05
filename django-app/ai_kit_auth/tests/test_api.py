from django.urls import reverse

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from model_bakery import baker

PASSWORD = "jafsdfah24agdsfghasdf"
EMAIL = "example@example.com"
UserModel = get_user_model()


class LoginTests(APITestCase):
    def setUp(self) -> None:
        self.user = baker.make(UserModel, email=EMAIL)
        self.user.set_password(PASSWORD)
        self.user.save()

        self.login_url = reverse("auth_login")
        self.me_url = reverse("auth_me")
        self.validate_password_url = reverse("auth_validate_password")

    def test_login_with_username(self):
        response = self.client.post(
            self.login_url,
            {"ident": self.user.username, "password": PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["id"], self.user.id)
        self.assertEqual(response.data["email"], self.user.email)

    def test_login_with_email(self):
        response = self.client.post(
            self.login_url,
            {"ident": self.user.email, "password": PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["id"], self.user.id)
        self.assertEqual(response.data["email"], self.user.email)

    def test_login_wrong_pw(self):
        response = self.client.post(
            self.login_url,
            {"ident": self.user.email, "password": "wrong" + PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_access_protected(self):
        self.client.login(username=self.user.username, password=PASSWORD)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["username"], self.user.username)

    def test_access_protected_fail(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_validate_password(self):
        response = self.client.post(
            self.validate_password_url,
            {"password": "longandvalidpassword", "ident": "username"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalidate_password(self):
        response = self.client.post(
            self.validate_password_url,
            {"password": "username", "ident": "username"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
