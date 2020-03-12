import React, {
  FC, ComponentType, useContext,
} from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AuthFunctionContext } from '../store/UserStore';

export interface ProtectedRouteOptions {
  pathToLogin?: string;
  pathToMainPage?: string;
  loadingIndicator?: ComponentType;
}

export const makeProtectedRoute: (
  options: ProtectedRouteOptions,
) => FC<RouteProps> = ({
  pathToLogin = '/auth/login',
  pathToMainPage = '/',
  loadingIndicator = () => <CircularProgress />,
}) => ({
  component,
  render,
  children,
  ...routerProps
}) => {
  const { loggedIn, loading } = useContext(AuthFunctionContext);
  const pathname = routerProps.location?.pathname || pathToMainPage;

  if (loading) return <Route {...routerProps} component={loadingIndicator} />;
  if (!loggedIn) {
    return (
      <Redirect to={{
        pathname: pathToLogin,
        state: { from: pathname },
      }}
      />
    );
  }

  return (
    <Route
      {...routerProps}
      component={component}
      render={render}
    >
      {children}
    </Route>
  );
};

export const ProtectedRoute = makeProtectedRoute({});
