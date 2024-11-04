import React, { useState } from 'react';
import styled from 'styled-components';
//import Board from './Board';
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    console.log("Usuario autenticado: isLoggedIn = true");
  };

  console.log("Estado de isLoggedIn:", isLoggedIn);

  return (
    <StyledApp>
      {isLoggedIn ? <Dashboard /> : <Login onLoginSuccess={handleLoginSuccess} />}
    </StyledApp>
  );
}


export default App;
