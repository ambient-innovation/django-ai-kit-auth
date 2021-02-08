import React, { ComponentType } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TypographyProps } from '@material-ui/core';
import { en, Translator } from '../internationalization';
import { DefaultBackgroundImage } from '../assets/DefaultBackgroundImage';
import { User } from '../api/types';
import { DeepPartial, mergeConfig } from '../util';
import { AuthFunctionContext, makeGenericUserStore } from '..';
import { makeLoginForm } from '../components/LoginForm';
import { makeRegisterForm } from '../components/Register';
import { makeForgotPasswordForm } from '../components/ForgotPassword';
import { makeResetPasswordForm } from '../components/ResetPassword';
import { makeActivateEmailAddress } from '../components/ActivateEmailAddress';
import { makeEmailSentCard } from '../components/EmailSent';
import { AuthView, ErrorView } from '../components/AuthView';
import { ErrorCard } from '../components/ErrorCard';

export enum Identifier {
  Username = 1,
  Email= 2,
  UsernameOrEmail = 3,
}

export interface DefaultConfig {
  paths: {
    mainPage: string; // login redirects here by default
    base: string; // this path will be prepended to all other paths
    login: string;
    register: string;
    activation: string; // email activation path
    forgotPassword: string; // clicking 'forgot password' on the login page leads here
    resetPassword: string; // actual page to reset the password.
    // Only accessible via link, which is sent by email.
    emailSent: string; // success feedback after email was sent from the forgot password page
  };
  defaultTranslator: Translator;
  userIdentifier: Identifier; // what should the user type in the login screen?
  disableUserRegistration: boolean; // if true, register path is removed completely
  components: {
    backgroundImage: ComponentType;
    loadingIndicator: ComponentType; // is shown while user info is retrieved from server
  };
}

export type ComponentConfig = DeepPartial<DefaultConfig>;

export const defaultComponentConfig: DefaultConfig = {
  paths: {
    mainPage: '/', // login redirects here by default
    base: '/auth', // this path will be prepended to all other paths
    login: '/login',
    register: '/register',
    activation: '/activation', // email activation path
    forgotPassword: '/forgot-password', // clicking 'forgot password' on the login page leads here
    resetPassword: '/reset-password', // actual page to reset the password. Only accessible via link, which is sent by email.
    emailSent: '/email-sent', // success feedback after email was sent from the forgot password page
  },
  defaultTranslator: en,
  userIdentifier: Identifier.UsernameOrEmail, // what should the user type in the login screen?
  disableUserRegistration: false, // setting this to true will remove the register path completely
  components: {
    backgroundImage: () => <DefaultBackgroundImage />,
    loadingIndicator: () => <CircularProgress />,
  },
};

export interface LinkProps extends Pick<TypographyProps,
  'id'|'variant'|'color'|'classes'> {
  href: string;
}

export type UrlDescriptor = string | {
  path: string;
  query?: { [key: string]: string };
}

export interface RouteHandler {
  push: (url: UrlDescriptor) => void;
  replace: (url: UrlDescriptor) => void;
}

export interface RoutingConfig {
  routing: {
    link: ComponentType<LinkProps>;
    useRouteHandler: () => RouteHandler;
    useQueryParams: <QP extends {[key: string]: string}>() => QP;
  };
}

export type InputConfig = ComponentConfig & RoutingConfig;
export type FullConfig = DefaultConfig & RoutingConfig;

export const makeComponents = <UserType extends unknown = User>(
  config: InputConfig,
) => {
  const fullConfig = {
    ...mergeConfig(defaultComponentConfig, config),
    routing: config.routing,
  };

  const store = makeGenericUserStore<UserType>();
  const login = makeLoginForm(fullConfig);
  const register = makeRegisterForm(fullConfig);
  const forgot = makeForgotPasswordForm(fullConfig);
  const reset = makeResetPasswordForm(fullConfig);
  const activate = makeActivateEmailAddress(fullConfig);
  const emailSent = makeEmailSentCard(fullConfig);

  return {
    ...store,
    ...login,
    ...register,
    ...forgot,
    ...reset,
    ...activate,
    ...emailSent,
    AuthFunctionContext,
    AuthView,
    ErrorCard,
    ErrorView,
    fullConfig,
  };
};
