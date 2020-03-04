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

## Usage

AI-KIT: Authentication provides the following components and functions:
* UserStore
    * [UserStore](#userstore)
    * [useUserStore](#useuserstore)
    * [UserContext](#usercontext)
    * [makeGenericUserStore](#makegenericuserstore)
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

### UserStore

This component provides user data and authentication helper functions to its children via
react context.
For AI-KIT: Authentication to work correctly, it is necessary to place it high in your
component tree, so that it contains any components which might try to access user information,
or perform user actions like login, logout etc.
An example `App.tsx` might look like this:

```typescript jsx
import React from 'react';
import { UserStore } from 'ai-kit-auth';
import ...

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <BrowserRouter>
      ...
    </BrowserRouter>
  </UserStore>
);

export default App;
```

The `apiUrl` prop tells the store, where to send login requests.
This should be the url to the django backend of your project.

### useUserStore

`useUserStore` is a react hook, which can be used to obtain user information and helper
functions stored in the `UserStore`. It returns an object containing the following entries:

* `user: { username: string; email: string; } | undefined`
* `loading: boolean`
* `login: (userIdentifier: string, password: string) => Promise<{ username: string; email: string; }>`

The `user` object contains basic information about the user.
If it is undefined, the login was not yet successful, or the user has been logged out already.

`loading` is true if a login request has been sent, but the reply has not yet arrived.

You can trigger a login request by calling the `login` function in your components.
It requires an identifier string, which is either the username or email of the user.
Depending on the configuration, the backend accepts either one or only one of them.

### UserContext

The `UserContext` is a react context and can be used as such. `UserStore` internally creates
a `UserContext.Provider`, and `useUserStore()` is a shorthand for `useContext(UserContext)`.

### makeGenericUserStore

If you want to load more data than just the username and email of a user, you need to configure
your django backend to use a custom `UserSerializer`.
However, if you use typescript, you will get error messages if you try to access these
additional fields from the standard user store.
In order to get typescript to use the correct types, you need to define your own `User` interface
containing all data fields, and then use `makeGenericUserStore` to create a custom set of
`UserStore`, `useUserStore` etc.
Example:

```typescript
interface MyUser {
  username: string;
  email: string;
  group: string;
}

export const { UserStore, useUserStore } = makeGenericUserStore<MyUser>();
```

After this you can use the returned values just like the standard ones, except that the
`user` object is of type `MyUser` instead of `{ username: string; email: string; }`

### ProtectedRoute
A wrapper for [\<Route\>](https://reacttraining.com/react-router/web/api/Route) routes that should only be available to users that are logged in.
It checks with the UserContext if the user is in fact logged in. If not, it will redirect to the login page.
During the check a loading spinner is shown.
To use a custom UserContext, custom paths or a custom loading indicator, please use [makeProtectedRoute](#makeprotectedroute).
Example usage:

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
Returns a [ProtectedRoute](#protectedroute) Component. Requires you to pass the UserContext you are using, as well as a loading indicator
and allows you to pass a path for the `main page` and `login page`.
Example usage:

```typescript jsx
const CustomProtectedRoute = makeProtectedRoute({
  userContext: StardardUserContext,
  loadingIndicator: () => <CircularProgress />,
  pathToLogin: '/auth/login',
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
A wrapper for [\<Route\>](https://reacttraining.com/react-router/web/api/Route) that uses the UserContext
to see if the user is logged in or not. When the user is logged in it redirects to it's referrer.
If there is no referrer, it redirects to the `main page` (default '/').
If you want to use LoginRoute with a custom UserContext or a different `main page`, please use [makeLoginRoute](#makeloginroute)
Example usage:

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
Returns a [LoginRoute](#loginroute) Component. Requires you to pass the UserContext you are using and allows you to pass a path for the `main page`.
Example usage:

```typescript jsx
const MyLoginRoute = makeLoginRoute({
  userContext: myUserContext,
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
Styled page wrapper for a LoginForm. You can pass your own [LoginForm](#loginform) Component
created with [makeLoginForm](#makeloginform) as a child if you do not want the default [LoginForm](#loginform) Component.

Example usage with default LoginForm (Username and Email):

```typescript jsx
const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <LoginView />
  </UserStore>
);
```
 Example usage with custom LoginForm (Email only):

```typescript jsx
const MyLogin = makeLoginForm({ identifier: Identifier.Email });

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <LoginView>
      <MyLogin />
    </LoginView>
  </UserStore>
);
```
### LoginForm

`LoginForm` is a react component that provides a [Material UI Paper](https://material-ui.com/components/paper/) wrapper and contains two input fields (username/email and password) and a submit button.
If the login should only be possible using a username or email only, please use [makeLoginForm](#makeloginform).

### makeLoginForm()
`makeLoginForm` returns a [LoginForm](#loginform) component and requires you to pass an `Identifier` (Username, Email or UsernameAndEmail).
Example Usage:

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

## Local Development

Start the demo project with docker-compose

    cd demo
    docker-compose up -d
    
Start the npm watch script in the react-lib folder

    npm run watch
    
Changes to the library will automatically be shown and updated in the demo project
