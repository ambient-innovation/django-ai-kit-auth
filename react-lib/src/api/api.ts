import axios from 'axios';
import { User } from './types';

axios.defaults.withCredentials = true;

const loginSuffix = 'login/';
const logoutSuffix = 'logout/';
const meSuffix = 'me/';

export const makeUrl = (apiUrl: string, suffix: string) => {
  const separator = apiUrl.endsWith('/') ? '' : '/';

  return `${apiUrl}${separator}${suffix}`;
};

/**
 * @description Send a login request to the backend .
 * @param apiUrl - URL to the backend api -- including `/api/v?/`.
 * @param ident - Email or Username of the user.
 * @param password - Password of the user.
 */
export const loginAPI = <U = User>(
  apiUrl: string, ident: string, password: string,
) => axios.post<U>(makeUrl(apiUrl, loginSuffix), {
  ident, password,
}).then((response) => response.data);


/**
 * @description Send a login request to the backend .
 * @param apiUrl - URL to the backend api -- including `/api/v?/`.
 */
export const logoutAPI = (
  apiUrl: string,
) => axios.post(makeUrl(apiUrl, logoutSuffix)).then((response) => response.data);

export const meAPI = <U = User>(apiUrl: string) => (
  axios.get<U>(makeUrl(apiUrl, meSuffix))
    .then(({ data }) => data)
);
