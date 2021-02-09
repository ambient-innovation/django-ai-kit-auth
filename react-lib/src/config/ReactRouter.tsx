import { Route } from 'react-router-dom';
import React from 'react';
import { User } from '../api/types';
import { ComponentConfig, makeComponents } from './components';
import { Translator } from '../internationalization';
import { makeLoginRoute } from '../components/reactRouter/LoginRoute';
import { makeProtectedRoute } from '../components/reactRouter/ProtectedRoute';
import { Link } from '../components/reactRouter/Link';
import { useRouteHandler } from '../components/reactRouter/useRouteHandler';
import { useQueryParams } from '../components/reactRouter/useQueryParams';

export const configureAuth = <UserType extends unknown = User>(config: ComponentConfig) => {
  const components = makeComponents({
    ...config,
    routing: {
      link: Link,
      useRouteHandler,
      useQueryParams,
    },
  });
  const { fullConfig } = components;

  const LoginRoute = makeLoginRoute(fullConfig);
  const ProtectedRoute = makeProtectedRoute(fullConfig);

  const makeAuthRoutes: (translator?: Translator) => JSX.Element[] = (
    translator = fullConfig.defaultTranslator,
  ) => [
    <Route
      exact
      path={fullConfig.paths.activation}
      render={() => <components.ActivateEmailAddress translator={translator} />}
      key="activation"
    />,
    <LoginRoute
      exact
      path={fullConfig.paths.login}
      render={() => <components.LoginView translator={translator} />}
      key="login"
    />,
    ...fullConfig.disableUserRegistration ? [] : [
      <Route
        exact
        path={fullConfig.paths.register}
        render={() => <components.RegisterView translator={translator} />}
        key="register"
      />,
    ],
    <LoginRoute
      exact
      path={fullConfig.paths.forgotPassword}
      render={() => <components.ForgotPasswordView translator={translator} />}
      key="forgot-password"
    />,
    <Route
      exact
      path={fullConfig.paths.emailSent}
      render={() => <components.EmailSentView translator={translator} />}
      key="email-sent"
    />,
    <Route
      exact
      path={fullConfig.paths.resetPassword}
      render={() => <components.ResetPasswordView translator={translator} />}
      key="reset-password"
    />,
  ];

  return ({
    ...components,
    ProtectedRoute,
    LoginRoute,
    makeAuthRoutes,
  });
};
