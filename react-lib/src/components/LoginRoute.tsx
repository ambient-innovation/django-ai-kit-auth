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
  components: { loadingIndicator },
}) => ({
  children,
  ...routeProps
}) => {
  const { loading, loggedIn } = useContext(AuthFunctionContext);
  const { from } = routeProps.location?.state
    || { from: { pathname: mainPage } };

  if (loading) return <Route {...routeProps} component={loadingIndicator} />;
  if (loggedIn) return <Redirect to={from} />;

  return (
    <Route {...routeProps}>
      {children}
    </Route>
  );
};
