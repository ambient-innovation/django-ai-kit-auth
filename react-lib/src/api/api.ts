import axios, { AxiosRequestConfig } from 'axios';
import {
  CsrfResponse, MeResponse, PasswordValidationInput, User,
} from './types';

export const makeUrl = (authPath: string, suffix: string) => {
  const separator = authPath.endsWith('/') ? '' : '/';

  return `${authPath}${separator}${suffix}`;
};

export const loginAPI = <U = User>(
  authPath: string, ident: string, password: string, config: AxiosRequestConfig,
) => axios.post<MeResponse<U>>(
  makeUrl(authPath, 'login/'), { ident, password }, config,
).then(({ data }) => data);


export const meAPI = <U = User>(authPath: string, config: AxiosRequestConfig) => (
  axios.get<MeResponse<U>>(makeUrl(authPath, 'me/'), config)
    .then(({ data }) => data)
);


export const logoutAPI = (
  authPath: string, config: AxiosRequestConfig,
) => axios.post<CsrfResponse>(makeUrl(authPath, 'logout/'), {}, config)
  .then(({ data }) => data);


export const activateEmailAddressAPI = (
  authPath: string, ident: string, token: string, config: AxiosRequestConfig,
) => (
  axios.post(
    makeUrl(authPath, 'activate_email/'), { ident, token }, config,
  )
);


export const validatePasswordAPI = (
  authPath: string, input: PasswordValidationInput, config: AxiosRequestConfig,
) => axios.post<{}>(
  makeUrl(authPath, 'validate_password/'), input, config,
);


export const sendPWResetEmail = (
  authPath: string, email: string, config: AxiosRequestConfig,
) => axios.post(
  makeUrl(authPath, 'send_pw_reset_email/'), { email }, config,
);


export const resetPasswordAPI = (
  authPath: string, ident: string, token: string, password: string, config: AxiosRequestConfig,
) => axios.post(
  makeUrl(authPath, 'reset_password/'), { ident, token, password }, config,
);


export const registerAPI = (
  authPath: string, username: string, email: string, password: string, config: AxiosRequestConfig,
) => axios.post(
  makeUrl(authPath, 'register/'), { username, email, password }, config,
);
