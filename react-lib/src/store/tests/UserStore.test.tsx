import * as React from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, waitForElement, act } from '@testing-library/react';

import { UserStore, UserContext } from '../UserStore';

const maxios = new MockAdapter(axios);

const mockUser = ({
  id: 42, username: 'Donald', email: 'donald@duck.ent',
});

beforeEach(() => {
  maxios.reset();
});

const renderStoreValue = () => render(
  <UserStore apiUrl="">
    <UserContext.Consumer>
      { ({ user, loading, login }) => {
        if (loading) return <div>is loading</div>;
        if (!user) return (
          <div>
            no user
            <button
              type="button"
              onClick={() => login(mockUser.username, 'pass')}
            >
              Login
            </button>
          </div>
        );

        return (
          <div>
            <div>{user.username}</div>
            <div>{user.email}</div>
            <div>{user.id}</div>
          </div>
        );
      }}
    </UserContext.Consumer>
  </UserStore>,
);

test('UserStore tries to obtain user information', async () => {
  maxios.onGet('/me/').reply(200, mockUser);
  const renderObject = renderStoreValue();
  await waitForElement(() => renderObject.getByText(mockUser.username));
});

test('UserStore is loading initially', () => {
  maxios.onGet('/me/').reply(async () => {
    // wait for some time, so that the loading can actually be shown
    await new Promise((r) => setTimeout(r, 200));

    return [200, mockUser];
  });
  const renderObject = renderStoreValue();
  expect(renderObject.getByText('is loading')).toBeInTheDocument();
});

test('UserStore behaviour if me-call fails', async () => {
  maxios.onGet('/me/').reply(400, {});
  await act(async () => {
    const renderObject = renderStoreValue();
    expect(renderObject.getByText('no user')).toBeInTheDocument();
  });
});
