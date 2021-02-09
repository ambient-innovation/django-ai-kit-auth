import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { makeLoginForm } from '../LoginForm';
import { User } from '../../api/types';
import { LogoutReason } from '../../store/types';
import { en } from '../../internationalization';
import { makeGenericUserStore, MockUserStoreProps } from '../..';
import { DeepPartial } from '../../util';
import { FullConfig, Identifier } from '../../config/components';
import { getFullTestConfig, TestRoutingProps } from '../../tests/Helper';

const mockUser: User = ({
  id: 42, username: 'Donald', email: 'donald@example.com',
});
const mockPassword = '1324qwer';

const login = jest.fn();

const { MockUserStore } = makeGenericUserStore();

const renderComponent = (
  config?: DeepPartial<FullConfig>,
  apiFunctions?: MockUserStoreProps,
  routingProps?: TestRoutingProps,
) => {
  const fullConfig = getFullTestConfig(config, routingProps);
  const { LoginForm } = makeLoginForm(fullConfig);

  return {
    fullConfig,
    ...render(
      <MockUserStore login={login} {...apiFunctions}>
        <LoginForm />
      </MockUserStore>,
    ),
  };
};

beforeEach(() => {
  login.mockReturnValue(new Promise(() => mockUser));
});

test('submit calls login', () => {
  const renderObject = renderComponent();
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
  const renderObject = renderComponent();
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
  const renderObject = renderComponent();
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
          nonFieldErrors: ['invalid_credentials'],
        },
      },
    });
  }));
  const renderObject = renderComponent();
  fireEvent.submit(renderObject.getByRole('form'));
  await waitForElement(
    () => renderObject.getByText(
      en('auth:Common.NonFieldErrors.invalid_credentials.UsernameOrEmail'),
    ),
  );
});

test('Email type in ident input field', () => {
  const renderOptions = renderComponent({ userIdentifier: Identifier.Email });
  expect(renderOptions.getByLabelText(en('auth:LoginForm.Email')))
    .toHaveProperty('type', 'email');
});

test('user logout success text', () => {
  const renderObject = renderComponent({}, { justLoggedOut: LogoutReason.USER });
  expect(renderObject.getByText(en('auth:LoginForm.LogoutSuccess'))).toBeInTheDocument();
});

test('auth logout notification', () => {
  const renderObject = renderComponent({}, { justLoggedOut: LogoutReason.AUTH });
  expect(renderObject.getByText(en('auth:LoginForm.AuthLogoutNotification'))).toBeInTheDocument();
});

test('reset link leads to correct url', () => {
  const pathToForgotPassword = '/path/to/forgot-password';
  const linkCallback = jest.fn();
  const renderObject = renderComponent(
    { paths: { forgotPassword: pathToForgotPassword } },
    {},
    { linkCallback },
  );

  fireEvent.click(renderObject.getByText(en('auth:LoginForm.ForgotPassword')));
  expect(linkCallback).toHaveBeenCalledWith(pathToForgotPassword);
});

test('register link leads to correct url', () => {
  const pathToRegister = '/path/to/register';
  const linkCallback = jest.fn();
  const renderObject = renderComponent(
    { paths: { register: pathToRegister } },
    {},
    { linkCallback },
  );
  fireEvent.click(renderObject.getByText(en('auth:LoginForm.SignUp')));
  expect(linkCallback).toHaveBeenCalledWith(pathToRegister);
});

test('register link is not shown if disabledUserRegistration', () => {
  const renderObject = renderComponent({ disableUserRegistration: true });
  expect(() => renderObject.getByText(en('auth:LoginForm.SignUp'))).toThrowError();
});

test('submit button disabled when loading', () => {
  const renderObject = renderComponent({}, { loading: true });
  expect(renderObject.getAllByRole('button').find(
    (element) => Object.values(element).find(
      (part) => part.type === 'submit',
    ),
  )).toBeDisabled();
});
