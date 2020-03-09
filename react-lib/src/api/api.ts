import axios from 'axios';
import { User } from './types';

axios.defaults.withCredentials = true;

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
) => axios.post<U>(makeUrl(apiUrl, '/login'), {
  ident, password,
}).then((response) => response.data);


export const meAPI = <U = User>(apiUrl: string) => (
  axios.get<U>(makeUrl(apiUrl, '/me'))
    .then(({ data }) => data)
);

export const activateEmailAddressAPI = (apiUrl: string, ident: string, token: string) => (
  axios.post(makeUrl(apiUrl, `/activate_email/${ident}/${token}`))
);
