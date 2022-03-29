import React, { FC, useContext } from 'react';
import {
  Route,
  RouteProps,
} from 'react-router-dom';
import { FullConfig } from '../../config/components';
import { AuthFunctionContext } from '../../store/UserStore';

export type MakeLoginRouteResult = FC<RouteProps>;

export function makeLoginRoute({
  paths: { mainPage },
  routing: { useQueryParams, useRouteHandler },
}: FullConfig): MakeLoginRouteResult {
  return ({
    children, ...routeProps
  }) => {
    const { loggedIn } = useContext(AuthFunctionContext);
    const { next } = useQueryParams();
    const { replace } = useRouteHandler();

    if (loggedIn) {
      replace(next || mainPage);

      return <Route {...routeProps} />;
    }

    return (
      <Route {...routeProps}>
        {children}
      </Route>
    );
  };
}
