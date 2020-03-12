import React from 'react';
import { Route } from 'react-router-dom';
import { LoginRoute } from './LoginRoute';
import { ForgotPasswordView, LoginView } from './AuthView';
import { ActivateEmailAddress } from './ActivateEmailAddress';

export const normalizePath = (path: string) => `${path.replace(
  /\/$/, '',
)}`;

export const makeAuthRoutes = (basePath = '/auth') => {
  const normPath = normalizePath(basePath);

  return [
    <Route
      exact
      path={`${normPath}/activation/:ident/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})`}
      component={ActivateEmailAddress}
      key="activation"
    />,
    <LoginRoute exact path={`${normPath}/login`} component={LoginView} key="login" />,
    <LoginRoute
      exact
      path={`${normPath}/forgot-password`}
      component={ForgotPasswordView}
      key="forgot-password"
    />,
  ];
};
