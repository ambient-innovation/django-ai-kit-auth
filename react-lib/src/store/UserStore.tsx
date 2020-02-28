import React, {
  createContext, FC, useState,
} from 'react';
import { AxiosRequestConfig } from 'axios';
import { useCookies } from 'react-cookie';
import { AccessResponse } from '../api/types';
import { loginAPI } from '../api/api';
import { UserStoreValue } from './types';


const jwtCookieName = 'jwtToken';

const authorization: (jwtToken: string) => AxiosRequestConfig = (jwtToken) => ({
  headers: {
    authorization: `bearer ${jwtToken}`,
  },
});

export const UserContext = createContext<UserStoreValue>({
  loading: true,
  login: () => new Promise<AccessResponse>(() => null),
  axiosAuthConfig: {},
});

interface UserStoreProps {
  apiUrl: string;
}

export const UserStore: FC<UserStoreProps> = ({
  children, apiUrl,
}) => {
  const [loginData, setLoginData] = useState<AccessResponse|undefined>(undefined);
  const [cookies, setCookie] = useCookies([jwtCookieName]);

  const login: (userIdentifier: string, password: string) => Promise<AccessResponse> = (
    userIdentifier, password,
  ) => (
    loginAPI(apiUrl, userIdentifier, password).then((data) => {
      setLoginData(data);
      setCookie(jwtCookieName, data.token, { path: '/' });

      return data;
    })
  );

  /* Keep this around for future tickets
  const logout: () => void = () => {
    setLoginData(undefined);
    removeCookies(jwtCookieName, { path: '/' });
  };

  useEffect(() => {
    // If we have a cookie but no loginData, we need to obtain it via  the me endpoint
    // We also need to reload the data, if the jwt token in our cookies does not match
    // the token in the login data.
    if (cookies[jwtCookieName] && (!loginData || cookies[jwtCookieName] !== loginData?.token)) {
      meAPI(authorization(cookies[jwtCookieName])).then((me) => setLoginData(
        { user: me, token: cookies[jwtCookieName] },
      ));
    } else if (loginData && !cookies[jwtCookieName]) {
      setLoginData(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies]);
   */

  return (
    <UserContext.Provider
      value={{
        loading: jwtCookieName in cookies && !loginData,
        login,
        axiosAuthConfig: authorization(
          loginData?.token || cookies[jwtCookieName],
        ),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
