import React from 'react';
import { UserStore, LoginView } from 'ai-kit-auth';
import './App.scss';

const App: React.FC = () => (
  <UserStore
    apiUrl="http://localhost:8000/api/v1/"
  >
    <div className="App">
    AI-KIT AUTH Demo Project
      <LoginView />
    </div>
  </UserStore>
);

export default App;
