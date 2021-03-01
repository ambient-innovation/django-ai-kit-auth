import { configureAuthNext } from "ai-kit-auth";

export const {
  UserStore, useUserStore, AuthPage,
} = configureAuthNext({
  api: {
    url: 'http://localhost:8000/api/v1/',
    authPath: 'auth/',
  },
});
