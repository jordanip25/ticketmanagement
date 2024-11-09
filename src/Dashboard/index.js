import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Usamos useHistory para la redirección
import styled from 'styled-components';
import Board from '../Board';
import Tickets from '../Tickets';
import Clientes from '../Clientesplus';

const MenuContainer = styled.div`
  width: 200px;
  background-color: #a4a4a4;
  padding: 10px;
  border-right: 1px solid #ddd;
  height: 35em;
`;

const MenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? '#e0e0e0' : 'transparent')};
  &:hover {
    background-color: #d0d0d0;
  }
`;

const DashboardContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 10px;
`;

const Dashboard = ({ username }) => {
  const [activeMenu, setActiveMenu] = useState('Board');
  const [userInfo, setUserInfo] = useState({ nombre: '', apellido: '', rol: '' });
  const navigate = useNavigate(); // Hook para redirigir

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  useEffect(() => {
    // Llama al webhook para obtener el nombre y apellido del usuario
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('https://sandy-puddle-hydrangea.glitch.me/userinfo/' + username);
        const data = await response.json();
        
        // Supone que el webhook devuelve un objeto con los campos "nombre", "apellido" y "rol"
        setUserInfo({ nombre: data.nombre, apellido: data.apellido, rol: data.rol });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [username]);

  const logout = () => {
    console.log("cerrando sesion");
    // Limpiar la información de sesión, como el token de autenticación
    localStorage.removeItem('authToken'); // Ejemplo de limpieza del token de autenticación
    navigate('/'); // Redirige a la página de Login
  };

  return (
    <DashboardContainer>
      <MenuContainer>
        <MenuItem>
          Bienvenido {userInfo.nombre} {userInfo.apellido}
        </MenuItem>
        <MenuItem isActive={activeMenu === 'Dashboard'} onClick={() => handleMenuClick('Dashboard')}>
          Dashboard
        </MenuItem>
        <MenuItem isActive={activeMenu === 'Tickets'} onClick={() => handleMenuClick('Tickets')}>
          Tickets
        </MenuItem>
        {userInfo.rol === 'admin' && (
          <>
            <MenuItem isActive={activeMenu === 'Clientes'} onClick={() => handleMenuClick('Clientes')}>
              Clientes+
            </MenuItem>
            <MenuItem isActive={activeMenu === 'Usuarios'} onClick={() => handleMenuClick('Usuarios')}>
              Usuarios
            </MenuItem>
          </>
        )}
        <MenuItem isActive={activeMenu === 'Logout'} onClick={logout}>
          Cerrar Sesión
        </MenuItem>
      </MenuContainer>
      <ContentContainer>
        {activeMenu === 'Dashboard' && <Board />}
        {activeMenu === 'Tickets' && <Tickets />}
        {activeMenu === 'Clientes' && <Clientes/>}
        {activeMenu === 'Usuarios' && <div>Contenido de Usuarios</div>}
        {activeMenu === 'Logout' && <div>Cerrar Sesión</div>}
      </ContentContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
