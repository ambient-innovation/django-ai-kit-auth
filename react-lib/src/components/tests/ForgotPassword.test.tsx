import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeForgotPasswordForm } from '../ForgotPassword';
import { en } from '../../internationalization';
import { defaultApiConfig, getFullTestConfig, TestRoutingProps } from '../../tests/Helper';
import { DeepPartial } from '../../util';
import { makeGenericUserStore, MockUserStoreProps } from '../../store/UserStore';
import { FullConfig } from '../../config/components';

const mockEmail = 'mock@example.com';

const { MockUserStore } = makeGenericUserStore(defaultApiConfig);

const renderComponent = (
  apiFunctions?: MockUserStoreProps,
  config?: DeepPartial<FullConfig>,
  routingProps?: TestRoutingProps,
) => {
  const fullConfig = getFullTestConfig(config, routingProps);
  const { ForgotPasswordForm } = makeForgotPasswordForm(fullConfig);

  return {
    fullConfig,
    ...render(
      <MockUserStore {...apiFunctions}>
        <ForgotPasswordForm />
      </MockUserStore>,
    ),
  };
};

test('submit calls login', () => {
  const requestPasswordReset = jest.fn();
  requestPasswordReset.mockReturnValue(new Promise<void>((r) => r()));
  const renderObject = renderComponent({ requestPasswordReset });
  userEvent.type(
    renderObject.getByLabelText(
      en('auth:ForgotPassword.InputLabel'),
      { exact: false },
    ),
    mockEmail,
  );
  userEvent.click(
    renderObject.getByRole(
      'button',
      { name: en('auth:ForgotPassword.ButtonText') },
    ),
  );
  expect(requestPasswordReset).toHaveBeenCalledWith(
    mockEmail,
  );
});

test('login link leads to correct url', () => {
  const pathToLogin = '/path/to/login';
  const linkCallback = jest.fn();
  const renderObject = renderComponent(
    {}, { paths: { login: pathToLogin } }, { linkCallback },
  );
  fireEvent.click(renderObject.getByText(en('auth:ForgotPassword.BackToLogin')));
  expect(linkCallback).toHaveBeenCalledWith(pathToLogin);
});
