from django.test import TestCase

# from django.urls import reverse
# from django.contrib.auth.models import User
# from rest_framework import status
# from rest_framework.test import APITestCase
# from model_bakery import baker

PASSWORD = "jafsdfah24agdsfghasdf"


class DummyTest(TestCase):
    def test_dummy(self):
        self.assertTrue(True)


# class LoginTests(APITestCase):
#     def test_login_username(self):
#         """"
#         create standard user ai_kit_auth, log it in
#         """
#         user = baker.make(User)
#         url = reverse("rest_login")
#         response = self.client.post(
#             url, {"email_or_username": user.username, "password": PASSWORD}
#         )
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
