import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import {
  UserStore, LoginView, LoginRoute, ProtectedRoute,
} from 'ai-kit-auth';
import { Dashboard } from './Dashboard';

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <BrowserRouter>
      <Switch>
        <LoginRoute exact path="/auth/login" component={LoginView} />
        <ProtectedRoute exact path="/" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  </UserStore>
);

export default App;
