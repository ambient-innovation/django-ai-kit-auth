import * as React from 'react';
import { createMemoryHistory } from 'history';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { AuthFunctionContext } from '../../store/UserStore';
import { UserContext } from '../..';
import { User } from '../../api/types';
import { AuthFunctionContextValue, LogoutReason, UserStoreValue } from '../../store/types';

export const dontResolvePromise = () => new Promise<void>(() => null);

export const renderWithRouterAndUser = (
  element: JSX.Element,
  testContext?: Partial<UserStoreValue<User>&AuthFunctionContextValue>,
  initialEntries: string[] = ['/auth/login'],
) => {
  const history = createMemoryHistory({ initialEntries });

  const { user, ...context } = testContext || { user: null };

  return ({
    history,
    ...render(
      <UserContext.Provider value={{ user: user || null }}>
        <AuthFunctionContext.Provider
          value={{
            apiUrl: 'https://example.com/api/v1',
            csrf: '1234',
            axiosRequestConfig: {
              headers: {
                common: { 'X-CSRFToken': context?.csrf || '1234' },
              },
            },
            loading: false,
            login: dontResolvePromise,
            loggedIn: !!user,
            logout: dontResolvePromise,
            updateUserInfo: dontResolvePromise,
            justLoggedOut: LogoutReason.NONE,
            activateEmailAddress: dontResolvePromise,
            validatePassword: dontResolvePromise,
            requestPasswordReset: dontResolvePromise,
            resetPassword: dontResolvePromise,
            register: dontResolvePromise,
            ...context,
          }}
        >
          <Router history={history}>
            {element}
          </Router>
        </AuthFunctionContext.Provider>
      </UserContext.Provider>,
    ),
  });
};
