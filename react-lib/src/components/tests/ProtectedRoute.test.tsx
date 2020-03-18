import * as React from 'react';
import { FC } from 'react';
import { User } from '../../api/types';
import { defaultConfig, ProtectedRoute } from '../..';
import { makeProtectedRoute } from '../ProtectedRoute';
import { renderWithRouterAndUser } from './Util';
import { mergeConfig } from '../../Configuration';

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});

test('redirects to login without user', () => {
  const renderObject = renderWithRouterAndUser(
    <ProtectedRoute />,
  );
  expect(renderObject.history.location.pathname).toEqual('/auth/login');
});

test('redirect passes referral location', () => {
  const currentLocation = '/here';
  const renderObject = renderWithRouterAndUser(
    <ProtectedRoute location={{
      pathname: currentLocation,
      search: '',
      state: null,
      hash: '',
    }}
    />,
  );
  expect((renderObject.history.location.state as {from: string})
    .from).toEqual(currentLocation);
});

test('shows loading indicator when loading', () => {
  const SimpleProtected = makeProtectedRoute(mergeConfig(defaultConfig, {
    components: { loadingIndicator: () => <div>loading</div> },
  }));
  const renderObject = renderWithRouterAndUser(
    <SimpleProtected />,
    { loading: true },
  );
  expect(renderObject.getByText('loading')).toBeInTheDocument();
});

test('renders children when logged in', () => {
  const renderObject = renderWithRouterAndUser(
    <ProtectedRoute>
      content
    </ProtectedRoute>,
    { user: mockUser },
  );
  expect(renderObject.getByText('content')).toBeInTheDocument();
});

test('renders component when logged in', () => {
  const Content: FC = () => <div>content</div>;
  const renderObject = renderWithRouterAndUser(
    <ProtectedRoute component={Content} />,
    { user: mockUser },
  );
  expect(renderObject.getByText('content')).toBeInTheDocument();
});
