import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeRegisterForm } from '../Register';
import { DeepPartial } from '../../util';
import { en } from '../../internationalization';
import { dontResolvePromise, makeGenericUserStore, MockUserStoreProps } from '../../store/UserStore';
import { defaultApiConfig, getFullTestConfig, TestRoutingProps } from '../../tests/Helper';
import { FullConfig, Identifier } from '../../config/components';

const mockUser = ({
  username: 'Donald', email: 'donald@example.com', password: 'longpass',
});

const sleep = async () => new Promise((r) => setTimeout(r, 400));

const register = jest.fn();

const { MockUserStore } = makeGenericUserStore(defaultApiConfig);

const renderFunction = (
  config?: DeepPartial<FullConfig>,
  testContext?: MockUserStoreProps,
  routingProps?: TestRoutingProps,
) => {
  const fullConfig: FullConfig = getFullTestConfig(config, routingProps);
  const { RegisterForm } = makeRegisterForm(fullConfig);

  return {
    fullConfig,
    ...render(
      <MockUserStore register={register} {...testContext}>
        <RegisterForm />
      </MockUserStore>,
    ),
  };
};

beforeEach(() => {
  register.mockReturnValue(dontResolvePromise());
});

test.each(
  [Identifier.Username, Identifier.UsernameOrEmail],
)('with identifier %s, the username textbox is rendered', (userIdentifier) => {
  const { getByTestId } = renderFunction({ userIdentifier });

  expect(getByTestId('register_username')).toBeVisible();
});

test('with email identifier, username textbox is not rendered', () => {
  const { queryByTestId } = renderFunction({ userIdentifier: Identifier.Email });

  expect(queryByTestId('register_username')).toBeFalsy();
});

test('submit calls register', () => {
  const renderObject = renderFunction();
  userEvent.type(
    renderObject.getByLabelText(en('auth:RegisterForm.Username')),
    mockUser.username,
  );
  userEvent.type(
    renderObject.getByLabelText(en('auth:RegisterForm.Email')),
    mockUser.email,
  );
  userEvent.type(
    renderObject.getByLabelText(en('auth:RegisterForm.Password')),
    mockUser.password,
  );
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:RegisterForm.Register') },
    ),
  );
  expect(register).toHaveBeenCalledWith(
    mockUser.username,
    mockUser.email,
    mockUser.password,
  );
});

test('password is validated once, when typing is finished', async () => {
  const validatePassword = jest.fn();
  validatePassword.mockReturnValue(dontResolvePromise());
  const renderObject = renderFunction({}, { validatePassword });
  fireEvent.change(
    renderObject.getByLabelText(en('auth:RegisterForm.Username')),
    { target: { value: mockUser.username } },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:RegisterForm.Email')),
    { target: { value: mockUser.email } },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:RegisterForm.Password')),
    { target: { value: 'placeholder' } },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:RegisterForm.Password')),
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
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:RegisterForm.Register') },
    ),
  );
  expect(
    renderObject.getByRole(
      'button',
      { name: en('auth:RegisterForm.Register') },
    ),
  ).toBeDisabled();
});

test('on success, text is shown and form vanishes', async () => {
  register.mockReturnValue(Promise.resolve());
  const renderObject = renderFunction();
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:RegisterForm.Register') },
    ),
  );
  await waitFor(() => {
    expect(
      renderObject.getByText(en('auth:RegisterForm.SuccessText')),
    ).toBeInTheDocument();
  });
  expect(renderObject.getByText(en('auth:RegisterForm.SuccessTitle'))).toBeInTheDocument();
  expect(renderObject.queryByTestId('register-form')).not.toBeInTheDocument();
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
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:RegisterForm.Register') },
    ),
  );
  await waitFor(() => {
    expect(
      renderObject.getByText(en('auth:Common.FieldErrors.blank')),
    ).toBeInTheDocument();
  });
  userEvent.type(
    renderObject.getByLabelText(en('auth:RegisterForm.Username')),
    'a',
  );
  expect(renderObject.queryByText(en('auth:Common.FieldErrors.blank'))).not.toBeInTheDocument();
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
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:RegisterForm.Register') },
    ),
  );
  await waitFor(() => {
    expect(
      renderObject.getByText(en('auth:Common.FieldErrors.blank')),
    ).toBeInTheDocument();
  });
  userEvent.type(
    renderObject.getByLabelText(en('auth:RegisterForm.Email')),
    'a',
  );
  expect(renderObject.queryByText(en('auth:Common.FieldErrors.blank'))).not.toBeInTheDocument();
});

test('error in password field', () => {
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
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:RegisterForm.Register') },
    ),
  );

  return waitFor(() => {
    expect(
      renderObject.getByText(en('auth:Common.FieldErrors.blank')),
    ).toBeInTheDocument();
  });
});

test('error in password while typing', () => {
  const validatePassword = jest.fn(() => new Promise<void>(() => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      response: {
        data: {
          password: ['password_too_short'],
        },
      },
    });
  }));
  const renderObject = renderFunction({}, { validatePassword });
  userEvent.type(
    renderObject.getByLabelText(en('auth:RegisterForm.Password')),
    '123',
  );

  return waitFor(() => {
    expect(
      renderObject.getByText(en('auth:Common.FieldErrors.password_too_short')),
    ).toBeInTheDocument();
  });
});

test('show general error', () => {
  register.mockReturnValue(new Promise<void>(() => {
    // eslint-disable-next-line no-throw-literal
    throw ({
      response: {
        data: {
          nonFieldErrors: ['something really is wrong'],
        },
      },
    });
  }));
  const renderObject = renderFunction();
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:RegisterForm.Register') },
    ),
  );

  return waitFor(
    () => expect(renderObject.getByText(
      en('auth:RegisterForm.NonFieldErrors.general'),
    )).toBeInTheDocument(),
  );
});

test('sign in link leads to correct url', () => {
  const pathToLogin = '/path/to/login';
  const linkCallback = jest.fn();
  const renderObject = renderFunction(
    { paths: { login: pathToLogin } }, {}, { linkCallback },
  );
  fireEvent.click(renderObject.getByText(en('auth:RegisterForm.BackToLogin')));
  expect(linkCallback).toHaveBeenCalledWith(pathToLogin);
});
