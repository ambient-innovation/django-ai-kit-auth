import { configureAuth } from '../ReactRouter';
import { defaultApiConfig } from '../../tests/Helper';

test('makeAuthRoutes renders all 6 routes by default', () => {
  const { makeAuthRoutes } = configureAuth({ api: defaultApiConfig });
  expect(makeAuthRoutes()).toHaveLength(6);
});

test('makeAuthRoutes renders only 5 routes when user registration is disabled', () => {
  const { makeAuthRoutes } = configureAuth({
    disableUserRegistration: true, api: defaultApiConfig,
  });
  expect(makeAuthRoutes()).toHaveLength(5);
});
