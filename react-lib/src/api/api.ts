import axios from 'axios';
import {
  CsrfResponse, MeResponse, User,
} from './types';

axios.defaults.withCredentials = true;

export const makeUrl = (apiUrl: string, suffix: string) => {
  const separator = apiUrl.endsWith('/') ? '' : '/';

  return `${apiUrl}${separator}${suffix}`;
};

function setCsrfHeader<T extends CsrfResponse>(data: T) {
  axios.defaults.headers.common['X-CSRFToken'] = data.csrf;

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
) => axios.post<CsrfResponse>(makeUrl(apiUrl, 'logout/'))
  .then(({ data }) => setCsrfHeader(data));

export const activateEmailAddressAPI = (apiUrl: string, ident: string, token: string) => (
  axios.post(makeUrl(apiUrl, 'activate_email/'), { ident, token })
);

export const validatePasswordAPI = (
  apiUrl: string, ident: string, password: string,
) => axios.post<{}>(
  makeUrl(apiUrl, 'validate_password/'), { ident, password },
);

export const sendPWResetEmail = (
  apiUrl: string, email: string,
) => axios.post(
  makeUrl(apiUrl, 'send_pw_reset_email/'), { email },
);

export const resetPasswordAPI = (
  apiUrl: string, ident: string, token: string, password: string,
) => axios.post(
  makeUrl(apiUrl, 'reset_password/'), { ident, token, password },
);

export const registerAPI = (
  apiUrl: string, username: string, email: string, password: string,
) => axios.post(makeUrl(apiUrl, 'register/'), { username, email, password });
