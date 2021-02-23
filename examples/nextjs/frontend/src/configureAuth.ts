import { configureAuth } from 'ai-kit-auth/dist/config/Next';

export const {
  UserStore, useUserStore, AuthPage, getStaticAuthPaths, getStaticAuthProps,
} = configureAuth();
