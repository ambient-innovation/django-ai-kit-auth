import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core import mail
from model_bakery import baker
from ..services import scramble_id, send_user_activation_mail


UserModel = get_user_model()


class FeistelChipherTest(TestCase):
    def test_invertable(self):
        for i in [0, 1000, 4020, 19432, 599299398]:
            encoded = scramble_id(i)
            self.assertNotEqual(i, encoded)
            self.assertEqual(i, scramble_id(encoded))

    def test_out_of_range(self):
        for i in [-1, 0x100000000, 0x29943929990, "string", uuid.uuid4()]:
            self.assertEqual(i, scramble_id(i))


class ActivationTest(TestCase):
    def test_send_activation_mail(self):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        send_user_activation_mail(user)
        ident = str(scramble_id(user.id))
        self.assertEqual(len(mail.outbox), 1)
        self.assertTrue(ident in mail.outbox[0].body)
