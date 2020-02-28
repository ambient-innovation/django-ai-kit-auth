import React, {
  createContext, FC, useContext, useState,
} from 'react';
import { User } from '../api/types';
import { loginAPI } from '../api/api';
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
    const [loading, setLoading] = useState(true);
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

    /* Keep this around for future tickets
    const logout: () => void = () => {
      setUser(undefined);
      removeCookies(jwtCookieName, { path: '/' });
    };

    useEffect(() => {
      // If we have a cookie but no user, we need to obtain it via  the me endpoint
      // We also need to reload the data, if the jwt token in our cookies does not match
      // the token in the login data.
      if (cookies[jwtCookieName] && (!user || cookies[jwtCookieName] !== user?.token)) {
        meAPI(authorization(cookies[jwtCookieName])).then((me) => setUser(
          { user: me, token: cookies[jwtCookieName] },
        ));
      } else if (user && !cookies[jwtCookieName]) {
        setUser(undefined);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookies]);
     */

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
