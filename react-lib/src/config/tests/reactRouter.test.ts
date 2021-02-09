import { configureAuth } from '../ReactRouter';

test('makeAuthRoutes renders all 6 routes by default', () => {
  const { makeAuthRoutes } = configureAuth();
  expect(makeAuthRoutes()).toHaveLength(6);
});

test('makeAuthRoutes renders only 5 routes when user registration is disabled', () => {
  const { makeAuthRoutes } = configureAuth({ disableUserRegistration: true });
  expect(makeAuthRoutes()).toHaveLength(5);
});
