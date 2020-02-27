import { AxiosRequestConfig } from 'axios';
import { AccessResponse } from '../api/types';

export interface UserStoreValue {
  loading: boolean;
  login: (userIdentifier: string, password: string) => Promise<AccessResponse>;
  axiosAuthConfig: AxiosRequestConfig;
}
