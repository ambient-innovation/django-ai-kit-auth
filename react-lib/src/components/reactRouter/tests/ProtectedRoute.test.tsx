import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { FC } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { User } from '../../../api/types';
import { makeProtectedRoute } from '../ProtectedRoute';
import { makeGenericUserStore, MockUserStoreProps } from '../../..';
import { getFullTestConfig } from '../../../tests/Helper';
import { DeepPartial } from '../../../util';
import { FullConfig } from '../../../config/components';

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});

const { MockUserStore } = makeGenericUserStore();

const renderComponent = (
  apiFunctions?: MockUserStoreProps,
  config?: DeepPartial<FullConfig>,
  initialEntries: string[] = ['/'],
) => {
  const history = createMemoryHistory({ initialEntries });
  const fullConfig = getFullTestConfig(config);
  const ProtectedRoute = makeProtectedRoute(fullConfig);

  return ({
    history,
    fullConfig,
    ...render(
      <MockUserStore {...apiFunctions}>
        <Router history={history}>
          <ProtectedRoute exact path={initialEntries[0]}>
            Main
          </ProtectedRoute>
        </Router>
      </MockUserStore>,
    ),
  });
};

test('redirects to login without user', () => {
  const renderObject = renderComponent();
  expect(renderObject.history.location.pathname)
    .toEqual(renderObject.fullConfig.paths.login);
});

test('redirect passes referral location', () => {
  const currentLocation = '/here';
  const renderObject = renderComponent(
    {}, {}, [currentLocation],
  );
  expect(renderObject.history.location.search)
    .toEqual(`?next=${currentLocation}`);
});

test('shows loading indicator when loading', () => {
  const renderObject = renderComponent(
    { loading: true },
    { components: { loadingIndicator: (() => <div>loading</div>) as FC } },
  );
  expect(renderObject.getByText('loading')).toBeInTheDocument();
});

test('renders children when logged in', () => {
  const renderObject = renderComponent({ user: mockUser });
  expect(renderObject.getByText('Main')).toBeInTheDocument();
});
