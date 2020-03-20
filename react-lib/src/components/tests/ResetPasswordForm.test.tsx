import * as React from 'react';
import { Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, waitForElement } from '@testing-library/dom';
import { renderWithRouterAndUser } from './Util';
import { ResetPasswordForm } from '../..';
import { strings } from '../../internationalization';

const mockData = {
  password: '12345678',
  ident: '87654321',
  token: '1234-1234',
};

jest.mock('axios', () => ({
  defaults: { withCredentials: true },
  post: jest.fn(() => Promise.resolve({
    data: [{}],
  })),
}));


// eslint-disable-next-line jest/expect-expect
test('renders the password form when ident and token are provided', async () => {
  const renderObject = renderWithRouterAndUser(
    <Route path="/reset-password/:ident/:token">
      <ResetPasswordForm />
    </Route>,
    { resetPassword: () => Promise.resolve() },
    ['/reset-password/1234/1234-1234'],
  );
  await waitForElement(() => renderObject.getByText(strings.ResetPassword.ResetPassword));
});

test('error state', async () => {
  const renderObject = renderWithRouterAndUser(
    <Route path="/reset-password/:ident/:token">
      <ResetPasswordForm />
    </Route>,
    {
      // eslint-disable-next-line prefer-promise-reject-errors
      resetPassword: () => Promise.reject({ response: { data: { error: {} } } }),
    },
    [`/reset-password/${mockData.ident}/${mockData.token}`],
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.ResetPassword.NewPassword),
    {
      target: {
        value: mockData.password,
      },
    },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.ResetPassword.RepeatNewPassword),
    {
      target: {
        value: mockData.password,
      },
    },
  );
  fireEvent.submit(renderObject.getByRole('form'));

  await waitForElement(() => renderObject.getByText(strings.ResetPassword.InvalidLink));
});

test('success state', async () => {
  const renderObject = renderWithRouterAndUser(
    <Route path="/reset-password/:ident/:token">
      <ResetPasswordForm />
    </Route>,
    {
      resetPassword: () => Promise.resolve(),
    },
    [`/reset-password/${mockData.ident}/${mockData.token}`],
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.ResetPassword.NewPassword),
    {
      target: {
        value: mockData.password,
      },
    },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.ResetPassword.RepeatNewPassword),
    {
      target: {
        value: mockData.password,
      },
    },
  );
  fireEvent.submit(renderObject.getByRole('form'));

  await waitForElement(() => renderObject.getByText(strings.ResetPassword.SuccessText));
});
