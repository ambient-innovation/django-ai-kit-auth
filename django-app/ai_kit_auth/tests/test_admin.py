from unittest import TestCase
from unittest.mock import Mock, patch

from django.core.exceptions import ValidationError
from model_bakery import baker

from ai_kit_auth.admin import User, AIUserCreationForm, AIUserChangeForm

EMAIL = "a@example.com"


class CreateFormTests(TestCase):
    def test_clean_raises_if_email_exists(self):
        baker.make(User, email=EMAIL)

        form = Mock()
        form.cleaned_data = {"email": EMAIL}

        with self.assertRaises(ValidationError):
            AIUserCreationForm.clean_email(form)

    def test_clean_returns_email(self):
        User.objects.filter(email=EMAIL).delete()
        form = Mock()
        form.cleaned_data = {"email": EMAIL}
        self.assertEqual(AIUserCreationForm.clean_email(form), EMAIL)

    @patch("ai_kit_auth.admin.UserCreationForm.save", Mock())
    def test_save_sets_inactive(self):
        instance = AIUserCreationForm().save()
        self.assertFalse(instance.is_active)


class ChangeFormTests(TestCase):
    def test_clean_raises_if_email_changes_to_already_taken_one(self):
        baker.make(User, email=EMAIL)
        user = baker.make(User)

        form = AIUserChangeForm(instance=user)
        form.cleaned_data = {"email": EMAIL}

        with self.assertRaises(ValidationError):
            form.clean_email()

    def test_clean_is_okay_if_email_is_the_one_of_instance_and_returns_email(self):
        user = baker.make(User, email=EMAIL)
        form = AIUserChangeForm(instance=user)
        form.cleaned_data = {"email": EMAIL}
        # Should not raise
        self.assertEqual(form.clean_email(), EMAIL)
