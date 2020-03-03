import React, {
  FC, ComponentType, useContext,
} from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserContext } from '../store/types';
import { UserContext as StardardUserContext } from '../store/UserStore';

export interface ProtectedRouteProps extends RouteProps {
  path: string;
}

export interface ProtectedRouteOptions<User> {
  userContext: UserContext<User>;
  pathToLogin?: string;
  pathToMainPage?: string;
  loadingIndicator: ComponentType;
}

export const makeProtectedRoute: <User>(
  options: ProtectedRouteOptions<User>,
) => FC<ProtectedRouteProps> = ({
  userContext,
  pathToLogin = 'auth/login',
  pathToMainPage = '/',
  loadingIndicator,
}) => ({
  component,
  render,
  children,
  ...routerProps
}) => {
  const { user, loading } = useContext(userContext);
  const pathname = routerProps.location?.pathname || pathToMainPage;

  if (loading) return <Route {...routerProps} component={loadingIndicator} />;
  if (!user) {
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

export const ProtectedRoute = makeProtectedRoute({
  userContext: StardardUserContext,
  loadingIndicator: () => <CircularProgress />,
});
