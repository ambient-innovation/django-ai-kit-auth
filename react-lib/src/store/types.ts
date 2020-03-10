import { Context } from 'react';
import { User } from '../api/types';

export interface UserStoreValue<U = User> {
  user?: U;
  apiUrl: string;
  loading: boolean;
  login: (userIdentifier: string, password: string) => Promise<U>;
  logout: () => Promise<unknown>;
  loggedOut: boolean;
}

export type UserContext<User> = Context<UserStoreValue<User>>;
