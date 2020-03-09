import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import { LoginRoute } from './LoginRoute';
import { LoginView } from './LoginView';

export const normalizePath = (path: string) => `${path.replace(
  /\/$/, '',
)}`;

interface AuthRoutesProps {
  path?: string;
}

export const AuthRoutes: FC<AuthRoutesProps> = ({
  path = '/auth',
  children,
}) => {
  if (children) console.warn('Children passed to AuthRoutes will be ignored!');

  const normPath = normalizePath(path);

  return (
    <Route path={normPath}>
      <LoginRoute path={`${normPath}/login`} component={LoginView} />
    </Route>
  );
};
