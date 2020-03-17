# AI-KIT: Authentication

This is the frontend library for the AI-KIT module Authentication.
Use it in conjunction with the django package `django-ai-kit-auth` in order to get a
functioning authentication running in your app in no time.

## Installation

You can easily install AI-KIT: Authentication via npmjs. Using npm, run
```commandline
npm install ai-kit-auth
```

Using yarn, run
```commandline
yarn add ai-kit-auth
```

## Quickstart

While it is possible to customize many aspects of appearance and behaviou,
the fastest way to get a functioning authentication module is to use the standard
components provided by this library.
You can set them up in your `App.tsx` (or `App.jsx`) like so:

```typescript jsx
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { UserStore, makeAuthRoutes, ProtectedRoute } from 'ai-kit-auth';

import MainPage from './components/MainPage';

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <BrowserRouter>
        <Switch>
            {makeAuthRoutes()}
            <ProtectedRoute exact path="/" component={MainPage} />
        </Switch>
    </BrowserRouter>
  </UserStore>
);

export default App;
```

Let's break this down: the most important component is [`UserStore`](#UserStore), which
stores user data and provides login/logout etc. functions.
[`makeAuthRoutes`](#makeauthRoutes) returns a list of important routes which enable
basic authentication functionality.
[`ProtectedRoute`](#ProtectedRoute) provides a quick way to force users to log in if
they want to access specific pages.
See the [API reference](#API Reference) for more information.

### CSRF Protection

In order to guard against CSRF attacks, the `UserStore` obtains and provides a csrf-token for
you to use.
You can obtain it from the `useUserStore` hook and add it to each 'unsafe' request (anything
that is not `OPTIONS`, `GET`, `HEAD` or `TRACE`) as `X-CSRFToken`-header.

## API Reference

AI-KIT: Authentication provides the following components and functions:
* Configuration
    * [configureAuth](#configureAuth)
    * [defautlConfig](#defaultConfig)
    * [Identifier](#Identifier)
* UserStore
    * [UserStore](#userstore)
    * [UserContext](#Usercontext)
    * [AuthFunctionContext](#AuthFunctionContext)
    * [useUserStore](#useuserstore)
* Routes
    * [makeAuthRoutes](#makeAuthRoutes)
    * [ProtectedRoute](#protectedroute)
    * [LoginRoute](#loginroute)
* LoginView
    * [LoginView](#loginview)
    * [LoginForm](#loginform)
* ActivationView
    * [ActivateEmailAddress](#ActivateEmailAddress)
    * [ActivationCard](#ActivationCard)
    * [ActivationView](#ActivationView)
* Errors
    * [ErrorCard](#ErrorCard)
    * [ErrorView](#ErrorView)

### configureAuth

This function creates customized components and functions for you, if the default configuration
is not enough for you!

#### Parameters

* Type parameter `UserType`: tells typescript, what kind of user object you expect from the backend.
If you want to load more data than just the username and email of a user, you need to configure
your django backend to use a custom `UserSerializer` and a custom `User` interface, which you pass
to this function.
* `config: Configuration`: a configuration object with information about route paths, components etc.
Configuration is a deep `Partial` of [`defaultConfig`](#defaultConfig)'s type.
So you are free to provide whichever settings, and the ones you don't provide will fall back to default.

#### Returns

An object containing custom versions of all this modules' default exported ones.

#### Example

```typescript_jsx
import React from 'react';
import { configureAuth } from 'ai-kit-auth';

export const Auth = configureAuth({
    paths: { base: '/user' },
    components: { loadingIndicator: () => <div>Loading</div> },
 });
```

#### Note

:warning: **Do not mix configured Components with default ones!**


### defaultConfig

This object contains default values for AI-KIT: Auth configuration.

```typescript jsx
export const defaultConfig = {
  paths: {
    mainPage: '/',
    base: '/auth',
    login: '/login',
    activation: '/activation/:ident/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    emailSent: '/email-sent',
  },
  userIdentifier: Identifier.UsernameOrEmail,
  components: {
    loadingIndicator: () => <CircularProgress />,
  },
};
```

The `CircularProgress` component is imported from [Material-UI](https://material-ui.com/api/circular-progress/).


### Identifier

Using this enum you can control with which information the user can login.
Its values are:

* `Identifier.Username`: login only with username
* `Identifier.Email`: login only with email address
* `Identifier.UsernameOrEmail`: login with either username or email address (default)

### UserStore

This component provides user data and authentication helper functions to its children via
react context.
For AI-KIT: Authentication to work correctly, it is necessary to place it high in your
component tree, so that it contains any components which might try to access user information,
or perform user actions like login, logout etc.

#### Props
* `apiUrl`: tells the store, where to send login requests.
  This should be the url to the django backend of your project.
* `customTheme` a MaterialUI Theme which overrides any default themes this package provides.

#### Example

```typescript jsx
// App.tsx
import React from 'react';
import { UserStore } from 'ai-kit-auth';
import ...

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
    customTheme={myCustomTheme}
  >
    <BrowserRouter>
      ...
    </BrowserRouter>
  </UserStore>
);

export default App;
```


### AuthFunctionContext

This is a react `Context` and can be used as such. Its Consumer will receive the following fields:

* `apiUrl: string`: contains the url of the backend. This is exactly the same as the
`apiUrl` prop passed to `UserStore`
* `csrf: string`:
a token obtained from the server, used to guard against Cross Site Request Forgeries.
Whenever you make a `POST`, `DELETE`, `PATCH` or `PUT` request to our backend, you need to
place this token in the `X-CSRFToken` header of the request.
Otherwise, the request will be rejected (provided that CSRF is enabled on the backend).
* `loading: boolean`:
true if a login request has been sent, but the reply has not yet arrived.
* `login: (userIdentifier: string, password: string) => Promise<void>`: triggers a login request.
It requires an identifier string, which is either the username or email of the user.
Depending on the configuration, the backend accepts either one or only one of them.
* `loggedIn: boolean`: an indicator, whether the user is logged in. For this check,
you can either use this `boolean`, or you check if `user` of [`UserContext`](#UserContext) is `null`.
* `logout: () => Promise<void>`: triggers a logout request. If successful, it removes the cookies
and sets the `user` in [`UserContext`](#UserContext) to `null`.
* `justLoggedOut: boolean`: Is set to true after a successful `logout`. However, it is not
persistent, so after the next page refresh, it will be set to `false` again. It is used to
display a non-persistent notification that the logout was successful on the login page.
* `activateEmailAddress: (userIdentifier: string, token: string) => Promise<void>`:
triggers a request to validate a user's email address and activate their account. If successful,
the user in question is able to login.
* `requestPasswordReset: (email: string) => Promise<void>`: triggers a request to the password
reset endpoint, which sends an email with a link to the provided email, if that email indeed
belongs to a user in the database. However, the backend's response is positive regardless, of whether
the email is in the database or not.


### UserContext

This is a react `Context` and can be used as such. Its Consumer will receive the following fields:

* `user: { id: number; username: string; email: string }|undefined`

You can configure the type of `user` with [`configAuth`](#configAuth).
If it is undefined, the user is not logged in.


### useUserStore

`useUserStore` is a react hook, which can be used to obtain user information and helper
functions stored in the `UserStore`.
It returns an object containing the `user` object provided by [`UserContext`](#UserContext),
as well as all the fields that [`AuthfunctionContext`](#AuthFunctionContext) provides.


### makeAuthRoutes

This function is the fastest way to get started with AI-KIT.
It returns an array of all the necessary frontend routes for authentication.
Call this function in your `App` component inside a `Switch`.

#### Parameters

None

#### Returns

A list of `JSX.Element`s, which can be placed directly in a `react-router-dom` `Switch`.

#### Example

```typescript jsx
import React from 'react';
import { makeAuthRoutes } from 'ai-kit-auth';
import ...

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <BrowserRouter>
        <Switch>
            {makeAuthRoutes()}
            <Route ... />
            ...
        </Switch>
    </BrowserRouter>
  </UserStore>
);

export default App;
```


### ProtectedRoute

A wrapper for [\<Route\>](https://reacttraining.com/react-router/web/api/Route) routes that
should only be available to users that are logged in.
It checks with the UserContext if the user is in fact logged in. If not, it will redirect to
the login screen (default: `/auth/login`).
During the check a loading indicator is shown.

#### Example

```typescript jsx
<UserStore
  apiUrl="http://localhost:8000/api/v1/"
>
  <BrowserRouter>
    <Switch>
      <ProtectedRoute exact path="/">
        <div>
          Hello World
        </div>
      </ProtectedRoute>
    </Switch>
  </BrowserRouter>
</UserStore>

```


### LoginRoute

Use this wrapper for [\<Route\>](https://reacttraining.com/react-router/web/api/Route)
as Route for a login page, if you are not using [`makeAuthRoutes`](#makeAuthRoutes).
It uses the [`AuthFunctionsContext`](#AuthFunctionsContext) to see if a user is logged in or not.
When the user is logged in it redirects to it's referrer.
If there is no referrer, it redirects to the `main page` (default `'/'`).

#### Example

```typescript jsx
<UserStore
  apiUrl="http://localhost:8000/api/v1/"
>
  <BrowserRouter>
    <Switch>
      <LoginRoute  exact path="/auth/login" component={LoginView} />
    </Switch>
  </BrowserRouter>
</UserStore>

```


### LoginView

Styled page wrapper for a LoginForm.

#### Example

```typescript jsx
const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <LoginView />
  </UserStore>
);
```


### LoginForm

`LoginForm` is a react component that provides a
[Material UI Paper](https://material-ui.com/components/paper/) wrapper and contains two
input fields (username/email and password) and a submit button.


### ActivateEmailAddress

This component analyses the current URL to find the user identifier and email activation
token, which are needed to activate a user's email address.
If found, they are sent to the `/activate_email/` endpoint of the backend and the result
of that request is rendered as error or success view. While waiting for the request,
a loading indicator is shown.
This component needs to be placed within a `Route` with parameters `ident` and `token`,
and also needs a `UserStore` as parent somewhere in the tree, so that it can find the
`activateEmailAddress` function.

#### Example

```typescript jsx
    <Route
      exact
      path={`${normPath}/activation/:ident/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})`}
      component={ActivateEmailAddress}
      key="activation"
    />,

```

#### Note

Be aware that `ActivateEmailAddress` should not reside inside a `ProtectedRoute`, as it needs to be
accessible to users who are not logged in.
