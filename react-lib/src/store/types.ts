import { AxiosRequestConfig } from 'axios';
import { PasswordValidationInput, User } from '../api/types';

export interface UserStoreValue<U = User> {
  user: U|null;
}

export enum LogoutReason {
  NONE,
  USER,
  AUTH,
}

export interface AuthFunctionContextValue {
  apiUrl: string;
  csrf: string;
  axiosRequestConfig: AxiosRequestConfig;
  loading: boolean;
  login: (userIdentifier: string, password: string) => Promise<void>;
  loggedIn: boolean;
  logout: (reason?: LogoutReason) => Promise<void>;
  justLoggedOut: LogoutReason;
  activateEmailAddress: (userIdentifier: string, token: string) => Promise<void>;
  validatePassword: (input: PasswordValidationInput) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (ident: string, token: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
}
