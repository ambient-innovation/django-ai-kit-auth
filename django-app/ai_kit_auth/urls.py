from django.urls import include, path, re_path
from . import views

auth_patterns = (
    [
        re_path(r"^login/$", views.LoginView.as_view(), name="login"),
        re_path(
            r"^activate_email/(?P<ident>[^\/]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$",
            views.ActivateUser.as_view(),
            name="activate",
        ),
        re_path(r"^logout/$", views.LogoutView.as_view(), name="logout"),
        re_path(r"^me/$", views.Me.as_view(), name="me"),
        re_path(
            r"^validate_password/$",
            views.ValidatePassword.as_view(),
            name="validate_password",
        ),
        re_path(
            r"^registration/$", views.RegistrationView.as_view(), name="registration"
        ),
    ],
    "ai_kit_auth",
)

urlpatterns = [path("", include(auth_patterns))]
