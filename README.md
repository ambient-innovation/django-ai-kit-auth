# AI-KIT: Authentication

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

## Contributing

If you want to contribute, please make sure to write commit messages
according to the [conventionalcommits](https://www.conventionalcommits.org/en/v1.0.0/#summary)
specification, because they are the basis for automatic versioning and
changelog generation. Basically, a commit message should have the format

```
<type>(<scope>): <header>

<body>

<footer>
```

The `type` can be one of `fix, feat, build, chore, ci, docs, style, refactor, perf, test`.

The `scope` should contain `django` if the `django-ai-kit-auth` was modified
in the commit and `react` if the `ai-kit-aut` was committed. Otherwise,
the scope is up to you.

The `header` should contain an imperative short sentence about the change
that has been done, as well as a reference to the issue, that gave rise to
the commit, e.g. `(fixes #12)` or `(refs #12)`. This reference should
terminate the first line.

The `body` and `footer` contain more detailed changes and short documentation
of how a new feature works. If there are breaking changes in the public API,
the either one must contain `BREAKING CHANGE:` with a following description
of what is changing. `body` and `footer` are not required if the type is not
`fix` or `feat`.


