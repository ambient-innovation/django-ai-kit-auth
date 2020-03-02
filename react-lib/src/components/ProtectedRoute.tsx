import React, { FC, ComponentType, useContext, Context } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserStoreValue } from '../store/types';
import { UserContext as StardardUserContext } from '../store/UserStore';

interface ProtectedRouteProps extends RouteProps {
  path: string;
}

interface ProtectedRouteOptions<User> {
  userContext: UserContext<User>;
  pathToLogin?: string;
  pathToMainPage?: string;
  loadingIndicator: ComponentType;
}

type UserContext<User> = Context<UserStoreValue<User>>;

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

export default makeProtectedRoute({
  userContext: StardardUserContext,
  loadingIndicator: CircularProgress,
});
