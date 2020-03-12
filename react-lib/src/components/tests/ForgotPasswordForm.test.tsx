import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/react';
import { strings } from '../../internationalization';
import { renderWithRouterAndUser } from './Util';
import { ForgotPasswordForm, makeForgotPasswordForm } from '../ForgotPasswordForm';

const mockEmail = 'mock@example.com';

test('submit calls login', () => {
  const requestPasswordReset = jest.fn();
  requestPasswordReset.mockReturnValue(new Promise<void>((r) => r()));
  const renderObject = renderWithRouterAndUser(
    <ForgotPasswordForm />,
    { requestPasswordReset },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.ForgotPassword.InputLabel),
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
  const LoginForgotForm = makeForgotPasswordForm({ pathToLogin });
  const renderObject = renderWithRouterAndUser(<LoginForgotForm />);
  fireEvent.click(renderObject.getByText(strings.ForgotPassword.BackToLogin));
  const { entries } = renderObject.history;
  expect(entries[entries.length - 1].pathname).toEqual(pathToLogin);
});
