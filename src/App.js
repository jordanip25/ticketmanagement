import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';

const StyledApp = styled.main`
  flex-wrap: wrap;
  justify-content: space-around;

  & > div:not(:last-child) {
    margin-bottom: 1em;
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    navigate('/'); // Redirige al login después del logout
  };

  console.log("Estado de isLoggedIn:", isLoggedIn);

  return (
    <StyledApp>
    <Routes>
      <Route
        path="/"
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      />
      <Route
        path="/dashboard"
        element={<Dashboard username={username} onLogout={handleLogout} />}
      />
    </Routes>
  </StyledApp>
  );
}

export default App;
