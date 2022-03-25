import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { en } from '../../internationalization';
import { dontResolvePromise, makeGenericUserStore, MockUserStoreProps } from '../../store/UserStore';
import { defaultApiConfig, getFullTestConfig, TestRoutingProps } from '../../tests/Helper';
import { makeResetPasswordForm } from '../ResetPassword';

const mockData = {
  password: '12345678',
  ident: '87654321',
  token: '1234-1234',
};

const sleep = async () => new Promise((r) => setTimeout(r, 400));

const { MockUserStore } = makeGenericUserStore(defaultApiConfig);

const renderComponent = (
  apiFunctions?: MockUserStoreProps,
  routingProps?: TestRoutingProps,
) => {
  const fullConfig = getFullTestConfig({}, {
    queryParams: { ident: '1234', token: '1234-1234' },
    ...routingProps,
  });
  const { ResetPasswordForm } = makeResetPasswordForm(fullConfig);

  return {
    fullConfig,
    ...render(
      <MockUserStore {...apiFunctions}>
        <ResetPasswordForm />
      </MockUserStore>,
    ),
  };
};

test('renders the password form when ident and token are provided', () => {
  const renderObject = renderComponent({ resetPassword: () => Promise.resolve() });

  return waitFor(() => {
    expect(renderObject.getByText(en('auth:ResetPassword.ResetPassword'))).toBeInTheDocument();
  });
});

test('password is validated once, when typing is finished', async () => {
  const validatePassword = jest.fn();
  validatePassword.mockReturnValue(dontResolvePromise());
  const renderObject = renderComponent(
    { validatePassword },
    { queryParams: { ident: mockData.ident, token: '1234-1234' } },
  );
  userEvent.type(
    renderObject.getByLabelText(en('auth:ResetPassword.NewPassword')),
    'placeholder',
  );
  userEvent.clear(
    renderObject.getByLabelText(en('auth:ResetPassword.NewPassword')),
  );
  userEvent.type(
    renderObject.getByLabelText(en('auth:ResetPassword.NewPassword')),
    mockData.password,
  );

  // wait for debounce
  await sleep();

  expect(validatePassword).toHaveBeenCalledWith({
    ident: mockData.ident,
    password: mockData.password,
  });
  expect(validatePassword).toHaveBeenCalledTimes(1);
});

test('error state', () => {
  const renderObject = renderComponent(
    {
      // eslint-disable-next-line prefer-promise-reject-errors
      resetPassword: () => Promise.reject({ response: { data: { error: {} } } }),
    },
    { queryParams: mockData },
  );
  userEvent.type(
    renderObject.getByLabelText(en('auth:ResetPassword.NewPassword')),
    mockData.password,
  );
  userEvent.type(
    renderObject.getByLabelText(en('auth:ResetPassword.RepeatNewPassword')),
    mockData.password,
  );
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:ResetPassword.ButtonText') },
    ),
  );

  return waitFor(() => {
    expect(
      renderObject.getByText(en('auth:ResetPassword.InvalidLink')),
    ).toBeInTheDocument();
  });
});

test('success state', () => {
  const renderObject = renderComponent(
    { resetPassword: () => Promise.resolve() },
    { queryParams: mockData },
  );
  userEvent.type(
    renderObject.getByLabelText(en('auth:ResetPassword.NewPassword')),
    mockData.password,
  );
  userEvent.type(
    renderObject.getByLabelText(en('auth:ResetPassword.RepeatNewPassword')),
    mockData.password,
  );
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:ResetPassword.ButtonText') },
    ),
  );

  return waitFor(() => {
    expect(
      renderObject.getByText(en('auth:ResetPassword.SuccessText')),
    ).toBeInTheDocument();
  });
});
