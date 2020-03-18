# AI-KIT: Authentication

AI Kit Auth is the one stop shop for authentification related tasks for
ambient innovation.

It targets the following tech stack:

* Django in the back
* React in the front
* Material UI is used for the standard theme, but its not tightly coupled and
not a necessary dependency
* REST Api
* Sessions authentification. Support for JWT is planned, but not as the main
auth method, but to enable access to external services for a short amount of
time.

This project includes a django library that provides routes and other
functionality on the backend side and React Components for the frontend.

## Integration into your project

See the READMEs in [django-app](django-app/README.rst) and [react-lib](react-lib/README.md) for detailed instructions.

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

## Local Development

See [demo README](demo/README.md)

## E2E-Testing

See [demo README](demo/README.md)

### Linting

Python code should be formatted by black, typescript code by eslint.

### Notes on CSRF protection and authentification strategy

Ai-Kit-Auth makes use of the standard django session managment and
the build in CSRF protection measures. The frontend has to set a `X-CSRFToken`
http header to the current CSRF token value. This token is returned by the
`me/` and the `login` endpoints (the token is rotated by django after login, 
so the frontend needs the new value at this point). 

Django defaults to save the CSRF token in a cookie, but also gives the option
to save it in the current session. Both schemes work with Ai-Kit-Auth, but 
session storage can prevent problems with double logins (for example, if a 
user is logged in the backend and the frontend).

If you want to implement your own frontend, you have to set the `X-CSRFToken`
http header to the value of the CSRF token yourself

### CORS protection

If your application runs front- and backend from the same domain, you don't need
the cors header library and configuration shown in the django-app documentation.