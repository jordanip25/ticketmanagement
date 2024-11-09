import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import md5 from 'md5';
import { useNavigate } from 'react-router-dom';
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #a9d1d2; /* Fondo general */
`;

const Card = styled.div`
  background-color: #1f3d57; /* Color de fondo de la tarjeta */
  width: 300px;
  padding: 2em;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1em;
`;

const Title = styled.h2`
  color: #ffffff;
  margin: 0.5em 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8em 1em;
  margin: 0.5em 0;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 25px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #f95732;
  }
`;

const PasswordContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  margin: 0.5em 0;
`;

const ForgotPassword = styled.a`
  font-size: 0.8em;
  color: #ffffff;
  text-decoration: none;
  opacity: 0.8;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8em;
  font-size: 1em;
  background-color: #f95732; /* Color del botón */
  color: #ffffff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 1em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: #e84620;
  }
`;

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [pass, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Usando useNavigate en lugar de useHistory
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const password = md5(pass);
    try {
      const response = await axios.post('https://sandy-puddle-hydrangea.glitch.me/authentication', {
        username,
        password
      });

      if (response.status === 200) {
        onLoginSuccess(username); // Ejecución de la función en caso de éxito
        navigate('/dashboard'); // Redirigir al dashboard tras login exitoso
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError('Error de conexión con el servidor');
      }
    }
  };

  return (
    <LoginContainer>
      <Card>
      <form onSubmit={handleLogin}>
      <IconContainer>
          {/* Aquí podrías agregar un ícono si tienes uno */}
          👤
        </IconContainer>
        <Title>Bienvenido</Title>
        <Input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordContainer>
        <Input
          type="password"
          value={pass}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        </PasswordContainer>
        <Button type="submit">Sign in</Button>
        {error && <p>{error}</p>}
      </form>
      </Card>
    </LoginContainer>
  );
}

export default Login;
