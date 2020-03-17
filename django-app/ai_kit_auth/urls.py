from django.urls import include, path, re_path
from . import views

auth_patterns = (
    [
        re_path(r"^login/$", views.LoginView.as_view(), name="login"),
        re_path(r"^activate_email/$", views.ActivateUser.as_view(), name="activate",),
        re_path(r"^logout/$", views.LogoutView.as_view(), name="logout"),
        re_path(r"^me/$", views.MeView.as_view(), name="me"),
        re_path(
            r"^validate_password/$",
            views.ValidatePassword.as_view(),
            name="validate_password",
        ),
        re_path(r"^register/$", views.RegistrationView.as_view(), name="registration"),
    ],
    "ai_kit_auth",
)

urlpatterns = [path("", include(auth_patterns))]
