import { ComponentType, Context, FC } from 'react';
import { TypographyProps } from '@material-ui/core';
import { en, Translator } from '../internationalization';
import { DefaultBackgroundImage } from '../assets/DefaultBackgroundImage';
import { User } from '../api/types';
import { DeepPartial, mergeConfig } from '../util';
import { AuthFunctionContext, makeGenericUserStore } from '..';
import { makeLoginForm, MakeLoginFormResult } from '../components/LoginForm';
import { makeRegisterForm, MakeRegisterFormResult } from '../components/Register';
import { makeForgotPasswordForm, MakeForgotPasswordFormResult } from '../components/ForgotPassword';
import { makeResetPasswordForm, MakeResetPasswordFormResult } from '../components/ResetPassword';
import { makeActivateEmailAddress, MakeActivateEmailAddressResult } from '../components/ActivateEmailAddress';
import { makeEmailSentCard, MakeEmailSentCardResult } from '../components/EmailSent';
import {
  AuthView, AuthViewProps, ErrorView, ErrorViewProps,
} from '../components/AuthView';
import { ErrorCard, ErrorCardProps } from '../components/ErrorCard';
import { ApiConfig, MakeGenericUserStoreResult } from '../store/UserStore';
import { AuthFunctionContextValue } from '../store/types';
import LoadingIndicator from '../components/LoadingIndicator';

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
    backgroundImage: DefaultBackgroundImage,
    loadingIndicator: LoadingIndicator,
  },
};

export interface LinkProps extends Pick<TypographyProps,
  'id'|'variant'|'color'|'classes'> {
  href: string;
}

export type UrlDescriptor = string | {
  pathname: string;
  query?: { [key: string]: string };
}

export interface RouteHandler {
  push: (url: UrlDescriptor) => void;
  replace: (url: UrlDescriptor) => void;
}

export interface MandatoryConfig {
  routing: {
    link: ComponentType<LinkProps>;
    useRouteHandler: () => RouteHandler;
    useQueryParams: () => Record<string, string>;
  };
  api: ApiConfig;
}

export type InputConfig = DeepPartial<DefaultConfig> & MandatoryConfig;
export type FullConfig = DefaultConfig & MandatoryConfig;

export interface MakeComponentsResult<U extends unknown> extends
  MakeGenericUserStoreResult<U>,
  MakeLoginFormResult,
  MakeRegisterFormResult,
  MakeForgotPasswordFormResult,
  MakeResetPasswordFormResult,
  MakeActivateEmailAddressResult,
  MakeEmailSentCardResult
{
  AuthFunctionContext: Context<AuthFunctionContextValue>;
  AuthView: FC<AuthViewProps>;
  ErrorCard: FC<ErrorCardProps>;
  ErrorView: FC<ErrorViewProps>;
  fullConfig: FullConfig;
}

export function makeComponents <UserType extends unknown = User>(
  config: InputConfig,
): MakeComponentsResult<UserType> {
  const fullConfig: FullConfig = {
    ...mergeConfig(defaultComponentConfig, config),
    routing: config.routing,
    api: config.api,
  };

  const { base } = fullConfig.paths;
  Object.keys(fullConfig.paths).forEach((key) => {
    switch (key) {
      case 'activation':
      case 'resetPassword':
      case 'login':
      case 'register':
      case 'forgotPassword':
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
  const store = makeGenericUserStore<UserType>(fullConfig.api);
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
}
