import React, {
  createContext, FC, useContext, useEffect, useMemo, useState,
} from 'react';
import axios, { AxiosError } from 'axios';
import { PasswordValidationInput, User } from '../api/types';
import {
  activateEmailAddressAPI,
  loginAPI,
  logoutAPI,
  meAPI,
  resetPasswordAPI,
  sendPWResetEmail,
  validatePasswordAPI,
  registerAPI,
} from '../api/api';
import { AuthFunctionContextValue, LogoutReason, UserStoreValue } from './types';

export interface UserStoreProps {
  apiUrl: string;
  apiAuthPath: string;
}

const noop: () => void = () => null;

const errorPromise = () => new Promise<void>(() => {
  throw new Error('No User Store provided!');
});

export const AuthFunctionContext = createContext<AuthFunctionContextValue>({
  loading: false,
  apiUrl: '',
  csrf: '',
  axiosRequestConfig: {},
  login: errorPromise,
  loggedIn: false,
  logout: errorPromise,
  justLoggedOut: LogoutReason.NONE,
  activateEmailAddress: errorPromise,
  validatePassword: errorPromise,
  requestPasswordReset: errorPromise,
  resetPassword: errorPromise,
  register: errorPromise,
});

export function makeGenericUserStore<U extends unknown = User>() {
  const UserContext = createContext<UserStoreValue<U>>({ user: null });

  const UserStore: FC<UserStoreProps> = ({
    children, apiUrl, apiAuthPath,
  }) => {
    const [loggedOut, setLoggedOut] = useState<LogoutReason>(LogoutReason.NONE);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<U|null>(null);
    const [csrf, setCsrf] = useState('');

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
    }), [apiUrl, csrf]);

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
        .catch(() => {
          // TODO
        })
        .finally(() => {
          setLoading(false);
        });
    };

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
        meAPI<U>(apiAuthPath, axiosRequestConfig)
          .then((data) => {
            setUser(data.user);
            setCsrf(data.csrf);
          })
          .catch((error: AxiosError) => {
            if (!error.response) {
              throw new Error('Host unreachable');
            }
          })
          .finally(() => setLoading(false));
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

  const useUserStore: () => UserStoreValue<U>&AuthFunctionContextValue = () => ({
    ...useContext(UserContext),
    ...useContext(AuthFunctionContext),
  });

  return { UserStore, useUserStore, UserContext };
}
