from django.test import TestCase
from ..utils import feistel_chipher


class FeistelChipherTest(TestCase):
    def test_invertable(self):
        for i in list(range(1000)) + [4020, 19432, 599299398]:
            encoded = feistel_chipher(i)
            self.assertNotEqual(i, encoded)
            self.assertEqual(i, feistel_chipher(encoded))

    def test_out_of_range(self):
        self.assertRaises(ValueError, feistel_chipher, -1)
        self.assertRaises(ValueError, feistel_chipher, 0x100000000)
        self.assertRaises(ValueError, feistel_chipher, 0x29943929990)
