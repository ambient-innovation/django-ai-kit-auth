import axios from 'axios';
import { MeResponse, User } from './types';

const loginSuffix = 'login/';
const meSuffix = 'me/';

const makeUrl = (apiUrl: string, suffix: string) => {
  const separator = apiUrl.endsWith('/') ? '' : '/';

  return `${apiUrl}${separator}${suffix}`;
};

/**
 * @description Send a login request to the backend .
 * @param apiUrl - URL to the backend api -- including `/api/v?/`.
 * @param emailOrUsername - Email of the user.
 * @param password - Password of the user.
 */
export const loginAPI = <U = User>(
  apiUrl: string, emailOrUsername: string, password: string,
) => axios.post<MeResponse<U>>(makeUrl(apiUrl, loginSuffix), {
  emailOrUsername, password,
}).then((response) => response.data);


export const meAPI = <U = User>(apiUrl: string) => (
  axios.get<MeResponse<U>>(makeUrl(apiUrl, meSuffix))
    .then(({ data }) => data)
);
