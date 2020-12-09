from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class EmailUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_staff", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        return self._create_user(email, password, **extra_fields)


class EmailUser(AbstractBaseUser, PermissionsMixin):
    """
    Standard email user
    E-Mail is login name instead of username
    """

    email = models.EmailField(_("E-Mail-Adresse"), unique=True)
    is_active = models.BooleanField(_("aktiv"), default=True)
    is_staff = models.BooleanField(_("Mitarbeiter"), default=False)
    is_superuser = models.BooleanField(_("Admin"), default=False)

    objects = EmailUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("Benutzer")
        verbose_name_plural = _("Benutzer")

    def __str__(self) -> str:
        return self.email

    def get_full_name(self) -> str:
        return ""

    def get_short_name(self) -> str:
        return ""

    # required by the admin
    def has_perm(self, perm, obj=None) -> bool:
        return self.is_superuser or self.is_staff

    def has_module_perms(self, app_label) -> bool:
        return self.is_superuser or self.is_staff

    @property
    def is_allowed_to_login(self) -> bool:
        """
        Used by the LoginSerializer when a Client tries to login
        """
        return self.is_active and self.project is not None
