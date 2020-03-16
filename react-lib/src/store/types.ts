import { User } from '../api/types';

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
  loading: boolean;
  login: (userIdentifier: string, password: string) => Promise<void>;
  loggedIn: boolean;
  logout: (reason?: LogoutReason) => Promise<void>;
  justLoggedOut: LogoutReason;
  activateEmailAddress: (userIdentifier: string, token: string) => Promise<void>;
}
