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

## API Reference

AI-KIT: Authentication provides the following components and functions:
* UserStore
    * [UserStore](#userstore)
    * [useUserStore](#useuserstore)
    * [UserContext](#Usercontext)
    * [AuthFunctionContext](#AuthFunctionContext)
    * [makeGenericUserStore](#makegenericuserstore)
* Routes
    * [makeAuthRoutes](#makeAuthRoutes)
    * ProtectedRoute
        * [ProtectedRoute](#protectedroute)
        * [makeProtectedRoute](#makeprotectedroute)
    * LoginRoute
        * [LoginRoute](#loginroute)
        * [makeLoginRoute](#makeloginroute)
* LoginView
    * [LoginView](#loginview)
    * [LoginForm](#loginform)
    * [makeLoginForm](#makeloginform)
* ActivationView
    * [ActivateEmailAddress](#ActivateEmailAddress)
    * [makeActivateEmailAddress](#makeActivateEmailAddress)
    * [ActivationCard](#ActivationCard)
    * [ActivationView](#ActivationView)
* Errors
    * [ErrorCard](#ErrorCard)
    * [ErrorView](#ErrorView)

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

An example `App.tsx` might look like this:

```typescript jsx
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

### useUserStore

`useUserStore` is a react hook, which can be used to obtain user information and helper
functions stored in the `UserStore`.
It returns an object containing a  `user: { username: string; email: string; } | undefined` object.
The `user` object contains basic information about the user.
If it is undefined, the login was not yet successful, or the user has been logged out already.


### AuthFunctionContext

* `apiUrl: string`
* `loading: boolean`
* `login: (userIdentifier: string, password: string) => Promise<void>`
* `loggedIn: boolean`
* `logout: () => Promise<void>`
* `justLoggedOut: boolean`
* `activateEmailAddress: (userIdentifier: string, token: string) => Promise<void>`

`apiUrl` contains the url of the backend. This is exactly the same as the `apiUrl` prop passed
to `UserStore`

`loading` is true if a login request has been sent, but the reply has not yet arrived.

You can trigger a login request by calling the `login` function in your components.
It requires an identifier string, which is either the username or email of the user.
Depending on the configuration, the backend accepts either one or only one of them.

### UserContext

The `UserContext` is a react context and can be used as such. `UserStore` internally creates
a `UserContext.Provider`, and `useUserStore()` is a shorthand for `useContext(UserContext)`.
A `UserContext.Consumer` is able to consume the same parameters as [`useUserStore`](#useUserStore).

### makeGenericUserStore

If you want to load more data than just the username and email of a user, you need to configure
your django backend to use a custom `UserSerializer`.
However, if you use typescript, you will get error messages if you try to access these
additional fields from the standard user store.
In order to get typescript to use the correct types, you need to define your own `User` interface
containing all data fields, and then use `makeGenericUserStore` to create a custom set of
`UserStore`, `useUserStore` etc.

#### Parameters

Requires a type parameter for the user type.

#### Returns

An object containing custom `{ UserStore, useUserStore, UserContext }`

#### Example

```typescript
export interface MyUser {
  username: string;
  email: string;
  group: string;
}

export const { UserStore, useUserStore } = makeGenericUserStore<MyUser>();
```

After this you can use the returned values just like the standard ones, except that the
`user` object is of type `MyUser` instead of `{ username: string; email: string; }`

#### Note

If you don't use typescript, there is no need to use this function. It is merely a means to
tell typescript about your own user type.

### makeAuthRoutes

This function is the fastest way to get started with AI-KIT.
It returns an array of all the necessary frontend routes for authentication.
Call this function in your `App` component inside a `Switch`.

#### Parameters
* `basePath` specifies the common part of the path and defaults to `'/auth'`

An example `App.tsx` might look like this:

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
A wrapper for [\<Route\>](https://reacttraining.com/react-router/web/api/Route) routes that should only be available to users that are logged in.
It checks with the UserContext if the user is in fact logged in. If not, it will redirect to `/auth/login`.
During the check a loading spinner is shown.
To use custom paths or a custom loading indicator, please use [makeProtectedRoute](#makeprotectedroute).

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

### makeProtectedRoute()

This function enables you to customize the standard [ProtectedRoute](#protectedroute) Component.

#### Parameters

This function requires a single options object as parameter containing any of these parameters:

* `pathToLogin: string`, default: `'/auth/login'`
* `pathToMainPage: string`, default: `'/'`
* `loading indicator: () => JSX.Element`, defautl: `() => <CircularProgress />`

You can provide the `path*` options if you do not use the default base path or some
specific route for your main page. The `loadingIndicator` is configurable for the case that you
don't want to use Material-UI.

#### Example

```typescript jsx
const CustomProtectedRoute = makeProtectedRoute({
  loadingIndicator: () => <div>Loading...</div>,
  pathToLogin: '/authentication/login',
  pathToMainPage: '/dashboard'
});

<UserStore
  apiUrl="http://localhost:8000/api/v1/"
>
  <BrowserRouter>
    <Switch>
      <CustomProtectedRoute exact path="/dashboard">
        <div>
          Hello World
        </div>
      </CustomProtectedRoute>
    </Switch>
  </BrowserRouter>
</UserStore>

```


### LoginRoute

Use this wrapper for [\<Route\>](https://reacttraining.com/react-router/web/api/Route)
as Route for a login page, if you are not using [`makeAuthRoutes`](#makeAuthRoutes).
It uses the [`UserContext`](#UserContext) to see if a user is logged in or not.
When the user is logged in it redirects to it's referrer.
If there is no referrer, it redirects to the `main page` (default '/').
If you want to use LoginRoute with different `main page` route,
please use [makeLoginRoute](#makeloginroute).
[`makeAuthRoutes`](#makeAuthRoutes) includes this component already.

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

### makeLoginRoute()

Returns a customized [LoginRoute](#loginroute) Component.

#### Parameters

This function requires a single options object as parameter containing any of these parameters:

* `pathToMainPage: string`, default: `/`

#### Example

```typescript jsx
const MyLoginRoute = makeLoginRoute({
  pathToMainPage: '/dashboard',
});


<UserStore
  apiUrl="http://localhost:8000/api/v1/"
>
  <BrowserRouter>
    <Switch>
      <MyLoginRoute exact path="/auth/login" component={LoginView}/>
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
If the login should only be possible using a username or email only, please use
[makeLoginForm](#makeloginform).

### makeLoginForm

This function creates a custom  [LoginForm](#loginform) component.

#### Parameters

This function requires a single options object as parameter containing any of these parameters:

* `identifier: Identifier`, default: `Identifier.UsernameOrEmail`

`Identifier` is an enum that is also exported by `ai-kit-auth`, and contains
`Username`, `Email` and `UsernameAndEmail`.

#### Example

```typescript jsx
const MyLogin = makeLoginForm({ identifier: Identifier.Email });

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <MyLogin />
  </UserStore>
);

```

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


### makeActivateEmailAddress

Use this function to create a customized version of `ActivateEmailAddress`.

#### Parameters

This function requires a single options object as parameter containing any of these parameters:

* `loadingIndicator: () => JSX.Element`: a function returning a view that conveys to the user,
  that the page is loading
* `errorView: (title: string, message: string) => JSX.Element`: a function returning a view
  which displays an error message to the user
* `successView: () => JSX.Element`: a function returning a view which tells the user that
  everything worked and that they can now log into their account

#### Returns

A react functional component akin to `ActivateEmailAddress`, which can be used instead of the
standard one.

#### Example

```typescript jsx
export const MyActiveEmailAddress = makeActivateEmailAddress({
    userContext: UserContext,
    loadingIndicator: () => <div>Loading...</div>,
})
```

