import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { User } from '../../../api/types';
import { getFullTestConfig, TestRoutingProps } from '../../../tests/Helper';
import { makeLoginRoute } from '../LoginRoute';
import { makeGenericUserStore, MockUserStoreProps } from '../../..';

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});

const { MockUserStore } = makeGenericUserStore();

const renderComponent = (
  apiFunctions?: MockUserStoreProps,
  routingProps?: TestRoutingProps,
) => {
  const history = createMemoryHistory({ initialEntries: ['/auth/login'] });
  const fullConfig = getFullTestConfig({}, routingProps);
  const LoginRoute = makeLoginRoute(fullConfig);

  return ({
    history,
    fullConfig,
    ...render(
      <MockUserStore {...apiFunctions}>
        <Router history={history}>
          <LoginRoute>
            Login
          </LoginRoute>
        </Router>
      </MockUserStore>,
    ),
  });
};

test('redirects to main page when logged in', () => {
  const renderObject = renderComponent({ user: mockUser });
  expect(renderObject.history.location.pathname)
    .toEqual(renderObject.fullConfig.paths.mainPage);
});

test('redirects to referrer', () => {
  const renderObject = renderComponent(
    { user: mockUser },
    { queryParams: { next: '/fromHere' } },
  );
  expect(renderObject.history.location.pathname).toEqual('/fromHere');
});

test('renders children when not logged in', () => {
  const renderObject = renderComponent();
  expect(renderObject.getByText('Login')).toBeInTheDocument();
});
