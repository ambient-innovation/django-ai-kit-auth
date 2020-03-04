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

See the READMEs in [django-app](/django-app/README.md) and [react-lib](/react-lib/README.md) for detailed instructions.

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

### Linting

Python code should be formatted by black
