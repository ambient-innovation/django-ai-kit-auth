import React, { FC, useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AuthFunctionContext } from '../store/UserStore';
import { FullConfig } from '../Configuration';

export const makeProtectedRoute: (
  config: FullConfig,
) => FC<RouteProps> = ({
  paths: { mainPage, login },
  components: { loadingIndicator },
}) => ({
  component,
  render,
  children,
  ...routeProps
}) => {
  const { loggedIn, loading } = useContext(AuthFunctionContext);
  const pathname = routeProps.location?.pathname || mainPage;

  if (loading) return <Route {...routeProps} component={loadingIndicator} />;
  if (!loggedIn) {
    return (
      <Redirect to={{
        pathname: login,
        state: { from: pathname },
      }}
      />
    );
  }

  return (
    <Route
      {...routeProps}
      component={component}
      render={render}
    >
      {children}
    </Route>
  );
};
