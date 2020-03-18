import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, waitForElement } from '@testing-library/react';
import { defaultConfig, RegisterForm } from '../..';
import { makeRegisterForm } from '../Register';
import { strings } from '../../internationalization';
import { renderWithRouterAndUser } from './Util';
import { mergeConfig } from '../../Configuration';

const mockUser = ({
  username: 'Donald', email: 'donald@example.com', password: 'longpass',
});

const register = jest.fn();

const renderFunction = (
  element: JSX.Element = <RegisterForm />,
) => renderWithRouterAndUser(element, { register });

beforeEach(() => {
  register.mockReturnValue(new Promise<void>(() => null));
});

test('submit calls register', () => {
  const renderObject = renderFunction();
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Username),
    {
      target: {
        value: mockUser.username,
      },
    },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Email),
    {
      target: {
        value: mockUser.email,
      },
    },
  );
  fireEvent.change(
    renderObject.getByLabelText(strings.RegisterForm.Password),
    {
      target: {
        value: mockUser.password,
      },
    },
  );
  fireEvent.submit(renderObject.getByRole('form'));
  expect(register).toHaveBeenCalledWith(
    mockUser.username,
    mockUser.email,
    mockUser.password,
  );
});

// eslint-disable-next-line jest/expect-expect
test('error in username field', async () => {
  register.mockReturnValue(new Promise(() => {
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
});

// eslint-disable-next-line jest/expect-expect
test('error in email field', async () => {
  register.mockReturnValue(new Promise(() => {
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
});

// eslint-disable-next-line jest/expect-expect
test('error in password field', async () => {
  register.mockReturnValue(new Promise(() => {
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
  register.mockReturnValue(new Promise(() => {
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
  const renderObject = renderFunction(<LoginRegisterForm />);
  fireEvent.click(renderObject.getByText(strings.RegisterForm.BackToLogin));
  const { entries } = renderObject.history;
  expect(entries[entries.length - 1].pathname).toEqual(pathToLogin);
});
