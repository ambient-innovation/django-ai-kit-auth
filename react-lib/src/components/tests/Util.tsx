import * as React from 'react';
import { createMemoryHistory } from 'history';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { AuthFunctionContext } from '../../store/UserStore';
import { UserContext } from '../..';
import { User } from '../../api/types';
import { AuthFunctionContextValue, UserStoreValue } from '../../store/types';

const successPromise = () => new Promise<void>((r) => r());

export const renderWithRouterAndUser = (
  element: JSX.Element,
  testContext?: Partial<UserStoreValue<User>&AuthFunctionContextValue>,
  initialEntries: string[] = ['/auth/login'],
) => {
  const history = createMemoryHistory({ initialEntries });

  return ({
    history,
    ...render(
      <UserContext.Provider value={{ user: testContext?.user || null }}>
        <AuthFunctionContext.Provider
          value={{
            csrf: testContext?.csrf || '',
            loading: !!testContext?.loading,
            login: testContext?.login || successPromise,
            loggedIn: !!testContext?.user,
            logout: testContext?.logout || successPromise,
            justLoggedOut: !!testContext?.justLoggedOut,
            activateEmailAddress: testContext?.activateEmailAddress || successPromise,
            requestPasswordReset: testContext?.requestPasswordReset || successPromise,
            apiUrl: testContext?.apiUrl || 'https://example.com/api/v1',
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
