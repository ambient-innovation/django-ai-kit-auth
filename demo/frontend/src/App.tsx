import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import {
  UserStore, ProtectedRoute, makeAuthRoutes,
} from 'ai-kit-auth';
import { Dashboard } from './Dashboard';

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <BrowserRouter>
      <Switch>
        {makeAuthRoutes()}
        <ProtectedRoute exact path="/" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  </UserStore>
);

export default App;
