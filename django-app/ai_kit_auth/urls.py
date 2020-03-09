from django.urls import re_path
from . import views

urlpatterns = [
    re_path(r"^login/$", views.LoginView.as_view(), name="auth_login"),
    re_path(
        r"^activate_email/(?P<ident>[0-9]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$",
        views.ActivateUser.as_view(),
        name="auth_activate",
    ),
    re_path(r"^me/$", views.Me.as_view(), name="auth_me"),
    re_path(
        r"^validate_password/$",
        views.ValidatePassword.as_view(),
        name="auth_validate_password",
    ),
]
