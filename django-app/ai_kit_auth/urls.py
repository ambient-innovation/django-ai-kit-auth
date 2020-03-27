from django.urls import include, path
from . import views

auth_patterns = (
    [
        path(r"login/", views.LoginView.as_view(), name="login"),
        path(r"activate_email/", views.ActivateUser.as_view(), name="activate",),
        path(r"logout/", views.LogoutView.as_view(), name="logout"),
        path(r"me/", views.MeView.as_view(), name="me"),
        path(
            r"validate_password/",
            views.ValidatePassword.as_view(),
            name="validate_password",
        ),
        path(
            r"send_pw_reset_email/",
            views.InitiatePasswordResetView.as_view(),
            name="send_pw_reset_email",
        ),
        path(r"reset_password/", views.ResetPassword.as_view(), name="pw_reset",),
        path(r"register/", views.RegistrationView.as_view(), name="register"),
    ],
    "ai_kit_auth",
)

urlpatterns = [path("", include(auth_patterns))]
