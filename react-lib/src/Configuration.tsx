import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { Route } from 'react-router-dom';
import { AuthFunctionContext, makeGenericUserStore } from './store/UserStore';
import { makeActivateEmailAddress } from './components/ActivateEmailAddress';
import { makeProtectedRoute } from './components/ProtectedRoute';
import { makeLoginForm } from './components/LoginForm';
import { makeLoginRoute } from './components/LoginRoute';
import { makeForgotPasswordForm } from './components/ForgotPasswordForm';
import { makeEmailSentCard } from './components/EmailSentCard';
import { AuthView, ErrorView } from './components/AuthView';
import { ErrorCard } from './components/ErrorCard';
import { User } from './api/types';

export enum Identifier {
  Username = 1,
  Email= 2,
  UsernameOrEmail = 3,
}

export const defaultConfig = {
  paths: {
    mainPage: '/',
    base: '/auth',
    login: '/login',
    activation: '/activation/:ident/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    emailSent: '/email-sent',
  },
  userIdentifier: Identifier.UsernameOrEmail,
  components: {
    loadingIndicator: () => <CircularProgress />,
  },
};

export type FullConfig = typeof defaultConfig;

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export type Configuration = DeepPartial<FullConfig>;

export const mergeConfig: <T extends {}>(
  defaults: T, configs: DeepPartial<T>,
) => T = <T extends {}>(
  defaults: T, configs: DeepPartial<T>,
) => {
  const fullConfig = { ...defaults };
  if (configs) {
    Object.entries(configs).forEach(([key, value]) => {
      if (typeof value === 'object') {
        fullConfig[key as keyof T] = mergeConfig(
          defaults[key as keyof T],
          value as DeepPartial<T[keyof T]>,
        );
      } else {
        fullConfig[key as keyof T] = value as T[keyof T];
      }
    });
  }

  return fullConfig;
};

export const configureAuth = <UserType extends unknown = User>(config: Configuration) => {
  const fullConfig = mergeConfig(defaultConfig, config);

  // Prepend base path to auth paths
  const { base } = fullConfig.paths;
  Object.keys(fullConfig.paths).forEach((key) => {
    switch (key) {
      case 'activation':
        fullConfig.paths[key] = `${base}${fullConfig.paths[key]}/:ident/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})`;
        break;
      case 'login':
      case 'forgotPassword':
      case 'resetPassword':
      case 'emailSent':
        fullConfig.paths[key] = `${base}${fullConfig.paths[key]}`;
        break;
      case 'mainPage':
      case 'base':
        break;
      default:
        throw new Error(`No path configuration for path '${key}. This is likely a bug in ai-auth-kit.`);
    }
  });

  const store = makeGenericUserStore<UserType>();
  const login = makeLoginForm(fullConfig);
  const forgot = makeForgotPasswordForm(fullConfig);
  const activate = makeActivateEmailAddress(fullConfig);
  const ProtectedRoute = makeProtectedRoute(fullConfig);
  const LoginRoute = makeLoginRoute(fullConfig);
  const EmailSentCard = makeEmailSentCard(fullConfig);

  const listAuthRoutes: () => JSX.Element[] = () => [
    <Route
      exact
      path={fullConfig.paths.activation}
      component={activate.ActivateEmailAddress}
      key="activation"
    />,
    <LoginRoute
      exact
      path={fullConfig.paths.login}
      component={login.LoginView}
      key="login"
    />,
    <LoginRoute
      exact
      path={fullConfig.paths.forgotPassword}
      component={forgot.ForgotPasswordView}
      key="forgot-password"
    />,
  ];

  return ({
    ...store,
    ...login,
    ...forgot,
    ...activate,
    ProtectedRoute,
    LoginRoute,
    EmailSentCard,
    AuthFunctionContext,
    AuthView,
    ErrorCard,
    ErrorView,
    listAuthRoutes,
  });
};
