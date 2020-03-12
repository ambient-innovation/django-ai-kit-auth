import React, { FC, useContext } from 'react';
import {
  Redirect,
  Route,
  RouteProps,
} from 'react-router-dom';
import { Location } from 'history';

import { AuthFunctionContext } from '../store/UserStore';

export interface LocationState {
  from: {
    pathname: string;
  };
}
export interface LoginRouteProps extends RouteProps {
  location?: Location<LocationState>;
}

export interface LoginRouteOptions {
  pathToMainPage?: string;
}

export const makeLoginRoute: (
  options: LoginRouteOptions,
) => FC<LoginRouteProps> = ({
  pathToMainPage = '/',
}) => ({
  children,
  ...routeProps
}) => {
  const { loggedIn } = useContext(AuthFunctionContext);
  const { from } = routeProps.location?.state
    || { from: { pathname: pathToMainPage } };

  if (loggedIn) return <Redirect to={from} />;

  return (
    <Route {...routeProps}>
      {children}
    </Route>
  );
};

export const LoginRoute = makeLoginRoute({});
