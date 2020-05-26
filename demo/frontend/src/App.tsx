import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import {
  UserStore, ProtectedRoute, configureAuth,
} from 'ai-kit-auth';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { DefaultTheme as AiKitTheme } from 'ai-kit-common';
import { Dashboard } from './Dashboard';

const App: React.FC = () => {
  const Auth = configureAuth({
    backgroundImage: 'url(https://www.placecage.com/800/1450)',
  });

  return (
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
                Auth.makeAuthRoutes()
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
}

export default App;
