# AI-KIT: Authentication

"AI Kit Auth" is the one-stop shop for authentication related tasks for Ambient Digital.

It targets the following tech stack:

* Django in the back
* React in the front
* Material UI is used for the standard theme, but it's not tightly coupled and
there are efforts to make it a not necessary dependency
* REST Api
* Sessions authentication. Support for JWT is planned --- not as the main
auth method, but to enable access to external services for a short amount of
time.

This project includes a django library that provides routes and other
functionality on the backend side and React Components for the frontend.

This project also includes a [demo](examples/email-user/README.md) SPA that uses both the django and react libraries.

Links to the hosted packages:
* React: https://www.npmjs.com/package/ai-kit-auth
* Django: https://pypi.org/project/django-ai-kit-auth/

## Usage

You can find detailed instructions on how to use the frontend and backend libraries
in the different README files of the respective folders:
* Backend: [django-app](django-app/README.rst)
* Frontend: [react-lib](react-lib/README.md)

## Contributing

If you want to contribute, please make sure to write commit messages
according to the [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)
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

**Please do not squash commits, as the original commit messages are important for
determining the next version for django and react libraries!**

## Local Development & Demo

Use the included demo project to test and add new features to the library.

See [demo README](examples/email-user/README.md) on how to set it up.

Changes pushed or merged into the master branch will automatically be released on npm or pypi.

## E2E-Testing

See [demo README](examples/email-user/README.md)

### Linting

Python code should be formatted by black, typescript code by eslint.

### Notes on CSRF protection and authentication strategy

Ai-Kit-Auth makes use of the standard django session management and
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
