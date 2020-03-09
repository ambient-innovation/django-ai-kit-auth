import React from 'react';
import { Route } from 'react-router-dom';
import { LoginRoute } from './LoginRoute';
import { LoginView } from './AuthView';
import { ActivateEmailAddress } from './ActivateEmailAddress';

export const normalizePath = (path: string) => `${path.replace(
  /\/$/, '',
)}`;

export const makeAuthRoutes = (basePath = '/auth') => {
  const normPath = normalizePath(basePath);

  return [
    <Route
      exact
      path={`${normPath}/activation`}
      component={ActivateEmailAddress}
      key="activation"
    />,
    <LoginRoute path={`${normPath}/login`} component={LoginView} key="login" />,
  ];
};
