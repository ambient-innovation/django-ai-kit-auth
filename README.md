# AI-KIT: Authentication

`django-ai-kit-auth` bundles everything user account and authentication related.

It includes a custom user model including an admin interface and configures rest
routes for login, logout, registration etc.

## Quick Start

1.) Add `ai-kit-auth` to your `INSTALLED_APPS` like so:

```
INSTALLED_APPS = (
    ...
    "rest_framework",
    ...
    "ai-kit-auth",
)
```
`rest_framework` has to be installed for `django-ai-kit-auth` to work.

2.) Configuration is namespaced unter `AI_KIT_AUTH` like so:

```
AI_KIT_AUTH = {
    "ACTIVATION_ROUTE": "activation",
    "FRONTEND_URL": "example.com",
    ...
}
```

Note that `FRONTEND_URL` is a required configuration that does not have a
default. Default configurations are:

```
AI_KIT_AUTH = {
    "ACTIVATION_ROUTE": "activation",
    "EMAIL_TEMPLATE_USER_CREATED_TITLE": "user_created_title.txt",
    "EMAIL_TEMPLATE_USER_CREATED_BODY_PLAINTEXT": "user_created_body.txt",
    "EMAIL_TEMPLATE_USER_CREATED_BODY_HTML": "user_created_body.html",
    "USERNAME_REQUIRED": False,
    "FRONTEND_URL": None,
}
```

TODO: keep this updated as the lib is developed

3.) Include the routes in your `urls.py`:

```
urlpatterns = [
    ...
    re_path("^api/v1/", include("ai_kit.urls"))
    ...
]
```


4.) Run `python manage.py migrate`.

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

## E2E-Testing

In order to perform end-to-end tests, both libraries are use in the demo project.
However, the current versions are necessary for the tests, which is why the
libraries need to be packed and copied into the demo folder.

### Packing the ai-kit-auth

Execute `npm pack` in the ai-kit-auth folder. This will automatically create
a packaged archive of the current version, copy it to demo and delete the local
version.
