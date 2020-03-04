import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { FC } from 'react';
import { UserContext } from '../..';
import { User } from '../../api/types';
import { LoginRoute } from '../LoginRoute';

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});

const renderWithRouterAndUser = (
  element: JSX.Element, user?: User,
) => {
  const history = createMemoryHistory({ initialEntries: ['/auth/login'] });

  return ({
    history,
    ...render(
      <UserContext.Provider value={{
        user,
        loading: false,
        login: jest.fn(),
      }}
      >
        <Router history={history}>
          {element}
        </Router>
      </UserContext.Provider>,
    ),
  });
};

test('redirects to main page when logged in', () => {
  const renderObject = renderWithRouterAndUser(
    <LoginRoute />,
    mockUser,
  );
  expect(renderObject.history.location.pathname).toEqual('/');
});

test('redirects to referrer', () => {
  const renderObject = renderWithRouterAndUser(
    <LoginRoute location={{
      pathname: '/auth/login',
      search: '',
      hash: '',
      state: { from: { pathname: '/fromHere' } },
    }}
    />,
    mockUser,
  );
  expect(renderObject.history.location.pathname).toEqual('/fromHere');
});

test('renders children when not logged in', () => {
  const renderObject = renderWithRouterAndUser(
    <LoginRoute>
      Login
    </LoginRoute>,
  );
  expect(renderObject.getByText('Login')).toBeInTheDocument();
});

test('renders component when not logged in', () => {
  const MockView: FC = () => <div>Login</div>;
  const renderObject = renderWithRouterAndUser(
    <LoginRoute component={MockView} />,
  );
  expect(renderObject.getByText('Login')).toBeInTheDocument();
});
