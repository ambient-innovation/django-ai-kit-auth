import {
  Configuration as ConfigType, configureAuth, defaultConfig,
} from './Configuration';
import { User } from './api/types';

export const {
  ActivateEmailAddress,
  ActivationCard,
  ActivationView,
  AuthFunctionContext,
  AuthView,
  EmailSentCard,
  EmailSentView,
  ErrorCard,
  ErrorView,
  ForgotPasswordForm,
  ForgotPasswordView,
  makeAuthRoutes,
  LoginForm,
  LoginView,
  LoginRoute,
  ProtectedRoute,
  RegisterForm,
  RegisterView,
  ResetPasswordForm,
  ResetPasswordView,
  UserContext,
  UserStore,
  useUserStore,
} = configureAuth<User>(defaultConfig);

export { configureAuth, defaultConfig, Identifier } from './Configuration';

export { en, de } from './internationalization';

export type Configuration = ConfigType;
