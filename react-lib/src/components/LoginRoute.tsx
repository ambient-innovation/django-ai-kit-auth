import React, { FC, useContext } from 'react';
import {
  Redirect,
  Route,
  RouteProps,
} from 'react-router-dom';
import { Location } from 'history';

import { AuthFunctionContext } from '../store/UserStore';
import { FullConfig } from '../Configuration';

export interface LocationState {
  from: {
    pathname: string;
  };
}
export interface LoginRouteProps extends RouteProps {
  location?: Location<LocationState>;
}

export const makeLoginRoute: (
  config: FullConfig,
) => FC<LoginRouteProps> = ({
  paths: { mainPage },
}) => ({
  children,
  ...routeProps
}) => {
  const { loggedIn } = useContext(AuthFunctionContext);
  const { from } = routeProps.location?.state
    || { from: { pathname: mainPage } };

  if (loggedIn) return <Redirect to={from} />;

  return (
    <Route {...routeProps}>
      {children}
    </Route>
  );
};
