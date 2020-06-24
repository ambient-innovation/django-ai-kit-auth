import * as React from 'react';
import { createMemoryHistory } from 'history';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { MockUserStore } from '../..';
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
      <MockUserStore {...testContext}>
        <Router history={history}>
          {element}
        </Router>
      </MockUserStore>,
    ),
  });
};
