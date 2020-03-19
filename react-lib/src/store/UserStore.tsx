import React, {
  createContext, FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { CssBaseline, Theme, ThemeProvider } from '@material-ui/core';
import { User } from '../api/types';
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
import { defaultTheme } from '../styles/styles';

export interface UserStoreProps {
  apiUrl: string;
  customTheme?: Theme;
}

const noop: () => void = () => null;

const errorPromise = () => new Promise<void>(() => {
  throw new Error('No User Store provided!');
});

export const AuthFunctionContext = createContext<AuthFunctionContextValue>({
  loading: false,
  apiUrl: '',
  csrf: '',
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
    children, apiUrl, customTheme,
  }) => {
    const [loggedOut, setLoggedOut] = useState<LogoutReason>(LogoutReason.NONE);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<U|null>(null);
    const [csrf, setCsrf] = useState('');

    const login: (userIdentifier: string, password: string) => Promise<void> = (
      userIdentifier, password,
    ) => {
      setLoading(true);

      return loginAPI<U>(apiUrl, userIdentifier, password)
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

      return logoutAPI(apiUrl)
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
    ) => activateEmailAddressAPI(apiUrl, userIdentifier, token)
      .then(noop);

    const validatePassword: (
      ident: string, password: string,
    ) => Promise<void> = (
      ident, password,
    ) => validatePasswordAPI(apiUrl, ident, password).then(noop);

    const requestPasswordReset: (email: string) => Promise<void> = (
      email: string,
    ) => sendPWResetEmail(apiUrl, email).then(noop);

    const resetPassword: (
      ident: string, token: string, password: string,
    ) => Promise<void> = (
      ident, token, password,
    ) => resetPasswordAPI(apiUrl, ident, token, password).then(noop);

    const register: (
      username: string, email: string, password: string,
    ) => Promise<void> = (
      username, email, password,
    ) => registerAPI(apiUrl, username, email, password).then(noop);

    useEffect(() => {
      // If we don't have a user, we need to obtain it via  the me endpoint
      if (!user) {
        meAPI<U>(apiUrl)
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
          <CssBaseline />
          <ThemeProvider theme={customTheme || defaultTheme}>
            {children}
          </ThemeProvider>
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
