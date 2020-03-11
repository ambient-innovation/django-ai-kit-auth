import * as React from 'react';
import { createMemoryHistory } from 'history';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { AuthFunctionContext, UserContext } from '../../store/UserStore';
import { User } from '../../api/types';
import { AuthFunctionContextValue, UserStoreValue } from '../../store/types';

export const renderWithRouterAndUser = (
  element: JSX.Element,
  testContext?: Partial<UserStoreValue<User>&AuthFunctionContextValue>,
  initialEntries: string[] = ['/auth/login'],
) => {
  const history = createMemoryHistory({ initialEntries });

  return ({
    history,
    ...render(
      <UserContext.Provider value={{ user: testContext?.user }}>
        <AuthFunctionContext.Provider
          value={{
            loading: !!testContext?.loading,
            login: testContext?.login || jest.fn(),
            loggedIn: !!testContext?.user,
            logout: testContext?.logout || jest.fn(),
            justLoggedOut: !!testContext?.justLoggedOut,
            activateEmailAddress: testContext?.activateEmailAddress || jest.fn(),
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
