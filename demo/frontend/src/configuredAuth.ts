import { configureAuth } from 'ai-kit-auth';

export const {
  UserStore,
  ProtectedRoute,
  makeAuthRoutes,
} = configureAuth({
  backgroundImage: 'url(https://www.placecage.com/800/1450)',
});
