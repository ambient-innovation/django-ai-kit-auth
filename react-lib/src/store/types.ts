import { Context } from 'react';
import { User } from '../api/types';

export interface UserStoreValue<U = User> {
  user?: U;
  loading: boolean;
  login: (userIdentifier: string, password: string) => Promise<U>;
}

export type UserContext<User> = Context<UserStoreValue<User>>;
