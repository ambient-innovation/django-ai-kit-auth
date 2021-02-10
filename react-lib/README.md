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

`ai-kit-auth` has a number of peer dependencies that you need to install yourself before you get started:

* `react@^16.8.0`
* `react-router-dom@^5.0.0`
* `history@^4.0.0`
* `@material-ui/core@^4.9.0`
* `@material-ui/icons@^4.9.0`

While it is possible to customize many aspects of appearance and behaviour,
the fastest way to get a functioning authentication module is to use a default
configuration provided by this library.
If you use `react-router`, you can create a configuration file like this:

```typescript jsx
// configureAuth.ts
import { configureAuth } from 'ai-kit-auth/dist/config/ReactRouter';

export const {
    UserStore,
    useUserStore,
    makeAuthRoutes,
    ProtectedRoute,
} = configureAuth();
```

Then you can set up your `App.tsx` (or `App.jsx`) like this:

```typescript jsx
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { DefaultTheme } from 'ai-kit-common';
import { UserStore, makeAuthRoutes, ProtectedRoute } from './configureAuth';

import MainPage from './components/MainPage';

const App: React.FC = () => (
  <>
    <CssBaseline />
    <ThemeProvider theme={DefaultTheme}>
      <UserStore
        apiUrl="http://localhost:8000/api/v1/"
        apiAuthPath="auth/"
      >
        <BrowserRouter>
            <Switch>
                {
                  // Create routes for login, registration, password reset etc.
                  makeAuthRoutes()
                }
                <ProtectedRoute exact path="/" component={MainPage} />
            </Switch>
        </BrowserRouter>
      </UserStore>
    </ThemeProvider>
  </>
);

export default App;
```

Let's break this down: the most important component is [`UserStore`](#userstore), which
stores user data and provides login/logout etc. functions.
[`makeAuthRoutes`](#makeauthroutes) returns a list of important routes which enable
basic authentication functionality.
[`ProtectedRoute`](#protectedroute) provides a quick way to force users to log in if
they want to access specific pages.
See the [API reference](#api-reference) for more information.

### CSRF Protection

In order to guard against CSRF attacks, the `UserStore` obtains and provides a csrf-token for
you to use.
You can obtain it from the `useUserStore` hook and add it to each 'unsafe' request (anything
that is not `OPTIONS`, `GET`, `HEAD` or `TRACE`) as `X-CSRFToken`-header.

If you use `axios`, you can use the `axiosRequestConfig` provided by `useUserStore`, which already
contains the CSRF token in the correct header.

### Styling and Material Theme

The components were designed with the [AI KIT DefaultTheme](https://gitlab.ambient-innovation.com/ai/ai.kit/common/-/tree/master/react-lib#defaulttheme) theme in mind.
To use it, add [`ai-kit-common`](https://www.npmjs.com/package/ai-kit-common) to your project,
wrap your application in `<ThemeProvider>` tags and add the [required fonts](https://gitlab.ambient-innovation.com/ai/ai.kit/common/-/tree/master/react-lib#fonts) to your application.
You are also advised to add a [`<CssBaseline />`](https://material-ui.com/components/css-baseline/) component to your application's root to 'normalize' the browser styles.
Of course, you are also free to use whatever custom Material Theme you wish.

## API Reference

AI-KIT: Authentication provides the following components and functions:
* Configuration
    * [makeComponents](#makecomponents)
    * [defaultConfig](#defaultconfig)
    * [Translator](#translator)
    * [Identifier](#identifier)
* UserStore
    * [UserStore](#userstore)
    * [UserContext](#usercontext)
    * [mockUserStore](#mockuserstore)
    * [AuthFunctionContext](#authfunctioncontext)
    * [useUserStore](#useuserstore)
* Login
    * [LoginView](#loginview)
    * [LoginForm](#loginform)
* Registration
    * [RegisterView](#registerview)
    * [RegisterForm](#registerform)
* Forgot Password
    * [ForgotPasswordView](#forgotpasswordview)
    * [ForgotPasswordForm](#forgotpasswordform)
* Reset Password
    * [ResetPasswordView](#resetpasswordview)
    * [ResetPasswordForm](#resetpasswordform)
* Email-Activation
    * [ActivateEmailAddress](#activateemailaddress)
    * [ActivationCard](#activationcard)
    * [ActivationView](#activationview)
* Errors
    * [ErrorCard](#errorcard)
    * [ErrorView](#errorview)
* ReactRouter
    * [configureAuth](#reactrouterconfigureauth)
    * [makeAuthRoutes](#makeauthroutes)
    * [ProtectedRoute](#protectedroute)
    * [LoginRoute](#loginroute)

### makeComponents

This is the general function to create customized components for authentication pages as well as the [UserStore](#userstore).
However, it does not have a default configuration for routing (or jumping between pages).
These defaults are implemented in the respective configuration functions for different routing libraries.
If you use `react-router`, use the [configureAuth](#reactrouterconfigureauth) function instead.

#### Parameters

* Type parameter `UserType`: tells typescript, what kind of user object you expect from the backend.
If you want to load more data than just the username and email of a user, you need to configure
your django backend to use a custom `UserSerializer`. Then you need to describe the data structure in
a custom `User` interface, which you pass to this function.
* `config: InputConfig`: a configuration object with information about route paths, components etc.
Besides a deep `Partial` of [`defaultConfig`](#defaultconfig)'s type, this type also has mandatory
fields regarding the routing:
```typescript jsx
  routing: {
    link: React.ComponentType<LinkProps>; // Component to display whenever a hyperlink is needed
    useRouteHandler: () => RouteHandler; // A React hook which gives an object containing
                                         // push and replace functions for the browser's history
    useQueryParams: () => Record<string, string>; // A React hook which gives an object containing the urls'
                                                  // query parameters on a key=value basis.
  };
```
If you are absolutely certain that you need to use this function, please take a look at the source
code for more information.

#### Returns

An object containing custom versions of all this modules' common components.

#### Note

:warning: **Do not mix Components configured in different configuration calls,
 as they will not necessarily share a `UserContext`!**


### defaultConfig

This object contains default values for AI-KIT: Auth configuration.

```typescript jsx
export const defaultConfig = {
  paths: {
    mainPage: '/', // login redirects here by default
    base: '/auth', // this path will be prepended to all other paths
    login: '/login',
    register: '/register',
    activation: '/activation', // email activation path
    forgotPassword: '/forgot-password', // clicking 'forgot password' on the login
                                        // page leads here
    resetPassword: '/reset-password', // actual page to reset the password.
                                      // Only accessible via link, which is sent by email.
    emailSent: '/email-sent', // success feedback after email was sent from the
                              // forgot password page
  },
  defaultTranslator: en, // A 'Translator' function, responsible for mapping keys
                         // to user facing strings.
  userIdentifier: Identifier.UsernameOrEmail, // what should the user type in the
                                              // login screen?
  disableUserRegistration: false, // setting this to true will remove the register
                                  // path completely
  components: {
    backgroundImage: DefaultBackgroundImage,
    loadingIndicator: CircularProgress,
    // is shown while user info is retrieved from server
  },
};
```

See [`Translator`](#translator).

The `backgroundImage` is used in all the views that are wrapped in `AuthView`.

The `CircularProgress` component is imported from [Material-UI](https://material-ui.com/api/circular-progress/).


### Translator

Ai-Kit-Auth components use a translator function for displaying user-facing strings.
Therefore, the [config](#configureauth) accepts `translator: Translator` as parameter.
This type is defined as `(key: string) => string` and will receive strings of the form
`auth:Path.To.Key`, conforming with [i18next](#https://www.i18next.com/).

If you don't need dynamic translation and are just interested in a different supported
language than the default (English), you can pass one of the predefined translator
functions exported by `ai-kit-auth`. Currently available choices are `en` and `de`.
If you need to translate only a few strings differently, we would advise you to inspect
the source code in order to find the correct keys and write a wrapper function around
one of the predefined translators in order to intercept the translation of those keys.

#### Example

```typescript jsx
import { configureAuth, en } from 'ai-kit-auth';

const customKey = 'auth:Common.ok';
const customValue = `Okay, Okay!`;
const t = (key: string) => {
  if (key === customKey) return customValue;

  return en(key);
};

export const {
  UserStore, ProtectedRoute, makeAuthRoutes,
} = configureAuth({ translator: t });
```

If you would like to use dynamic translations, we suggest to use [i18next](#https://www.i18next.com/)
and to pass your translator function `t` to `makeAuthRoutes` or to the respective
view components, if you are using them separately.
That way, auth components are re-rendered whenever the language changes.
In that case, you need to provide all the translations by yourself, in the namespace `auth`.
To get started, you can copy the `.json` files containing our translations from the
`dist/internationalization` folder of this module.

#### Example

```typescript jsx
import { useTranslation } from 'react-i18next';
import { makeAuthRoutes } from 'ai-kit-auth';
...

const App: FC = () => {
  const { t } = useTranslation(['auth']);

  return (
    <Switch>
      {makeAuthRoutes(t)}
    </Switch>
  );
};
```

### Identifier

Using this enum you can control with which information the user can login.
Its values are:

* `Identifier.Username`: login only with username
* `Identifier.Email`: login only with email address and remove username field from register form
* `Identifier.UsernameOrEmail`: login with either username or email address (default)

### UserStore

This component provides user data and authentication helper functions to its children via
react context.
For AI-KIT: Authentication to work correctly, it is necessary to place it high in your
component tree, so that it contains any components which might try to access user information,
or perform user actions like login, logout etc.

#### Props
* `apiUrl`: tells the store, where to send login requests.
  This should be the url to the django backend of your project including `api/v1/` or similar.
* `apiAuthPath`: The path at which the auth routes are available in the backend.
  If you included the ai-kit-auth paths as `path(r"api/v1/auth/", "ai_kit_auth.urls"),` in your django
  app, you must set `apiAuthPath` to `auth/`.

#### Example

```typescript jsx
// App.tsx
import React from 'react';
import { UserStore } from 'ai-kit-auth';
import ...

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
    apiAuthPath="auth/"
  >
    <BrowserRouter>
      ...
    </BrowserRouter>
  </UserStore>
);

export default App;
```

### MockUserStore

This component provides a mocked [`UserStore`](#UserStore) for testing purposes.
It works the same way [`UserStore`](#UserStore) does.
It does not provide fully functioning authentication helper functions to its children, but rather empty ones.

### AuthFunctionContext

This is a react `Context` and can be used as such. Its Consumer will receive the following fields:

* `apiUrl: string`: contains the url of the backend. This is exactly the same as the
`apiUrl` prop passed to `UserStore`
* `csrf: string`:
a token obtained from the server, used to guard against Cross Site Request Forgeries.
Whenever you make a `POST`, `DELETE`, `PATCH` or `PUT` request to our backend, you need to
place this token in the `X-CSRFToken` header of the request.
Otherwise, the request will be rejected (provided that CSRF is enabled on the backend).
* `axiosRequestConfig`:
An object you can pass to axios calls as `config` object. It includes the backend url (`apiUrl`),
`withCredentials: true` and the CSRF token as header.
* `loading: boolean`:
true if a login request has been sent, but the reply has not yet arrived.
* `login: (userIdentifier: string, password: string) => Promise<void>`: triggers a login request.
It requires an identifier string, which is either the username or email of the user.
Depending on the configuration, the backend accepts either one or only one of them.
* `loggedIn: boolean`: an indicator, whether the user is logged in. For this check,
you can either use this `boolean`, or you check if `user` of [`UserContext`](#usercontext) is `null`.
* `logout: () => Promise<void>`: triggers a logout request. If successful, it removes the cookies
and sets the `user` in [`UserContext`](#usercontext) to `null`.
* `justLoggedOut: boolean`: Is set to true after a successful `logout`. However, it is not
persistent, so after the next page refresh, it will be set to `false` again. It is used to
display a non-persistent notification that the logout was successful on the login page.
* `updateUserInfo: () => Promise<void>`: triggers a request to update both the user object and the CSRF-token.
It can be used to obtain the the user itself.
* `register: (username: string, email: string, password: string) => Promise<void>`:
triggers a request to register a new user. If successful, the server will have sent an email
to the email provided as parameter. If unsuccessful, it will raise an exception containing
information about which fields need to be corrected. If there are errors not pertaining to a
single field, they will be placed in `non_field_errors`.
* `activateEmailAddress: (userIdentifier: string, token: string) => Promise<void>`:
triggers a request to validate a user's email address and activate their account. If successful,
the user in question is able to login.
* `requestPasswordReset: (email: string) => Promise<void>`: triggers a request to the password
reset endpoint, which sends an email with a link to the provided email, if that email indeed
belongs to a user in the database. However, the backend's response is positive regardless, of whether
the email is in the database or not.
* `resetPassword: (ident: string, token: string, password: string) => Promise<void>`: triggers a request
to reset a users password. If successful, the promise will be resolved. If unsuccessful, it will raise an exception containing
information about which fields need to be corrected.


### UserContext

This is a react `Context` and can be used as such. Its Consumer will receive the following fields:

* `user: { id: number; username: string; email: string }|undefined`

You can configure the type of `user` with [`configAuth`](#configauth).
If it is undefined, the user is not logged in.


### useUserStore

`useUserStore` is a react hook, which can be used to obtain user information and helper
functions stored in the `UserStore`.
It returns an object containing the `user` object provided by [`UserContext`](#usercontext),
as well as all the fields that [`AuthfunctionContext`](#authfunctioncontext) provides.



### LoginView

Styled page wrapper for a [LoginForm](#loginform).

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.

#### Example

```typescript jsx
const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
    apiAuthPath="auth/"
  >
    <LoginView />
  </UserStore>
);
```


### LoginForm

`LoginForm` is a react component that provides a
[Material UI Paper](https://material-ui.com/components/paper/) wrapper and contains two
input fields (username/email and password) and a submit button.
There are also links to registration and password recovery.

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.


### RegisterView

Styled page wrapper for a [RegisterForm](#registerform).

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.

#### Example

```typescript jsx
const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
    apiAuthPath="auth/"
  >
    <RegisterView />
  </UserStore>
);
```


### RegisterForm

`RegisterForm` is a react component that provides a
[Material UI Paper](https://material-ui.com/components/paper/) wrapper and contains three
input fields (username, email and password) and a submit button.
There is also a link to the login page.

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.


### ActivateEmailAddress

This component analyses the current URL to find the user identifier and email activation
token, which are needed to activate a user's email address.
If found, they are sent to the `/activate_email/` endpoint of the backend and the result
of that request is rendered as error or success view. While waiting for the request,
a loading indicator is shown.
This component needs to be placed within a `Route` with parameters `ident` and `token`,
and also needs a `UserStore` as parent somewhere in the tree, so that it can find the
`activateEmailAddress` function.

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.

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


### ForgotPasswordView

Styled page wrapper for a [ForgotPasswordForm](#forgotpasswordform).

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.

#### Example

```typescript jsx
const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
    apiAuthPath="auth/"
  >
    <ForgotPasswordView />
  </UserStore>
);
```


### ForgotPasswordForm

`ForgotPasswordForm` is a react component that provides a
[Material UI Paper](https://material-ui.com/components/paper/) wrapper and contains one
input field (email) and a submit button. Upon submit the `requestPasswordReset()` method of the [AuthFunctionContext](#authfunctioncontext) is called.
There is also a link to the login page.

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.

### ResetPasswordView

Styled page wrapper for a [ResetPasswordForm](#resetpasswordform).

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.

#### Example

```typescript jsx
const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
    apiAuthPath="auth/"
  >
    <ResetPasswordView />
  </UserStore>
);
```


### ResetPasswordForm

`ResetPasswordForm` is a react component that provides a
[Material UI Paper](https://material-ui.com/components/paper/) wrapper and contains two
input fields (password and password-repeat) and a submit button. Upon submit the `resetPassword()` method of the [AuthFunctionContext](#authfunctioncontext) is called.

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.


## React Router Integration

### React Router configureAuth

This function provides default values to the mandatory ones of [`makeComponents`](#makecomponents).
It uses the widely used `react-router` library to define functionality for page transitions.

#### Parameters

The parameters are identical to those of [`makeComponents`](#makecomponents), with the exception that
there is no `routing` field.

#### Returns

An object containing all components returned by [`makeComponents`](#makecomponents), as well as

* [`makeAuthRoutes`](#makeauthroutes)
* [`ProtectedRoute`](#protectedroute)
* [`LoginRoute`](#loginroute)

#### Example

```typescript jsx
import { configureAuth } from 'ai-kit-auth/dist/config/ReactRouter';

export const {
    UserStore, useUserStore, makeAuthRoutes, ProtectedRoute,
} = configureAuth();
```

### makeAuthRoutes

This function is the fastest way to get started with AI-KIT and `react-router`.
It returns an array of all the necessary frontend routes and views for authentication,
like login, registration, password reset etc.
It creates a `Route` for each entry in [`defaultConfig`](#defaultconfig)`.paths`,
except for `mainPage` and `base`.
If you configure `disableUserRegistration: true`, the `register` path will not get a route.
Call this function in your `App` component inside a `Switch`.

#### Parameters

* `translator?: Translator`: A function which maps keys to user facing strings.

#### Returns

A list of `JSX.Element`s (`Routes`), which can be placed directly in a `react-router-dom` `Switch`.

#### Example

```typescript jsx
import React from 'react';
import { makeAuthRoutes } from 'ai-kit-auth';
import ...

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
    apiAuthPath="auth/"
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
  apiAuthPath="auth/"
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
as Route for a login page, if you are not using [`makeAuthRoutes`](#makeauthroutes).
It uses the [`AuthFunctionContext`](#authfunctioncontext) to see if a user is logged in or not.
When the user is logged in it redirects to it's referrer.
If there is no referrer, it redirects to the `main page` (default `'/'`).

#### Example

```typescript jsx
<UserStore
  apiUrl="http://localhost:8000/api/v1/"
  apiAuthPath="auth/"
>
  <BrowserRouter>
    <Switch>
      <LoginRoute  exact path="/auth/login" component={LoginView} />
    </Switch>
  </BrowserRouter>
</UserStore>

```

