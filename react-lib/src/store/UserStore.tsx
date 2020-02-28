import React, {
  createContext, FC, useContext, useEffect, useState,
} from 'react';
import { User } from '../api/types';
import { loginAPI, meAPI } from '../api/api';
import { UserStoreValue } from './types';


const errorExecutor = () => { throw new Error('No User Store provided!'); };

interface UserStoreProps {
  apiUrl: string;
}

export function makeGenericUserStore<U extends unknown = User>() {
  const GenericUserContext = createContext<UserStoreValue<U>>({
    loading: false,
    login: () => new Promise<U>(errorExecutor),
  });

  const GenericUserStore: FC<UserStoreProps> = ({
    children, apiUrl,
  }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<U|undefined>(undefined);

    const login: (userIdentifier: string, password: string) => Promise<U> = (
      userIdentifier, password,
    ) => {
      setLoading(true);

      return loginAPI<U>(apiUrl, userIdentifier, password)
        .then((data) => {
          const loginUser: U = data.user;
          setUser(loginUser);
          setLoading(false);

          return loginUser;
        });
    };

    useEffect(() => {
      // If we don't have a user, we need to obtain it via  the me endpoint
      if (!user) {
        meAPI<U>(apiUrl).then((data) => setUser(data.user));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <GenericUserContext.Provider
        value={{
          user,
          loading,
          login,
        }}
      >
        {children}
      </GenericUserContext.Provider>
    );
  };

  const useGenericUserStore: () => UserStoreValue<U> = () => (
    useContext(GenericUserContext)
  );

  return [GenericUserStore, useGenericUserStore, GenericUserContext];
}

const [UserStore, useUserStore, UserContext] = makeGenericUserStore();
export { UserStore, useUserStore, UserContext };
