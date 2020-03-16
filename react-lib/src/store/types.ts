import { User } from '../api/types';

export interface UserStoreValue<U = User> {
  user: U|null;
}

export interface AuthFunctionContextValue {
  apiUrl: string;
  csrf: string;
  loading: boolean;
  login: (userIdentifier: string, password: string) => Promise<void>;
  loggedIn: boolean;
  logout: () => Promise<void>;
  justLoggedOut: boolean;
  activateEmailAddress: (userIdentifier: string, token: string) => Promise<void>;
  validatePassword: (ident: string, password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (ident: string, token: string, password: string) => Promise<void>;
}
