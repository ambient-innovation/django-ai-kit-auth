import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, waitForElement } from '@testing-library/react';
import { defaultConfig, RegisterForm } from '../..';
import { makeRegisterForm } from '../Register';
import allStrings from '../../internationalization';
import { dontResolvePromise, renderWithRouterAndUser } from './Util';
import { mergeConfig } from '../../Configuration';

const strings = allStrings.en;

const mockUser = ({
  username: 'Donald', email: 'donald@example.com', password: 'longpass',
});

const sleep = async () => new Promise((r) => setTimeout(r, 400));

const register = jest.fn();

const renderFunction = (
  element: JSX.Element = <RegisterForm strings={strings} />,
) => renderWithRouterAndUser(element, {
  register,
});

beforeEach(() => {
  register.mockReturnValue(dontResolvePromise());
});

test('submit calls register', () => {
  const renderObject = renderFunction();
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Username),
    { target: { value: mockUser.username } },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Email),
    { target: { value: mockUser.email } },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Password),
    { target: { value: mockUser.password } },
  );
  fireEvent.submit(renderObject.getByRole('form'));
  expect(register).toHaveBeenCalledWith(
    mockUser.username,
    mockUser.email,
    mockUser.password,
  );
});

test('password is validated once, when typing is finished', async () => {
  const validatePassword = jest.fn();
  validatePassword.mockReturnValue(dontResolvePromise());
  const renderObject = renderWithRouterAndUser(
    <RegisterForm strings={strings} />,
    { validatePassword },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Username),
    { target: { value: mockUser.username } },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Email),
    { target: { value: mockUser.email } },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Password),
    { target: { value: 'placeholder' } },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Password),
    { target: { value: mockUser.password } },
  );

  // wait for debounce
  await sleep();

  expect(validatePassword).toHaveBeenCalledWith(mockUser);
  expect(validatePassword).toHaveBeenCalledTimes(1);
});

test('cannot submit while loading', () => {
  register.mockReturnValue(dontResolvePromise());
  const renderObject = renderFunction();
  fireEvent.submit(renderObject.getByRole('form'));
  expect(renderObject.getByTitle(strings.RegisterForm.Register)).toBeDisabled();
});

test('on success, text is shown and form vanishes', async () => {
  register.mockReturnValue(Promise.resolve());
  const renderObject = renderFunction();
  fireEvent.submit(renderObject.getByRole('form'));
  await waitForElement(() => renderObject.getByText(strings.RegisterForm.SuccessText));
  expect(renderObject.getByText(strings.RegisterForm.SuccessTitle)).toBeInTheDocument();
  expect(() => renderObject.getByRole('form')).toThrowError();
});

test('error in username field', async () => {
  register.mockReturnValue(new Promise<void>(() => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      response: {
        data: {
          username: ['blank'],
        },
      },
    });
  }));
  const renderObject = renderFunction();
  fireEvent.submit(renderObject.getByRole('form'));
  await waitForElement(
    () => renderObject.getByText(strings.Common.FieldErrors.blank),
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Username),
    { target: { value: 'a' } },
  );
  expect(() => renderObject.getByText(strings.Common.FieldErrors.blank)).toThrowError();
});

test('error in email field', async () => {
  register.mockReturnValue(new Promise<void>(() => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      response: {
        data: {
          email: ['blank'],
        },
      },
    });
  }));
  const renderObject = renderFunction();
  fireEvent.submit(renderObject.getByRole('form'));
  await waitForElement(
    () => renderObject.getByText(strings.Common.FieldErrors.blank),
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Email),
    { target: { value: 'a' } },
  );
  expect(() => renderObject.getByText(strings.Common.FieldErrors.blank)).toThrowError();
});

// eslint-disable-next-line jest/expect-expect
test('error in password field', async () => {
  register.mockReturnValue(new Promise<void>(() => {
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
test('error in password while typing', async () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const validatePassword = () => new Promise<void>(() => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      response: {
        data: {
          password: ['password_too_short'],
        },
      },
    });
  });
  const renderObject = renderWithRouterAndUser(
    <RegisterForm strings={strings} />,
    { validatePassword },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Password),
    { target: { value: '123' } },
  );
  await waitForElement(() => renderObject.getByText(strings.Common.FieldErrors.password_too_short));
});

// eslint-disable-next-line jest/expect-expect
test('show general error', async () => {
  register.mockReturnValue(new Promise<void>(() => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      response: {
        data: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          non_field_errors: ['something really is wrong'],
        },
      },
    });
  }));
  const renderObject = renderFunction();
  fireEvent.submit(renderObject.getByRole('form'));
  await waitForElement(
    () => renderObject.getByText(
      strings.RegisterForm.NonFieldErrors.general,
    ),
  );
});

test('sign in link leads to correct url', () => {
  const pathToLogin = '/path/to/login';
  const LoginRegisterForm = makeRegisterForm(mergeConfig(defaultConfig, {
    paths: { login: pathToLogin },
  })).RegisterForm;
  const renderObject = renderFunction(<LoginRegisterForm strings={strings} />);
  fireEvent.click(renderObject.getByText(strings.RegisterForm.BackToLogin));
  const { entries } = renderObject.history;
  expect(entries[entries.length - 1].pathname).toEqual(pathToLogin);
});
