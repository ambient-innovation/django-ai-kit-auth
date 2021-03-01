export {
  Identifier,
  DefaultConfig,
  defaultComponentConfig,
  LinkProps,
  UrlDescriptor,
  RouteHandler,
  MandatoryConfig,
  InputConfig,
  FullConfig,
  makeComponents,
} from './config/components';

export {
  makeGenericUserStore, AuthFunctionContext, MockUserStoreProps, UserStoreProps,
} from './store/UserStore';

export {
  Translator, TranslatorProps, en, de,
} from './internationalization';

export {
  ReactRouterConfig, configureAuth as configureAuthReactRouter,
} from './config/ReactRouter';

export {
  NextConfig, AuthPageProps, configureAuth as configureAuthNext,
} from './config/Next';
