import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import md5 from 'md5';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'text')};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:focus {
    border-color: ${(props) => (props.disabled ? '#ddd' : '#f95732')};
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`;

const ShowButton = styled.button`
  position: absolute;
  right: -15%;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  color: #666;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8em;
  font-size: 1em;
  background-color: ${(props) => (props.disabled ? '#aaa' : '#f95732')};
  color: #ffffff;
  border: none;
  border-radius: 25px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-top: 1em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${(props) => (props.disabled ? '#aaa' : '#e84620')};
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.6);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [pass, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Inicia la carga
    const password = md5(pass);
    try {
      const response = await axios.post('https://sandy-puddle-hydrangea.glitch.me/authentication', {
        username,
        password
      });

      if (response.status === 200) {
        onLoginSuccess(username);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

  return (
    <LoginContainer>
      <Card>
        <form onSubmit={handleLogin}>
          <IconContainer>
            👤
          </IconContainer>
          <Title>Bienvenido</Title>
          <Input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading} // Desactiva durante la carga
          />
          <PasswordContainer>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // Desactiva durante la carga
            />
            <ShowButton
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading} // Desactiva durante la carga
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </ShowButton>
          </PasswordContainer>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Sign in'}
          </Button>
          {error && <p>{error}</p>}
        </form>
      </Card>
    </LoginContainer>
  );
}

export default Login;
