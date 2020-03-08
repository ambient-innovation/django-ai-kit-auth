import * as React from 'react';
import { createMemoryHistory } from 'history';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { UserContext } from '../..';
import { User } from '../../api/types';

export const renderWithRouterAndUser = (
  element: JSX.Element, user?: User, loading?: boolean,
) => {
  const history = createMemoryHistory({ initialEntries: ['/auth/login'] });

  return ({
    history,
    ...render(
      <UserContext.Provider value={{
        user,
        loading: !!loading,
        login: jest.fn(),
        logout: jest.fn(),
        loggedOut: false,
      }}
      >
        <Router history={history}>
          {element}
        </Router>
      </UserContext.Provider>,
    ),
  });
};
