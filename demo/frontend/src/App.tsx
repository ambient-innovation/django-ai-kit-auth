import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { DefaultTheme as AiKitTheme } from 'ai-kit-common';
import {
  UserStore, ProtectedRoute, makeAuthRoutes,
} from './configuredAuth';
import { Dashboard } from './Dashboard';

const App: React.FC = () => (
  <>
    <CssBaseline />
    <ThemeProvider theme={AiKitTheme}>
      <UserStore
        apiUrl="http://localhost:8000/api/v1/"
        apiAuthPath="auth/"
      >
        <BrowserRouter>
          <Switch>
            {
                // generate routes for essential authentication views
                // like login, registration, password reset etc.
                makeAuthRoutes()
              }
            <ProtectedRoute exact path="/" component={Dashboard} />
            <ProtectedRoute path="/">
              <Dashboard title="Fallback Dashboard" />
            </ProtectedRoute>
          </Switch>
        </BrowserRouter>
      </UserStore>
    </ThemeProvider>
  </>
);

export default App;
