from unittest.mock import patch
import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core import mail
from model_bakery import baker
from ai_kit_auth.services import (
    scramble_id,
    send_user_activation_mail,
    send_reset_pw_mail,
    send_email,
    make_url,
)


UserModel = get_user_model()


class FeistelChipherTest(TestCase):
    def test_invertable(self):
        for i in list(range(1000)) + [4020, 19432, 599299398]:
            encoded = scramble_id(i)
            self.assertNotEqual(i, encoded)
            self.assertEqual(i, scramble_id(encoded))

    def test_int_as_string(self):
        for i in list(range(1000)) + [4020, 19432, 599299398]:
            encoded = scramble_id(str(i))
            self.assertNotEqual(i, encoded)
            self.assertEqual(i, scramble_id(encoded))

    def test_identity_if_not_int(self):
        ident = "test"
        self.assertEqual(ident, scramble_id(ident))

    def test_out_of_range(self):
        for i in [-1, 0x100000000, 0x29943929990, "string", uuid.uuid4()]:
            self.assertEqual(i, scramble_id(i))


class MailTests(TestCase):
    def test_send_email(self):
        subject = "subject"
        text = "plain text"
        html = "<h1>HTML Version</h1>"
        to_address = "recipient@example.com"
        send_email(subject, text, html, to_address)
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertEqual(email.subject, subject)
        self.assertEqual(email.body, text)
        self.assertEqual(email.alternatives[0][0], html)
        self.assertEqual(email.to, [to_address])


class MakeURLTests(TestCase):
    def test_concatenates_arguments(self):
        args = [str(i) for i in range(10)]
        self.assertEqual(make_url(*args), "/".join(args))

    def test_strips_slashes(self):
        args = [f"/{i}/" for i in range(10)]
        self.assertEqual(make_url(*args), "/".join(str(i) for i in range(10)))


class ActivationTest(TestCase):
    @patch("ai_kit_auth.services.send_email")
    def test_send_activation_mail(self, mock_send_mail):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        send_user_activation_mail(user)
        mock_send_mail.assert_called()

    @patch("ai_kit_auth.services.api_settings")
    def test_user_id_is_scrambled(self, mock_settings):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        send_user_activation_mail(user)
        mock_settings.SEND_USER_ACTIVATION_MAIL.assert_called()
        url = mock_settings.SEND_USER_ACTIVATION_MAIL.call_args[0][1]
        ident = url.split("/")[-2]
        self.assertEqual(ident, str(scramble_id(user.pk)))

    @patch("ai_kit_auth.services.make_url")
    def test_activation_link_is_in_email(self, mock_make_url):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        mock_make_url.return_value = "url to the frontend activation link thingy"
        send_user_activation_mail(user)
        self.assertTrue(mock_make_url.return_value in mail.outbox[0].body)


class InitResetPasswordTest(TestCase):
    @patch("ai_kit_auth.services.send_email")
    def test_send_activation_mail(self, mock_send_mail):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        send_reset_pw_mail(user)
        mock_send_mail.assert_called()

    @patch("ai_kit_auth.services.api_settings")
    def test_user_id_is_scrambled(self, mock_settings):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        send_reset_pw_mail(user)
        mock_settings.SEND_RESET_PW_MAIL.assert_called()
        url = mock_settings.SEND_RESET_PW_MAIL.call_args[0][1]
        ident = url.split("/")[-2]
        self.assertEqual(ident, str(scramble_id(user.pk)))

    @patch("ai_kit_auth.services.make_url")
    def test_reset_link_is_in_email(self, mock_make_url):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        mock_make_url.return_value = "url to the frontend reset link thingy"
        send_reset_pw_mail(user)
        self.assertTrue(mock_make_url.return_value in mail.outbox[0].body)
