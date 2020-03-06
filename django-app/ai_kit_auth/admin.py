from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.forms import EmailField
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

User = get_user_model()


class AIUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("email",)

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
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2"),
            },
        ),
    )


admin.site.unregister(User)
admin.site.register(User, AIUserAdmin)
