import { configureAuthReactRouter } from '../ReactRouter';
import { defaultApiConfig } from '../../tests/Helper';

test('makeAuthRoutes renders all 6 routes by default', () => {
  const { makeAuthRoutes } = configureAuthReactRouter({ api: defaultApiConfig });
  expect(makeAuthRoutes()).toHaveLength(6);
});

test('makeAuthRoutes renders only 5 routes when user registration is disabled', () => {
  const { makeAuthRoutes } = configureAuthReactRouter({
    disableUserRegistration: true, api: defaultApiConfig,
  });
  expect(makeAuthRoutes()).toHaveLength(5);
});
