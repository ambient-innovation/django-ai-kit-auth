import React, {
  createContext, FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { CssBaseline, Theme, ThemeProvider } from '@material-ui/core';
import { User } from '../api/types';
import {
  activateEmailAddressAPI, loginAPI, logoutAPI, meAPI,
} from '../api/api';
import { AuthFunctionContextValue, UserStoreValue } from './types';
import { defaultTheme } from '../styles/styles';

const errorPromise = () => new Promise<void>(() => { throw new Error('No User Store provided!'); });

export interface UserStoreProps {
  apiUrl: string;
  customTheme?: Theme;
}

export const AuthFunctionContext = createContext<AuthFunctionContextValue>({
  loading: false,
  apiUrl: '',
  csrf: '',
  login: errorPromise,
  loggedIn: false,
  logout: errorPromise,
  justLoggedOut: false,
  activateEmailAddress: errorPromise,
  requestPasswordReset: errorPromise,
});

export function makeGenericUserStore<U extends unknown = User>() {
  const GenericUserContext = createContext<UserStoreValue<U>>({ user: null });

  const GenericUserStore: FC<UserStoreProps> = ({
    children, apiUrl, customTheme,
  }) => {
    const [loggedOut, setLoggedOut] = useState(false);
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

    const logout: () => Promise<void> = () => {
      setLoading(true);

      return logoutAPI(apiUrl)
        .then(() => {
          setUser(null);
          setLoggedOut(true);
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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then(() => {});

    // TODO: replace this with an actual API call
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const requestPasswordReset = (email: string) => new Promise<void>(
      (resolve) => {
        console.log('requestPasswordReset for', email);
        resolve();
      },
    );

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
            requestPasswordReset,
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
