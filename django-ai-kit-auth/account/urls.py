from django.urls import include, re_path

# Right there is not a lot happening here, just the reexport of the rest_auth
# urls. Later when we do the account reset stuff it makes sense to not use
# the rest_auth endpoints in the target app directly because we can do the
# configuration here that is a little bit fiddly
urlpatterns = [
    re_path(r'', include('rest_auth.urls'))
]