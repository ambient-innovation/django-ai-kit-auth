import React from 'react';
import { LoginRoute } from './LoginRoute';
import { LoginView } from './LoginView';

export const normalizePath = (path: string) => `${path.replace(
  /\/$/, '',
)}`;

export const makeAuthRoutes = (basePath = '/auth') => {
  const normPath = normalizePath(basePath);

  return [
    <LoginRoute path={`${normPath}/login`} component={LoginView} />,
  ];
};
