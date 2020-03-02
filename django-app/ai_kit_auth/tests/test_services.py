from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core import mail
from model_bakery import baker
from ..services import feistel_chipher, send_user_activation_mail


UserModel = get_user_model()


class FeistelChipherTest(TestCase):
    def test_invertable(self):
        for i in [0, 1000, 4020, 19432, 599299398]:
            encoded = feistel_chipher(i)
            self.assertNotEqual(i, encoded)
            self.assertEqual(i, feistel_chipher(encoded))

    def test_out_of_range(self):
        self.assertRaises(ValueError, feistel_chipher, -1)
        self.assertRaises(ValueError, feistel_chipher, 0x100000000)
        self.assertRaises(ValueError, feistel_chipher, 0x29943929990)


class ActivationTest(TestCase):
    def test_send_activation_mail(self):
        user = baker.make(UserModel, is_active=False, email="to@example.com")
        send_user_activation_mail(user)
        ident = str(feistel_chipher(user.id))
        self.assertEqual(len(mail.outbox), 1)
        self.assertTrue(ident in mail.outbox[0].body)
