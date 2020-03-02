from django.urls import re_path
from . import views

# Right there is not a lot happening here, just the reexport of the rest_auth
# urls. Later when we do the account reset stuff it makes sense to not use
# the rest_auth endpoints in the target app directly because we can do the
# configuration here that is a little bit fiddly


urlpatterns = [
    re_path(r"^login/$", views.LoginView.as_view(), name="rest_login"),
    re_path(
        r"^activate/(?P<ident>[0-9]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$",
        views.ActivateUser.as_view(),
        name="rest_activate",
    ),
    re_path(r"^me/$", views.Me.as_view(), name="rest_me"),
    re_path(
        r"^validate_password/$",
        views.ValidatePassword.as_view(),
        name="validate_password",
    ),
]
