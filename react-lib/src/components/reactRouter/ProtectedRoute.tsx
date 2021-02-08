import React, { FC, useContext } from 'react';
import {
  Redirect, Route, RouteProps, useLocation,
} from 'react-router-dom';
import { AuthFunctionContext } from '../..';
import { FullConfig } from '../../config/Components';

export const makeProtectedRoute = ({
  paths: { mainPage, login },
  components: { loadingIndicator },
}: FullConfig): FC<RouteProps> => ({
  component,
  render,
  children,
  ...routeProps
}) => {
  const { loggedIn, loading } = useContext(AuthFunctionContext);
  const location = useLocation();
  const pathname = location.pathname || mainPage;

  if (loading) return <Route {...routeProps} component={loadingIndicator} />;
  if (!loggedIn) {
    return <Redirect to={`${login}?next=${pathname}`} />;
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
