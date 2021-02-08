import React, { FC, useContext } from 'react';
import {
  Redirect,
  Route,
  RouteProps,
} from 'react-router-dom';

import { AuthFunctionContext } from '../..';
import { FullConfig } from '../../config/Components';

export const makeLoginRoute = ({
  paths: { mainPage },
  routing: { useQueryParams },
}: FullConfig): FC<RouteProps> => ({
  children, ...routeProps
}) => {
  const { loggedIn } = useContext(AuthFunctionContext);
  const { next } = useQueryParams();

  if (loggedIn) return <Redirect to={next || mainPage} />;

  return (
    <Route {...routeProps}>
      {children}
    </Route>
  );
};
