import React, {
  createContext, FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { CssBaseline, Theme, ThemeProvider } from '@material-ui/core';
import { User } from '../api/types';
import {
  activateEmailAddressAPI, loginAPI, logoutAPI, meAPI, registerAPI,
} from '../api/api';
import { AuthFunctionContextValue, LogoutReason, UserStoreValue } from './types';
import { defaultTheme } from '../styles/styles';

const errorPromise = () => new Promise<void>(() => { throw new Error('No User Store provided!'); });

interface UserStoreProps {
  apiUrl: string;
  customTheme?: Theme;
}

const noop: () => void = () => null;

export const AuthFunctionContext = createContext<AuthFunctionContextValue>({
  loading: false,
  apiUrl: '',
  csrf: '',
  login: errorPromise,
  loggedIn: false,
  logout: errorPromise,
  justLoggedOut: LogoutReason.NONE,
  activateEmailAddress: errorPromise,
  register: errorPromise,
});

export function makeGenericUserStore<U extends unknown = User>() {
  const GenericUserContext = createContext<UserStoreValue<U>>({ user: null });

  const GenericUserStore: FC<UserStoreProps> = ({
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
        .then(() => {
          setUser(null);
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
      <GenericUserContext.Provider
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
            register,
          }}
        >
          <CssBaseline />
          <ThemeProvider theme={customTheme || defaultTheme}>
            {children}
          </ThemeProvider>
        </AuthFunctionContext.Provider>
      </GenericUserContext.Provider>
    );
  };

  const useGenericUserStore: () => UserStoreValue<U>&AuthFunctionContextValue = () => ({
    ...useContext(GenericUserContext),
    ...useContext(AuthFunctionContext),
  });

  return {
    UserStore: GenericUserStore,
    useUserStore: useGenericUserStore,
    UserContext: GenericUserContext,
  };
}

export const { UserStore, useUserStore, UserContext } = makeGenericUserStore();
