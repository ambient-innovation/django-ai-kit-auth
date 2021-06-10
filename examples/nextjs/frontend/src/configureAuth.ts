import { configureAuthNext } from 'ai-kit-auth/esm/config/Next';

export const {
  UserStore, useUserStore, AuthPage, PrivateProtection,
} = configureAuthNext({
  api: {
    url: 'http://localhost:8000/api/v1/',
    authPath: 'auth/',
  },
});
