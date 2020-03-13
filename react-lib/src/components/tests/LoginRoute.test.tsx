import * as React from 'react';
import { FC } from 'react';
import { User } from '../../api/types';
import { LoginRoute } from '../..';
import { renderWithRouterAndUser } from './Util';

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});

test('redirects to main page when logged in', () => {
  const renderObject = renderWithRouterAndUser(
    <LoginRoute />,
    { user: mockUser },
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
    { user: mockUser },
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
