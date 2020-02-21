# KIT Auth

`django-ai-kit-auth` bundles everything user account and authentication related.

It includes a custom user model including an admin interface and configures rest routes for login, logout, registration etc.

## Quick Start

1.) Add `django-ai-kit-auth` to your `INSTALLED_APPS` like so:

```
INSTALLED_APPS = (
    ...    
    "rest_framework",
    "rest_auth"
    ...
    "django-ai-kit-auth",
)
```
`rest_framework` and `rest_auth` has to be installed for `django-ai-kit-auth` to work.

Further settings:

```
REST_USE_JWT = True
```

TODO: `JWT_AUTH` config? 

2.) Include the routes in your `urls.py`:

```
urlpatterns = [
    ...
    re_path("^auth/", include("django-ai-kit-auth.account.urls"))
    ...
]
```

TODO: different url sets for standard, registration etc.

3.) Run `python manage.py migrate`.
 
## Dev 

To build the library, use:
```
python3 setup.py sdist
```
