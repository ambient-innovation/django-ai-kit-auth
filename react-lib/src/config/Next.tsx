import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ComponentConfig, FullConfig, makeComponents } from './components';
import { User } from '../api/types';
import { Link } from '../components/next/Link';
import { useQueryParams } from '../components/next/useQueryParams';
import { Translator } from '../internationalization';

export const authPathFilter = (fullConfig: FullConfig) => (path: string) => {
  const { paths } = fullConfig;

  return path !== paths.base && path !== paths.mainPage;
};

export const pathToParam = (fullConfig: FullConfig) => (path: string) => {
  const { base } = fullConfig.paths;

  // remove base path and leading '/' from path
  return path.slice(Math.max(0, base.length + 1));
};

export interface AuthPageProps {
  t?: Translator;
  authpage?: string;
}

export interface StaticAuthPaths extends ParsedUrlQuery {
  authpage: string;
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
          return components.LoginView;
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

  const AuthPage: FC<AuthPageProps> = ({ t, authpage }) => {
    const Component = getAuthComponent(authpage);

    if (!Component) return null;

    return <Component translator={t} />;
  };

  const getStaticAuthProps: GetStaticProps<AuthPageProps, StaticAuthPaths> = async ({
    params,
  }) => {
    const authpage = params?.authpage;

    return { props: { authpage } };
  };

  const getStaticAuthPaths: GetStaticPaths<StaticAuthPaths> = async ({
    locales,
  }) => {
    const { paths } = fullConfig;
    const authpages = Object.values(paths)
      .filter(authPathFilter(fullConfig))
      .map(pathToParam(fullConfig));

    return ({
      paths: authpages.reduce<GetStaticPathsResult<StaticAuthPaths>['paths']>(
        (array, authpage) => [
          ...array,
          ...(locales ? locales.map(
            (locale: string|undefined) => ({ params: { authpage }, locale }),
          ) : [{ params: { authpage } }]),
        ], [],
      ),
      fallback: false,
    });
  };

  return {
    ...components,
    AuthPage,
    getStaticAuthProps,
    getStaticAuthPaths,
  };
};
