from django.urls import include, path
from typing import Dict, Any

from .settings import api_settings
from . import views

endpoints: Dict[str, Any] = {
    "LOGIN": path(r"login/", views.LoginView.as_view(), name="login"),
    "ACTIVATE_EMAIL": path(
        r"activate_email/",
        views.ActivateUser.as_view(),
        name="activate",
    ),
    "LOGOUT": path(r"logout/", views.LogoutView.as_view(), name="logout"),
    "ME": path(r"me/", views.MeView.as_view(), name="me"),
    "VALIDATE_PASSWORD": path(
        r"validate_password/",
        views.ValidatePassword.as_view(),
        name="validate_password",
    ),
    "SEND_PW_RESET_MAIL": path(
        r"send_pw_reset_email/",
        views.InitiatePasswordResetView.as_view(),
        name="send_pw_reset_email",
    ),
    "RESET_PASSWORD": path(
        r"reset_password/",
        views.ResetPassword.as_view(),
        name="pw_reset",
    ),
    "REGISTER": path(r"register/", views.RegistrationView.as_view(), name="register"),
}

auth_patterns = (
    [
        endpoints[key]
        for key in endpoints
        if getattr(api_settings.ENABLE_ENDPOINTS, key)
    ],
    "ai_kit_auth",
)

urlpatterns = [path("", include(auth_patterns))]
