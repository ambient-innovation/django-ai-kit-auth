import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { ComponentConfig, makeComponents } from './components';
import { User } from '../api/types';
import { Link } from '../components/next/Link';
import { useQueryParams } from '../components/next/useQueryParams';
import { Translator } from '../internationalization';

export interface AuthPageProps {
  t?: Translator;
}

export const configureAuth = <UserType extends unknown = User>(config?: ComponentConfig) => {
  const components = makeComponents({
    ...config,
    routing: {
      link: Link,
      useRouteHandler: useRouter,
      useQueryParams,
    },
  });
  const { fullConfig } = components;

  const AuthPage: FC<AuthPageProps> = ({ t }) => {
    const { query: { authpage } } = useRouter();

    console.log('AuthPage', authpage);

    switch (authpage) {
      case fullConfig.paths.activation:
        return <components.ActivationView translator={t} />;
      case fullConfig.paths.emailSent:
        return <components.EmailSentView translator={t} />;
      case fullConfig.paths.forgotPassword:
        return <components.ForgotPasswordView translator={t} />;
      case fullConfig.paths.login:
        return <components.LoginView translator={t} />;
      case fullConfig.paths.resetPassword:
        return <components.ResetPasswordView translator={t} />;
      case fullConfig.paths.register:
        if (!fullConfig.disableUserRegistration) {
          return <components.RegisterView translator={t} />;
        }
      // eslint-disable-next-line no-fallthrough
      default:
        return null;
    }
  };

  return {
    ...components,
    AuthPage,
  };
};
