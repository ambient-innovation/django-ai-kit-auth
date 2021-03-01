import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { User } from '../../../api/types';
import { defaultApiConfig, getFullTestConfig, TestRoutingProps } from '../../../tests/Helper';
import { makeLoginRoute } from '../LoginRoute';
import { makeGenericUserStore, MockUserStoreProps } from '../../..';
import { noop } from '../../../store/UserStore';

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});

const { MockUserStore } = makeGenericUserStore(defaultApiConfig);

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
  const replace = jest.fn();

  const { fullConfig } = renderComponent(
    { user: mockUser },
    { routeHandler: { replace, push: noop } },
  );
  expect(replace).toHaveBeenCalledWith(fullConfig.paths.mainPage);
});

test('redirects to referrer', () => {
  const replace = jest.fn();
  renderComponent(
    { user: mockUser },
    {
      queryParams: { next: '/fromHere' },
      routeHandler: { replace, push: noop },
    },
  );
  expect(replace).toHaveBeenCalledWith('/fromHere');
});

test('renders children when not logged in', () => {
  const renderObject = renderComponent();
  expect(renderObject.getByText('Login')).toBeInTheDocument();
});
