import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Usamos useHistory para la redirección
import styled from 'styled-components';
import Board from '../Board';
import Tickets from '../Tickets';
import Clientes from '../Clientesplus';
import UserManagement from '../UserManagement';

const MenuContainer = styled.div`
  width: 15%;
  background-color: #a4a4a4;
  padding: 10px;
  border-right: 1px solid #ddd;
  height: 100%; /* Asegura que el menú ocupe toda la altura del contenedor */
  box-sizing: border-box; /* Incluye el padding en el cálculo de la altura */
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
  height: 100vh; 
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
      setActiveMenu('Dashboard');
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

        <MenuItem isActive={activeMenu === 'Clientes'} onClick={() => handleMenuClick('Clientes')}>
              Clientes+
        </MenuItem>

        {userInfo.rol.toLowerCase() === 'admin' && (
          <>
            
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
        {activeMenu === 'Usuarios' && <UserManagement/> }
        {activeMenu === 'Logout' && <div>Cerrar Sesión</div>}
      </ContentContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
