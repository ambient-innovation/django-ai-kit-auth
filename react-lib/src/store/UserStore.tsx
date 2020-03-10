import React, {
  createContext, FC, useContext, useEffect, useState,
} from 'react';
import { AxiosError } from 'axios';
import { CssBaseline, Theme, ThemeProvider } from '@material-ui/core';
import { User } from '../api/types';
import { loginAPI, logoutAPI, meAPI } from '../api/api';
import { UserStoreValue } from './types';
import { defaultTheme } from '../styles/styles';

const errorExecutor = () => { throw new Error('No User Store provided!'); };

interface UserStoreProps {
  apiUrl: string;
  customTheme?: Theme;
}

export function makeGenericUserStore<U extends unknown = User>() {
  const GenericUserContext = createContext<UserStoreValue<U>>({
    loading: false,
    apiUrl: '',
    login: () => new Promise<U>(errorExecutor),
    logout: () => new Promise<unknown>(errorExecutor),
    loggedOut: false,
  });

  const GenericUserStore: FC<UserStoreProps> = ({
    children, apiUrl, customTheme,
  }) => {
    const [loggedOut, setLoggedOut] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<U|undefined>(undefined);

    const login: (userIdentifier: string, password: string) => Promise<U> = (
      userIdentifier, password,
    ) => {
      setLoading(true);

      return loginAPI<U>(apiUrl, userIdentifier, password)
        .then((loginUser) => {
          setUser(loginUser);
          setLoading(false);

          return loginUser;
        })
        .finally(() => setLoading(false));
    };

    const logout: () => Promise<unknown> = () => {
      setLoading(true);

      return logoutAPI(apiUrl)
        .then((response) => {
          setUser(undefined);
          setLoggedOut(true);

          return response;
        })
        .catch(() => {
          // TODO
        })
        .finally(() => {
          setLoading(false);
        });
    };

    useEffect(() => {
      // If we don't have a user, we need to obtain it via  the me endpoint
      if (!user) {
        meAPI<U>(apiUrl)
          .then((loggedInUser) => {
            setUser(loggedInUser);
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
          apiUrl,
          loading,
          login,
          logout,
          loggedOut,
        }}
      >
        <CssBaseline />
        <ThemeProvider theme={customTheme || defaultTheme}>
          {children}
        </ThemeProvider>
      </GenericUserContext.Provider>
    );
  };

  const useGenericUserStore: () => UserStoreValue<U> = () => (
    useContext(GenericUserContext)
  );

  return {
    UserStore: GenericUserStore,
    useUserStore: useGenericUserStore,
    UserContext: GenericUserContext,
  };
}

export const { UserStore, useUserStore, UserContext } = makeGenericUserStore();
