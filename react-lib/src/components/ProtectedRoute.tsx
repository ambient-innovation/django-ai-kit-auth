import React, { FC, useContext } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { UserContext } from '../store/UserStore';

interface ProtectedRouteProps extends RouteProps {
  path: string;
  redirectToLogin: FC;
  loadingIndicator: FC;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  path,
  redirectToLogin,
  loadingIndicator,
  component,
  render,
  children,
  ...rest
}) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Route {...rest} path={path} component={loadingIndicator} />;
  if (!user) return <Route {...rest} path={path} component={redirectToLogin} />;

  return <Route {...rest} path={path} component={component} render={render}>{children}</Route>;
};
