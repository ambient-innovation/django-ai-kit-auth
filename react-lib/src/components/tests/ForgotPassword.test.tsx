import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/react';
import { renderWithRouterAndUser } from './Util';
import { defaultConfig, ForgotPasswordForm } from '../..';
import { makeForgotPasswordForm } from '../ForgotPassword';
import { mergeConfig } from '../../Configuration';
import { en } from '../../internationalization';

const mockEmail = 'mock@example.com';

test('submit calls login', () => {
  const requestPasswordReset = jest.fn();
  requestPasswordReset.mockReturnValue(new Promise<void>((r) => r()));
  const renderObject = renderWithRouterAndUser(
    <ForgotPasswordForm />,
    { requestPasswordReset },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:ForgotPassword.InputLabel'), { exact: false }),
    {
      target: {
        value: mockEmail,
      },
    },
  );
  fireEvent.submit(renderObject.getByRole('form'));
  expect(requestPasswordReset).toHaveBeenCalledWith(
    mockEmail,
  );
});

test('login link leads to correct url', () => {
  const pathToLogin = '/path/to/login';
  const LoginForgotForm = makeForgotPasswordForm(mergeConfig(defaultConfig, {
    paths: { login: pathToLogin },
  })).ForgotPasswordForm;
  const renderObject = renderWithRouterAndUser(<LoginForgotForm />);
  fireEvent.click(renderObject.getByText(en('auth:ForgotPassword.BackToLogin')));
  const { entries } = renderObject.history;
  expect(entries[entries.length - 1].pathname).toEqual(pathToLogin);
});
