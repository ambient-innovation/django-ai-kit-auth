import * as React from 'react';
import { FC } from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  render, waitForElement, fireEvent, act,
} from '@testing-library/react';

import { UserStore, UserContext } from '../UserStore';
import { User } from '../../api/types';

const maxios = new MockAdapter(axios);

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});

beforeEach(() => {
  maxios.reset();
});

const StoreDisplay: FC = () => (
  <UserContext.Consumer>
    { ({ user, loading, login }) => {
      if (loading) return <div>loading</div>;
      if (!user) {
        return (
          <div>
            no user
            <button
              type="button"
              onClick={() => login(mockUser.username, 'pass')
                .catch(() => null)}
            >
              Login
            </button>
          </div>
        );
      }

      return (
        <div>
          <div>{user.username}</div>
          <div>{user.email}</div>
          <div>{user.id}</div>
        </div>
      );
    }}
  </UserContext.Consumer>
);

const renderStoreValue = () => render(
  <UserStore apiUrl="">
    <StoreDisplay />
  </UserStore>,
);

const sleep = async () => new Promise((r) => setTimeout(r, 200));

// eslint-disable-next-line jest/expect-expect
test('UserStore tries to obtain user information', async () => {
  maxios.onGet('/me/').reply(200, mockUser);
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText(mockUser.username));
});

test('UserStore is loading initially', () => {
  maxios.onGet('/me/').reply(async () => {
    // wait for some time, so that the loading can actually be shown
    await sleep();

    return [200, mockUser];
  });
  const renderObject = renderStoreValue();
  expect(renderObject.getByText('loading')).toBeInTheDocument();
});

// eslint-disable-next-line jest/expect-expect
test('UserStore behaviour if me-call fails', async () => {
  maxios.onGet('/me/').reply(403, {});
  await act(async () => {
    const renderObject = renderStoreValue();
    await waitForElement(() => renderObject.getByText('no user'));
  });
});

// eslint-disable-next-line jest/expect-expect
test('UserStore sends login', async () => {
  maxios.onGet('/me/').reply(403, {});
  maxios.onPost('/login/').reply(200, mockUser);
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Login'));
  fireEvent.click(renderObject.getByText('Login'));
  await waitForElement(() => renderObject.getByText(mockUser.username));
});

test('UserStore shows loading while logging in', async () => {
  maxios.onGet('/me/').reply(403, {});
  maxios.onPost('/login/').reply(async () => {
    await sleep();

    return [200, mockUser];
  });
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Login'));
  fireEvent.click(renderObject.getByText('Login'));
  expect(renderObject.getByText('loading')).toBeInTheDocument();
});

// eslint-disable-next-line jest/expect-expect
test('UserStore behaviour when login fails', async () => {
  maxios.onGet('/me/').reply(403, {});
  maxios.onPost('/login/').reply(400, mockUser);
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Login'));
  fireEvent.click(renderObject.getByText('Login'));
  await waitForElement(() => renderObject.getByText('no user'));
});