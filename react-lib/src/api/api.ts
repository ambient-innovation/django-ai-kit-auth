import axios from 'axios';
import { MeResponse, User } from './types';

axios.defaults.withCredentials = true;

export const makeUrl = (apiUrl: string, suffix: string) => {
  const separator = apiUrl.endsWith('/') ? '' : '/';

  return `${apiUrl}${separator}${suffix}`;
};

function setCsrfHeader<U>(data: MeResponse<U>) {
  axios.defaults.headers = {
    'X-CSRFToken': data.csrf,
  };

  return data;
}

/**
 * @description Send a login request to the backend .
 * @param apiUrl - URL to the backend api -- including `/api/v?/`.
 * @param ident - Email or Username of the user.
 * @param password - Password of the user.
 */
export const loginAPI = <U = User>(
  apiUrl: string, ident: string, password: string,
) => axios.post<MeResponse<U>>(
  makeUrl(apiUrl, 'login/'), { ident, password },
).then(({ data }) => setCsrfHeader(data));

export const meAPI = <U = User>(apiUrl: string) => (
  axios.get<MeResponse<U>>(makeUrl(apiUrl, 'me/'))
    .then(({ data }) => setCsrfHeader(data))
);


/**
 * @description Send a logout request to the backend.
 * @param apiUrl - URL to the backend api -- including `/api/v?/`.
 */
export const logoutAPI = (
  apiUrl: string,
) => axios.post(makeUrl(apiUrl, 'logout/')).then(({ data }) => data);

export const activateEmailAddressAPI = (apiUrl: string, ident: string, token: string) => (
  axios.post(makeUrl(apiUrl, `activate_email/${ident}/${token}/`))
);
