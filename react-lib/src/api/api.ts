import axios from 'axios';
import { AccessResponse } from './types';

const loginUrl = (apiUrl: string) => {
  const suffix = 'login/';
  const separator = apiUrl.endsWith('/') ? '' : '/';

  return `${apiUrl}${separator}${suffix}`;
};

/**
 * @description Send a login request to the backend .
 * @param apiUrl - URL to the backend api -- including `/api/v?/`.
 * @param emailOrUsername - Email of the user.
 * @param password - Password of the user.
 */
export const loginAPI: (
  apiUrl: string, emailOrUsername: string, password: string,
) => Promise<AccessResponse> = (
  apiUrl, emailOrUsername, password,
) => (
  axios.post<AccessResponse>(loginUrl(apiUrl), {
    emailOrUsername, password,
  })
    .then((response) => response.data)
);
