import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Auth/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth_session') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('auth_session', 'true');
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard />;
}

export default App;
