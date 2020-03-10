import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import {
  UserStore, ProtectedRoute, makeAuthRoutes,
} from 'ai-kit-auth';

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <BrowserRouter>
      <Switch>
        {makeAuthRoutes()}
        <ProtectedRoute exact path="/">
          <div>
            Django Test App
          </div>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  </UserStore>
);

export default App;
