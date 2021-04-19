import React, {
  Context,
  createContext, FC, useContext, useEffect, useMemo, useState,
} from 'react';
import axios from 'axios';
import { PasswordValidationInput, User } from '../api/types';
import {
  activateEmailAddressAPI,
  loginAPI,
  logoutAPI,
  meAPI,
  registerAPI,
  resetPasswordAPI,
  sendPWResetEmail,
  validatePasswordAPI,
} from '../api/api';
import { AuthFunctionContextValue, LogoutReason, UserStoreValue } from './types';

export interface ApiConfig {
  url: string;
  authPath: string;
}

export interface UserStoreProps<U extends unknown> {
  initialUser?: U;
  initialCsrf?: string;
}

export type MockUserStoreProps<U extends unknown=User> =
  Partial<UserStoreValue<U> & AuthFunctionContextValue>;

export const noop: () => void = () => null;
export const dontResolvePromise = <T extends unknown=void>(): Promise<T> => new Promise<T>(noop);
export const errorPromise = (): Promise<never> => Promise.reject(new Error(
  'Could not find an AI-Authentication User Store in the component tree! Make sure, that you included a UserStore component in your component tree and that you did not mix components from different configurations!',
));

export const AuthFunctionContext = createContext<AuthFunctionContextValue>({
  loading: false,
  apiUrl: '',
  csrf: '',
  axiosRequestConfig: {},
  login: errorPromise,
  loggedIn: false,
  logout: errorPromise,
  updateUserInfo: errorPromise,
  justLoggedOut: LogoutReason.NONE,
  activateEmailAddress: errorPromise,
  validatePassword: errorPromise,
  requestPasswordReset: errorPromise,
  resetPassword: errorPromise,
  register: errorPromise,
});

export interface MakeGenericUserStoreResult<U extends unknown> {
  UserContext: Context<UserStoreValue<U>>;
  UserStore: FC<UserStoreProps<U>>;
  MockUserStore: FC<MockUserStoreProps<U>>;
  useUserStore: () => UserStoreValue<U>&AuthFunctionContextValue;
}

export function makeGenericUserStore<U extends unknown = User>(
  { url: apiUrl, authPath: apiAuthPath }: ApiConfig,
): MakeGenericUserStoreResult<U> {
  const UserContext = createContext<UserStoreValue<U>>({ user: null });

  const UserStore: FC<UserStoreProps<U>> = ({
    children, initialCsrf, initialUser,
  }) => {
    const [loggedOut, setLoggedOut] = useState<LogoutReason>(LogoutReason.NONE);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<U|null>(initialUser ?? null);
    const [csrf, setCsrf] = useState(initialCsrf ?? '');

    const axiosRequestConfig = useMemo(() => ({
      withCredentials: true,
      baseURL: apiUrl,
      headers: {
        ...axios.defaults.headers,
        common: {
          ...axios.defaults.headers.common,
          'X-CSRFToken': csrf,
        },
      },
    }), [csrf]);

    const login: (userIdentifier: string, password: string) => Promise<void> = (
      userIdentifier, password,
    ) => {
      setLoading(true);

      return loginAPI<U>(apiAuthPath, userIdentifier, password, axiosRequestConfig)
        .then((loginData) => {
          setUser(loginData.user);
          setCsrf(loginData.csrf);
        })
        .finally(() => setLoading(false));
    };

    const logout: (reason?: LogoutReason) => Promise<void> = (
      reason = LogoutReason.USER,
    ) => {
      setLoading(true);

      return logoutAPI(apiAuthPath, axiosRequestConfig)
        .then((logoutData) => {
          setUser(null);
          setCsrf(logoutData.csrf);
          setLoggedOut(reason);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const updateUserInfo: () => Promise<void> = () => meAPI<U>(
      apiAuthPath, axiosRequestConfig,
    )
      .then((data) => {
        setUser(data.user);
        setCsrf(data.csrf);
      })
      .finally(() => setLoading(false));

    const activateEmailAddress: (
      userIdentifier: string, token: string,
    ) => Promise<void> = (
      userIdentifier, token,
    ) => activateEmailAddressAPI(apiAuthPath, userIdentifier, token, axiosRequestConfig)
      .then(noop);

    const validatePassword: (
      input: PasswordValidationInput,
    ) => Promise<void> = (
      input,
    ) => validatePasswordAPI(apiAuthPath, input, axiosRequestConfig).then(noop);

    const requestPasswordReset: (email: string) => Promise<void> = (
      email: string,
    ) => sendPWResetEmail(apiAuthPath, email, axiosRequestConfig).then(noop);

    const resetPassword: (
      ident: string, token: string, password: string,
    ) => Promise<void> = (
      ident, token, password,
    ) => resetPasswordAPI(apiAuthPath, ident, token, password, axiosRequestConfig).then(noop);

    const register: (
      username: string, email: string, password: string,
    ) => Promise<void> = (
      username, email, password,
    ) => registerAPI(apiAuthPath, username, email, password, axiosRequestConfig).then(noop);

    useEffect(() => {
      // If we don't have a user, we need to obtain it via  the me endpoint
      if (!user) {
        updateUserInfo();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <UserContext.Provider
        value={{
          user,
        }}
      >
        <AuthFunctionContext.Provider
          value={{
            apiUrl,
            csrf,
            axiosRequestConfig,
            loading,
            login,
            loggedIn: !!user,
            logout,
            updateUserInfo,
            justLoggedOut: loggedOut,
            activateEmailAddress,
            validatePassword,
            requestPasswordReset,
            resetPassword,
            register,
          }}
        >
          {children}
        </AuthFunctionContext.Provider>
      </UserContext.Provider>
    );
  };

  const MockUserStore: FC<MockUserStoreProps<U>> = ({
    children, ...testContext
  }) => {
    const { user, ...context } = testContext || { user: null };

    return (
      <UserContext.Provider value={{ user: user || null }}>
        <AuthFunctionContext.Provider
          value={{
            apiUrl: 'https://example.com/api/v1',
            csrf: '1234',
            axiosRequestConfig: {
              headers: {
                common: { 'X-CSRFToken': context?.csrf ?? '1234' },
              },
            },
            loading: false,
            login: dontResolvePromise,
            loggedIn: !!user,
            logout: dontResolvePromise,
            updateUserInfo: dontResolvePromise,
            justLoggedOut: LogoutReason.NONE,
            activateEmailAddress: dontResolvePromise,
            validatePassword: dontResolvePromise,
            requestPasswordReset: dontResolvePromise,
            resetPassword: dontResolvePromise,
            register: dontResolvePromise,
            ...context,
          }}
        >
          {children}
        </AuthFunctionContext.Provider>
      </UserContext.Provider>
    );
  };

  const useUserStore: () => UserStoreValue<U>&AuthFunctionContextValue = () => ({
    ...useContext(UserContext),
    ...useContext(AuthFunctionContext),
  });

  return {
    UserStore, MockUserStore, useUserStore, UserContext,
  };
}
