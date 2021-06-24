import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import {
  CsrfResponse, MeResponse, PasswordValidationInput, User,
} from './types';

export const makeUrl = (authPath: string, suffix: string) => {
  const separator = authPath.endsWith('/') ? '' : '/';

  return `${authPath}${separator}${suffix}`;
};

const camelCaseError = <D>(
  apiCall: Promise<AxiosResponse<D>>,
): Promise<AxiosResponse<D>> => apiCall
    .catch((error) => {
      if ('response' in error) {
        const newError = {
          ...error,
          response: {
            ...error.response,
            data: camelcaseKeys(error.response.data),
          },
        };
        throw newError;
      }
      throw error;
    });

export const loginAPI = <U = User>(
  authPath: string, ident: string, password: string, config: AxiosRequestConfig,
) => camelCaseError(axios.post<MeResponse<U>>(
  makeUrl(authPath, 'login/'), { ident, password }, config,
)).then(({ data }) => data);


export const meAPI = <U = User>(authPath: string, config: AxiosRequestConfig) => (
  camelCaseError(axios.get<MeResponse<U>>(makeUrl(authPath, 'me/'), config))
    .then(({ data }) => camelcaseKeys(data)));


export const logoutAPI = (
  authPath: string, config: AxiosRequestConfig,
) => camelCaseError(axios.post<CsrfResponse>(makeUrl(authPath, 'logout/'), {}, config))
  .then(({ data }) => camelcaseKeys(data));


export const activateEmailAddressAPI = (
  authPath: string, ident: string, token: string, config: AxiosRequestConfig,
) => (
  camelCaseError(axios.post(
    makeUrl(authPath, 'activate_email/'), { ident, token }, config,
  ))
);


export const validatePasswordAPI = (
  authPath: string, input: PasswordValidationInput, config: AxiosRequestConfig,
) => camelCaseError(axios.post<{}>(
  makeUrl(authPath, 'validate_password/'), input, config,
));


export const sendPWResetEmail = (
  authPath: string, ident: string, config: AxiosRequestConfig,
) => camelCaseError(axios.post(
  makeUrl(authPath, 'send_pw_reset_email/'), { ident }, config,
));


export const resetPasswordAPI = (
  authPath: string, ident: string, token: string, password: string, config: AxiosRequestConfig,
) => camelCaseError(axios.post(
  makeUrl(authPath, 'reset_password/'), { ident, token, password }, config,
));


export const registerAPI = (
  authPath: string, username: string, email: string, password: string, config: AxiosRequestConfig,
) => camelCaseError(axios.post(
  makeUrl(authPath, 'register/'), { username, email, password }, config,
));
