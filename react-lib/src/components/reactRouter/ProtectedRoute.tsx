import React, { FC, useContext } from 'react';
import {
  Redirect, Route, RouteProps, useLocation,
} from 'react-router-dom';
import { FullConfig } from '../../config/components';
import { AuthFunctionContext } from '../../store/UserStore';

export type MakeProtectedRouteResult = FC<RouteProps>;

export function makeProtectedRoute({
  paths: { mainPage, login },
  components: { loadingIndicator },
}: FullConfig): MakeProtectedRouteResult {
  return ({
    component,
    render,
    children,
    ...routeProps
  }) => {
    const { loggedIn, loading } = useContext(AuthFunctionContext);
    const location = useLocation();
    const pathname = location.pathname || mainPage;

    if (loading) return <Route {...routeProps} component={loadingIndicator} />;
    if (!loggedIn) {
      return (
        <Route {...routeProps}>
          <Redirect to={`${login}?next=${pathname}`} />
        </Route>
      );
    }

    return (
      <Route
        {...routeProps}
        component={component}
        render={render}
      >
        {children}
      </Route>
    );
  };
}
