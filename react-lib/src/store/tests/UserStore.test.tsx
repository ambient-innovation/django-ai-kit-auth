import * as React from 'react';
import { FC } from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  render, waitForElement, fireEvent, act,
} from '@testing-library/react';

import { User } from '../../api/types';
import { dontResolvePromise, makeGenericUserStore } from '../UserStore';
import { defaultApiConfig } from '../../tests/Helper';

const maxios = new MockAdapter(axios);

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});

beforeEach(() => {
  maxios.reset();
});

const renderStoreValue = () => {
  const { UserStore, useUserStore } = makeGenericUserStore(defaultApiConfig);

  const StoreDisplay: FC = () => {
    const {
      user, csrf, loading, login, logout, updateUserInfo,
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
        <button type="button" onClick={() => updateUserInfo()}>
          Update
        </button>
        <div>{csrf}</div>
        { loading && <div>loading</div> }
      </div>
    );
  };

  return render(
    <UserStore>
      <StoreDisplay />
    </UserStore>,
  );
};

test('UserStore tries to obtain user information', async () => {
  const csrf = 'abcdsdcbasdasd';
  maxios.onGet('/me/').reply(200, { user: mockUser, csrf });
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText(mockUser.username));
  expect(renderObject.getByText(csrf)).toBeInTheDocument();
});

test('UserStore is loading initially', () => {
  maxios.onGet('/me/').reply(dontResolvePromise);
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

test('UserStore sends login', async () => {
  const csrf = 'alsdkbcqlieucblarkb';
  maxios.onGet('/me/').reply(200, { user: null, csrf: '' });
  maxios.onPost('/login/').reply(200, { user: mockUser, csrf });
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Login'));
  fireEvent.click(renderObject.getByText('Login'));
  await waitForElement(() => renderObject.getByText(mockUser.username));
  expect(renderObject.getByText(csrf)).toBeInTheDocument();
});

test('UserStore shows loading while logging in', async () => {
  maxios.onGet('/me/').reply(200, { user: null, csrf: '' });
  maxios.onPost('/login/').reply(dontResolvePromise);
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
  maxios.onPost('/logout/').reply(dontResolvePromise);
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('Logout'));
  fireEvent.click(renderObject.getByText('Logout'));
  expect(renderObject.getByText('loading')).toBeInTheDocument();
});

test('updateUserInfo calls the me api', async () => {
  const csrf = 'jasdkfskjdf';
  maxios.onGet('/me/').replyOnce(200, { user: null, csrf: '' });
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText('no user'));
  await waitForElement(() => renderObject.getByText('Update'));
  maxios.onGet('/me/').replyOnce(200, { user: mockUser, csrf });
  fireEvent.click(renderObject.getByText('Update'));
  await waitForElement(() => renderObject.getByText(mockUser.username));
  expect(renderObject.getByText(csrf)).toBeInTheDocument();
});
