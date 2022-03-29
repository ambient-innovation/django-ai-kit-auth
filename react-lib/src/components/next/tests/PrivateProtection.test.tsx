import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { defaultApiConfig, getFullTestConfig } from '../../../tests/Helper';
import { makePrivateProtection } from '../PrivateProtection';
import { DeepPartial } from '../../../util';
import { makeGenericUserStore, MockUserStoreProps, noop } from '../../../store/UserStore';
import { FullConfig } from '../../../config/components';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock<NextRouter>;

beforeEach(() => {
  mockUseRouter.mockReset();
  mockUseRouter.mockReturnValue({
    asPath: '',
    replace: () => new Promise<boolean>(noop),
  } as unknown as NextRouter);
});

const {
  MockUserStore,
} = makeGenericUserStore(defaultApiConfig);

const renderComponent = (
  apiFunctions?: MockUserStoreProps,
  config?: DeepPartial<FullConfig>,
) => {
  const testConfig = getFullTestConfig(config);
  const PrivateProtection = makePrivateProtection(testConfig);

  return {
    testConfig,
    ...render(
      <MockUserStore {...apiFunctions}>
        <PrivateProtection>
          content
        </PrivateProtection>
      </MockUserStore>,
    ),
  };
};

test('renders content while not loading and logged in', () => {
  const { getByText, testConfig } = renderComponent({ loading: false, loggedIn: true });
  expect(getByText('content')).toBeVisible();
  expect(testConfig.components.loadingIndicator).not.toHaveBeenCalled();
});

test('shows loading indicator when user store shows loading', () => {
  const { queryByText, testConfig } = renderComponent({ loading: true });
  expect(queryByText('content')).toBeFalsy();
  expect(testConfig.components.loadingIndicator).toHaveBeenCalled();
});

test('shows loading indicator when not logged in, even after loading is completed', () => {
  const { queryByText, testConfig } = renderComponent({ loading: false, loggedIn: false });
  expect(queryByText('content')).toBeFalsy();
  expect(testConfig.components.loadingIndicator).toHaveBeenCalled();
});

test('redirects to login page when not loading and not logged in', () => {
  const replace = jest.fn();
  const asPath = '/path/of/the/website';
  mockUseRouter.mockReturnValue({ asPath, replace } as unknown as NextRouter);
  const { testConfig } = renderComponent({ loading: false, loggedIn: false });
  expect(replace).toHaveBeenCalledWith({
    pathname: testConfig.paths.login, query: { next: asPath },
  });
});

test('uses main page as next for login, when no path is given', () => {
  const replace = jest.fn();
  mockUseRouter.mockReturnValue({ replace, asPath: null } as unknown as NextRouter);
  const { testConfig } = renderComponent({ loading: false, loggedIn: false });
  expect(replace).toHaveBeenCalledWith({
    pathname: testConfig.paths.login, query: { next: testConfig.paths.mainPage },
  });
});
