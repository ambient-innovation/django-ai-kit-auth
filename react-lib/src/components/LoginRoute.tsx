import React, { FC, useContext } from 'react';
import {
  Redirect,
  Route,
  RouteProps,
} from 'react-router-dom';
import { Location } from 'history';

import { UserContext } from '../store/types';
import { UserContext as StandardUserContext } from '../store/UserStore';

interface LocationState {
  from: {
    pathname: string;
  };
}
interface LoginRouteProps extends RouteProps {
  location?: Location<LocationState>;
}

interface LoginRouteOptions<User> {
  userContext: UserContext<User>;
  pathToMainPage?: string;
}

export const makeLoginRoute: <User>(
  options: LoginRouteOptions<User>,
) => FC<LoginRouteProps> = ({
  userContext,
  pathToMainPage = '/',
}) => ({
  children,
  ...routeProps
}) => {
  const { user } = useContext(userContext);
  const { from } = routeProps.location?.state
    || { from: { pathname: pathToMainPage } };

  if (user) return <Redirect to={from} />;

  return (
    <Route {...routeProps}>
      {children}
    </Route>
  );
};

export const LoginRoute = makeLoginRoute({
  userContext: StandardUserContext,
});
