import React, { FC, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  InputConfig, makeComponents, MakeComponentsResult,
} from './components';
import { User } from '../api/types';
import { Link } from '../components/next/Link';
import { useQueryParams } from '../components/next/useQueryParams';
import { makePrivateProtection } from '../components/next/PrivateProtection';
import { Translator, TranslatorProps } from '../internationalization';
import { AuthFunctionContext } from '../store/UserStore';

export interface NextConfig extends Omit<InputConfig, 'routing'> {
  routing?: InputConfig['routing'];
}

export interface AuthPageProps {
  t?: Translator;
}

export interface ConfigureAuthNextResult<U extends unknown>
  extends MakeComponentsResult<U>
{
  LoginComponent: FC<TranslatorProps>;
  AuthPage: FC<AuthPageProps>;
  PrivateProtection: FC;
}

export function configureAuthNext<UserType extends unknown = User>(
  config: NextConfig,
): ConfigureAuthNextResult<UserType> {
  const components = makeComponents<UserType>({
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
    const urlToBeVisitedNext = useMemo(() => {
      const next: string|undefined = Array.isArray(query.next) ? query.next[0] : query.next;

      return next ?? components.fullConfig.paths.mainPage;
    }, [query]);

    if (loggedIn) {
      replace(urlToBeVisitedNext);

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

  const PrivateProtection = makePrivateProtection(fullConfig);

  return {
    ...components,
    LoginComponent,
    AuthPage,
    PrivateProtection,
  };
}
