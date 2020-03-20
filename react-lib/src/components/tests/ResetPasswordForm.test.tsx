import * as React from 'react';
import { Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, waitForElement } from '@testing-library/dom';
import { dontResolvePromise, renderWithRouterAndUser } from './Util';
import { ResetPasswordForm } from '../..';
import { strings } from '../../internationalization';

const mockData = {
  password: '12345678',
  ident: '87654321',
  token: '1234-1234',
};

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

test('password is validated while typing', () => {
  const validatePassword = jest.fn();
  validatePassword.mockReturnValue(dontResolvePromise());
  const renderObject = renderWithRouterAndUser(
    <Route path="/reset-password/:ident/:token">
      <ResetPasswordForm />
    </Route>,
    { validatePassword },
    [`/reset-password/${mockData.ident}/1234-1234`],
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.ResetPassword.NewPassword),
    { target: { value: mockData.password } },
  );
  expect(validatePassword).toHaveBeenCalledWith({
    ident: mockData.ident,
    password: mockData.password,
  });
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
