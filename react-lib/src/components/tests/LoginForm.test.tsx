import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, waitForElement } from '@testing-library/react';
import { defaultConfig, Identifier, LoginForm } from '../..';
import { makeLoginForm } from '../LoginForm';
import { strings } from '../../internationalization';
import { User } from '../../api/types';
import { renderWithRouterAndUser } from './Util';
import { LogoutReason } from '../../store/types';
import { mergeConfig } from '../../Configuration';

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});
const mockPassword = '1324qwer';

const login = jest.fn();

const renderFunction = (
  element: JSX.Element = <LoginForm />,
) => renderWithRouterAndUser(element, { login });

beforeEach(() => {
  login.mockReturnValue(new Promise(() => mockUser));
});

test('submit calls login', () => {
  const renderObject = renderFunction();
  fireEvent.change(
    renderObject.getByLabelText(strings.LoginForm.UsernameOrEmail),
    {
      target: {
        value: mockUser.username,
      },
    },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.LoginForm.Password),
    {
      target: {
        value: mockPassword,
      },
    },
  );
  fireEvent.submit(renderObject.getByRole('form'));
  expect(login).toHaveBeenCalledWith(
    mockUser.username,
    mockPassword,
  );
});

// eslint-disable-next-line jest/expect-expect
test('error in identifier field', async () => {
  login.mockReturnValue(new Promise(() => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      response: {
        data: {
          ident: ['blank'],
        },
      },
    });
  }));
  const renderObject = renderFunction();
  fireEvent.submit(renderObject.getByRole('form'));
  await waitForElement(
    () => renderObject.getByText(strings.Common.FieldErrors.blank),
  );
});

// eslint-disable-next-line jest/expect-expect
test('error in password field', async () => {
  login.mockReturnValue(new Promise(() => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      response: {
        data: {
          password: ['blank'],
        },
      },
    });
  }));
  const renderObject = renderFunction();
  fireEvent.submit(renderObject.getByRole('form'));
  await waitForElement(
    () => renderObject.getByText(strings.Common.FieldErrors.blank),
  );
});

// eslint-disable-next-line jest/expect-expect
test('show general error', async () => {
  login.mockReturnValue(new Promise(() => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      response: {
        data: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          non_field_errors: ['invalid_credentials'],
        },
      },
    });
  }));
  const renderObject = renderFunction();
  fireEvent.submit(renderObject.getByRole('form'));
  await waitForElement(
    () => renderObject.getByText(
      strings.Common.NonFieldErrors.invalid_credentials.UsernameOrEmail,
    ),
  );
});

test('password visibility', () => {
  const renderObject = renderFunction();
  expect(renderObject.getByLabelText(strings.LoginForm.Password))
    .toHaveProperty('type', 'password');
  fireEvent.click(renderObject.getByLabelText('toggle password visibility'));
  expect(renderObject.getByLabelText(strings.LoginForm.Password))
    .toHaveProperty('type', 'text');
  fireEvent.click(renderObject.getByLabelText('toggle password visibility'));
  expect(renderObject.getByLabelText(strings.LoginForm.Password))
    .toHaveProperty('type', 'password');
});

test('Email type in ident input field', () => {
  const EmailLoginForm = makeLoginForm(mergeConfig(defaultConfig, {
    userIdentifier: Identifier.Email,
  })).LoginForm;
  const renderOptions = renderFunction(<EmailLoginForm />);
  expect(renderOptions.getByLabelText(strings.LoginForm.Email))
    .toHaveProperty('type', 'email');
});

test('user logout success text', () => {
  const renderObject = renderWithRouterAndUser(
    <LoginForm />,
    { justLoggedOut: LogoutReason.USER },
  );
  expect(renderObject.getByText(strings.LoginForm.LogoutSuccess)).toBeInTheDocument();
});

test('auth logout notification', () => {
  const renderObject = renderWithRouterAndUser(
    <LoginForm />,
    { justLoggedOut: LogoutReason.AUTH },
  );
  expect(renderObject.getByText(strings.LoginForm.AuthLogoutNotification)).toBeInTheDocument();
});

test('reset link leads to correct url', () => {
  const pathToForgotPassword = '/path/to/forgot-password';
  const ForgotLoginForm = makeLoginForm(mergeConfig(defaultConfig, {
    paths: { forgotPassword: pathToForgotPassword },
  })).LoginForm;
  const renderObject = renderFunction(<ForgotLoginForm />);
  fireEvent.click(renderObject.getByText(strings.LoginForm.ForgotPassword));
  const { entries } = renderObject.history;
  expect(entries[entries.length - 1].pathname).toEqual(pathToForgotPassword);
});