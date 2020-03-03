import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import {
  UserStore, LoginView, LoginRoute, ProtectedRoute,
} from 'ai-kit-auth';

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <BrowserRouter>
      <Switch>
        <LoginRoute exact path="/login" component={LoginView} />
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
