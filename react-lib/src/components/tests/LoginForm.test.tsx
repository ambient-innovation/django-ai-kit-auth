import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, waitForElement } from '@testing-library/react';
import { defaultConfig, Identifier, LoginForm } from '../..';
import { makeLoginForm } from '../LoginForm';
import { User } from '../../api/types';
import { renderWithRouterAndUser } from './Util';
import { LogoutReason } from '../../store/types';
import { mergeConfig } from '../../Configuration';
import { en } from '../../internationalization';

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
    renderObject.getByLabelText(en('auth:LoginForm.UsernameOrEmail')),
    {
      target: {
        value: mockUser.username,
      },
    },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:Common.Password')),
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
    () => renderObject.getByText(en('auth:Common.FieldErrors.blank')),
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
    () => renderObject.getByText(en('auth:Common.FieldErrors.blank')),
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
          nonFieldErrors: ['invalid_credentials'],
        },
      },
    });
  }));
  const renderObject = renderFunction();
  fireEvent.submit(renderObject.getByRole('form'));
  await waitForElement(
    () => renderObject.getByText(
      en('auth:Common.NonFieldErrors.invalid_credentials.UsernameOrEmail'),
    ),
  );
});

test('Email type in ident input field', () => {
  const EmailLoginForm = makeLoginForm(mergeConfig(defaultConfig, {
    userIdentifier: Identifier.Email,
  })).LoginForm;
  const renderOptions = renderFunction(<EmailLoginForm />);
  expect(renderOptions.getByLabelText(en('auth:LoginForm.Email')))
    .toHaveProperty('type', 'email');
});

test('user logout success text', () => {
  const renderObject = renderWithRouterAndUser(
    <LoginForm />,
    { justLoggedOut: LogoutReason.USER },
  );
  expect(renderObject.getByText(en('auth:LoginForm.LogoutSuccess'))).toBeInTheDocument();
});

test('auth logout notification', () => {
  const renderObject = renderWithRouterAndUser(
    <LoginForm />,
    { justLoggedOut: LogoutReason.AUTH },
  );
  expect(renderObject.getByText(en('auth:LoginForm.AuthLogoutNotification'))).toBeInTheDocument();
});

test('reset link leads to correct url', () => {
  const pathToForgotPassword = '/path/to/forgot-password';
  const ForgotLoginForm = makeLoginForm(mergeConfig(defaultConfig, {
    paths: { forgotPassword: pathToForgotPassword },
  })).LoginForm;
  const renderObject = renderFunction(<ForgotLoginForm />);
  fireEvent.click(renderObject.getByText(en('auth:LoginForm.ForgotPassword')));
  const { entries } = renderObject.history;
  expect(entries[entries.length - 1].pathname).toEqual(pathToForgotPassword);
});

test('register link leads to correct url', () => {
  const pathToRegister = '/path/to/register';
  const RegisterLoginForm = makeLoginForm(mergeConfig(defaultConfig, {
    paths: { register: pathToRegister },
  })).LoginForm;
  const renderObject = renderFunction(<RegisterLoginForm />);
  fireEvent.click(renderObject.getByText(en('auth:LoginForm.SignUp')));
  const { entries } = renderObject.history;
  expect(entries[entries.length - 1].pathname).toEqual(pathToRegister);
});

test('register link is not shown if disabledUserRegistration', () => {
  const PureLoginForm = makeLoginForm(mergeConfig(defaultConfig, {
    disableUserRegistration: true,
  })).LoginForm;
  const renderObject = renderFunction(<PureLoginForm />);
  expect(() => renderObject.getByText(en('auth:LoginForm.SignUp'))).toThrowError();
});

test('submit button disabled when loading', () => {
  const renderObject = renderWithRouterAndUser(
    <LoginForm />,
    { loading: true },
  );
  expect(renderObject.getAllByRole('button').find(
    (element) => Object.values(element).find(
      (part) => part.type === 'submit',
    ),
  )).toBeDisabled();
});
