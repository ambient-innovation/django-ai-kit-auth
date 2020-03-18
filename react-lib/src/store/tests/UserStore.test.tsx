import * as React from 'react';
import { FC } from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  render, waitForElement, fireEvent, act,
} from '@testing-library/react';

import { UserStore, useUserStore } from '../..';
import { User } from '../../api/types';

const maxios = new MockAdapter(axios);

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});

beforeEach(() => {
  maxios.reset();
});

const StoreDisplay: FC = () => {
  const {
    user, csrf, loading, login, logout,
  } = useUserStore();

  if (loading) return <div>loading</div>;

  return (
    <div>
      {user ? (
        <div>
          <div>{user.username}</div>
          <div>{user.email}</div>
          <div>{user.id}</div>
          <button
            type="button"
            onClick={() => logout()
              .catch(() => null)}
          >
            Logout
          </button>
        </div>
      ) : (
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
      )}
      <div>{csrf}</div>
      { loading && <div>loading</div> }
    </div>
  );
};

const renderStoreValue = () => render(
  <UserStore apiUrl="">
    <StoreDisplay />
  </UserStore>,
);

const sleep = async () => new Promise((r) => setTimeout(r, 200));

// eslint-disable-next-line jest/expect-expect
test('UserStore tries to obtain user information', async () => {
  const csrf = 'abcdsdcbasdasd';
  maxios.onGet('/me/').reply(200, { user: mockUser, csrf });
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText(mockUser.username));
  await waitForElement(() => renderObject.getByText(csrf));
});

test('UserStore is loading initially', () => {
  maxios.onGet('/me/').reply(async () => {
    // wait for some time, so that the loading can actually be shown
    await sleep();

    return [400];
  });
  const renderObject = renderStoreValue();
  expect(renderObject.getByText('loading')).toBeInTheDocument();
});

// eslint-disable-next-line jest/expect-expect
test('UserStore behaviour if me-call fails', async () => {
  maxios.onGet('/me/').reply(200, { user: null, csrf: '' });
  await act(async () => {
    const renderObject = renderStoreValue();
    await waitForElement(() => renderObject.getByText('no user'));
  });
});

// eslint-disable-next-line jest/expect-expect
test('UserStore sends login', async () => {
  const csrf = 'alsdkbcqlieucblarkb';
  maxios.onGet('/me/').reply(200, { user: null, csrf: '' });
  maxios.onPost('/login/').reply(200, { user: mockUser, csrf });
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Login'));
  fireEvent.click(renderObject.getByText('Login'));
  await waitForElement(() => renderObject.getByText(mockUser.username));
  await waitForElement(() => renderObject.getByText(csrf));
});

test('UserStore shows loading while logging in', async () => {
  maxios.onGet('/me/').reply(200, { user: null, csrf: '' });
  maxios.onPost('/login/').reply(async () => {
    await sleep();

    return [400];
  });
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Login'));
  fireEvent.click(renderObject.getByText('Login'));
  expect(renderObject.getByText('loading')).toBeInTheDocument();
});

// eslint-disable-next-line jest/expect-expect
test('UserStore behaviour when login fails', async () => {
  maxios.onGet('/me/').reply(200, { user: null, csrf: '' });
  maxios.onPost('/login/').reply(400, {});
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Login'));
  fireEvent.click(renderObject.getByText('Login'));
  await waitForElement(() => renderObject.getByText('no user'));
});

// eslint-disable-next-line jest/expect-expect
test('UserStore sends logout', async () => {
  const csrf = 'aslakjshsdf';
  maxios.onGet('/me/').reply(200, { user: mockUser, csrf: '' });
  maxios.onPost('/logout/').reply(200, { csrf });
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Logout'));
  fireEvent.click(renderObject.getByText('Logout'));
  await waitForElement(() => renderObject.getByText('no user'));
  expect(renderObject.getByText(csrf)).toBeInTheDocument();
});

test('UserStore shows loading while logging out', async () => {
  maxios.onGet('/me/').reply(200, { user: mockUser, csrf: '' });
  maxios.onPost('/logout/').reply(async () => {
    await sleep();

    return [400];
  });
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Logout'));
  fireEvent.click(renderObject.getByText('Logout'));
  expect(renderObject.getByText('loading')).toBeInTheDocument();
});
