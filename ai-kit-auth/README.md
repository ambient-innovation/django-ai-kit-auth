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

### makeProtectedRoute

### loginRoute

### makeLoginRoute

### LoginView

### LoginForm

### makeLoginForm

## Local Development

Start the demo project with docker-compose

    cd demo
    docker-compose up -d

Start the npm watch script in the react-lib folder

    npm run watch

Changes to the library will automatically be shown and updated in the demo project
