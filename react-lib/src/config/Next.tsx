import React, { FC, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  InputConfig, makeComponents,
} from './components';
import { User } from '../api/types';
import { Link } from '../components/next/Link';
import { useQueryParams } from '../components/next/useQueryParams';
import { Translator, TranslatorProps, AuthFunctionContext } from '..';


export interface NextConfig extends Omit<InputConfig, 'routing'> {
  routing?: InputConfig['routing'];
}

export interface AuthPageProps {
  t?: Translator;
}

export const configureAuth = <UserType extends unknown = User>(config: NextConfig) => {
  const components = makeComponents({
    routing: {
      link: Link,
      useRouteHandler: useRouter,
      useQueryParams,
    },
    ...config,
  });
  const { fullConfig } = components;

  const LoginComponent: FC<TranslatorProps> = (props) => {
    const { loggedIn } = useContext(AuthFunctionContext);
    const { replace, query } = useRouter();
    const nextUrl = useMemo(() => {
      const next: string|undefined = Array.isArray(query.next) ? query.next[0] : query.next;

      return next ?? components.fullConfig.paths.mainPage;
    }, [query]);

    if (loggedIn) {
      replace(nextUrl);

      return null;
    }

    return <components.LoginView {...props} />;
  };

  const getAuthComponent = (authpage?: string) => {
    if (authpage) {
      switch (`${fullConfig.paths.base}/${authpage}`) {
        case fullConfig.paths.activation:
          return components.ActivationView;
        case fullConfig.paths.emailSent:
          return components.EmailSentView;
        case fullConfig.paths.forgotPassword:
          return components.ForgotPasswordView;
        case fullConfig.paths.login:
          return LoginComponent;
        case fullConfig.paths.resetPassword:
          return components.ResetPasswordView;
        case fullConfig.paths.register:
          if (!fullConfig.disableUserRegistration) {
            return components.RegisterView;
          }
          break;
        default:
          break;
      }
    }

    return null;
  };

  const AuthPage: FC<AuthPageProps> = ({ t }) => {
    const { query } = useRouter();
    const { authpage } = query;
    const Component = useMemo(() => getAuthComponent(
      Array.isArray(authpage) ? authpage[0] : authpage,
    ), [authpage]);

    if (!Component) return null;

    return <Component translator={t} />;
  };

  return {
    ...components,
    LoginComponent,
    AuthPage,
  };
};
