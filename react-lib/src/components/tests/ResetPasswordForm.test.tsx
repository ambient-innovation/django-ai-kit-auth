import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { en } from '../../internationalization';
import { dontResolvePromise, makeGenericUserStore, MockUserStoreProps } from '../../store/UserStore';
import { getFullTestConfig, TestRoutingProps } from '../../tests/Helper';
import { makeResetPasswordForm } from '../ResetPassword';

const mockData = {
  password: '12345678',
  ident: '87654321',
  token: '1234-1234',
};

const sleep = async () => new Promise((r) => setTimeout(r, 400));

const { MockUserStore } = makeGenericUserStore();

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

// eslint-disable-next-line jest/expect-expect
test('renders the password form when ident and token are provided', async () => {
  const renderObject = renderComponent({ resetPassword: () => Promise.resolve() });
  await waitForElement(() => renderObject.getByText(en('auth:ResetPassword.ResetPassword')));
});

test('password is validated once, when typing is finished', async () => {
  const validatePassword = jest.fn();
  validatePassword.mockReturnValue(dontResolvePromise());
  const renderObject = renderComponent(
    { validatePassword },
    { queryParams: { ident: mockData.ident, token: '1234-1234' } },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:ResetPassword.NewPassword')),
    { target: { value: 'placeholder' } },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:ResetPassword.NewPassword')),
    { target: { value: mockData.password } },
  );

  // wait for debounce
  await sleep();

  expect(validatePassword).toHaveBeenCalledWith({
    ident: mockData.ident,
    password: mockData.password,
  });
  expect(validatePassword).toHaveBeenCalledTimes(1);
});

// eslint-disable-next-line jest/expect-expect
test('error state', async () => {
  const renderObject = renderComponent(
    {
      // eslint-disable-next-line prefer-promise-reject-errors
      resetPassword: () => Promise.reject({ response: { data: { error: {} } } }),
    },
    { queryParams: mockData },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:ResetPassword.NewPassword')),
    {
      target: {
        value: mockData.password,
      },
    },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:ResetPassword.RepeatNewPassword')),
    {
      target: {
        value: mockData.password,
      },
    },
  );
  fireEvent.submit(renderObject.getByRole('form'));

  await waitForElement(() => renderObject.getByText(en('auth:ResetPassword.InvalidLink')));
});

// eslint-disable-next-line jest/expect-expect
test('success state', async () => {
  const renderObject = renderComponent(
    { resetPassword: () => Promise.resolve() },
    { queryParams: mockData },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:ResetPassword.NewPassword')),
    {
      target: {
        value: mockData.password,
      },
    },
  );
  fireEvent.change(
    renderObject.getByLabelText(en('auth:ResetPassword.RepeatNewPassword')),
    {
      target: {
        value: mockData.password,
      },
    },
  );
  fireEvent.submit(renderObject.getByRole('form'));

  await waitForElement(() => renderObject.getByText(en('auth:ResetPassword.SuccessText')));
});
