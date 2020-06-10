import unicodedata
import uuid

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.forms import EmailField, CharField
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from .services import send_activation_by_admin_mail
from .settings import api_settings

User = get_user_model()


class UsernameField(CharField):
    def to_python(self, value):
        if not value:
            value = str(uuid.uuid4())
        return unicodedata.normalize("NFKC", super().to_python(value))

    def widget_attrs(self, widget):
        return {
            **super().widget_attrs(widget),
            "autocapitalize": "none",
            "autocomplete": "username",
        }


class AIUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("email",)

    username = UsernameField(
        label=_("Username"), required=api_settings.USERNAME_REQUIRED
    )
    email = EmailField(label=_("Email address"), required=True)

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email=email).exists():
            raise ValidationError(
                _("Another user with this email already exists!"), code="unique_email"
            )
        return email

    def save(self, commit=True):
        instance = super(AIUserCreationForm, self).save(commit=False)
        instance.is_active = False
        if commit:
            instance.save()
            send_activation_by_admin_mail(instance)
        else:
            # replace the save call, so that an email is send after
            # saving the instance
            bound_save_method = instance.save

            def instance_save_hook(*args, **kwargs):
                bound_save_method(*args, **kwargs)
                send_activation_by_admin_mail(instance)

            instance.save = instance_save_hook
        return instance


class AIUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("email",)

    email = EmailField(label=_("Email address"), required=True)

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.exclude(pk=self.instance.pk).filter(email=email).exists():
            raise ValidationError(
                _("Another user with this email already exists!"), code="unique_email"
            )
        return email


class AIUserAdmin(UserAdmin):
    form = AIUserChangeForm
    add_form = AIUserCreationForm
    fieldsets = api_settings.ADMIN_FIELDSETS
    add_fieldsets = api_settings.ADMIN_ADD_FIELDSETS


if admin.site.is_registered(User):
    admin.site.unregister(User)
admin.site.register(User, AIUserAdmin)
