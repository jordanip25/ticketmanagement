import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Usamos useHistory para la redirección
import styled from 'styled-components';
import Board from '../Board';
import Tickets from '../Tickets';
import Clientes from '../Clientesplus';
import UserManagement from '../UserManagement';

// Estilos para el Navbar
const Navbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #00aaff; /* Azul celeste */
  color: white;
  padding: 10px 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  height: 25px;
`;

// Estilos para el contenedor del menú
const MenuContainer = styled.div`
  width: 15%;
  flex: 0 0 250px;
  overflow-y: auto;
  background-color: #343a40;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  margin: 0; 
`;

const MenuItem = styled.div`
  display: flex; /* Para alinear ícono y texto */
  align-items: center; /* Centrar ícono verticalmente */
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? '#00aaff' : 'transparent')};
  color: ${(props) => (props.isActive ? 'white' : '#ddd')};
  &:hover {
    background-color: #00aaff; /* Color azul celeste */
    color: white;
  }
  transition: background-color 0.3s ease;

  svg {
    margin-right: 10px; /* Espaciado entre ícono y texto */
  }
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 90.5vh;
`;

const ContentContainer = styled.div`
   flex: 1;
  overflow-y: auto;
`;

const Dashboard = ({ username }) => {
  const [activeMenu, setActiveMenu] = useState('Board');
  const [userInfo, setUserInfo] = useState({ nombre: '', apellido: '', rol: '', telefono :''});
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
        setUserInfo({ nombre: data.nombre, apellido: data.apellido, rol: data.rol , telefono: data.telefono});
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
    <>
    {/* Navbar */}
    <Navbar>
    <div>
      Bienvenido {userInfo.nombre} {userInfo.apellido}
    </div>
    <button onClick={logout} style={{ backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>
      Cerrar Sesión
    </button>
  </Navbar>
    <DashboardContainer>
      <MenuContainer>
        <MenuItem isActive={activeMenu === 'Dashboard'} onClick={() => handleMenuClick('Dashboard')}>
          Dashboard
        </MenuItem>
        <MenuItem isActive={activeMenu === 'Tickets'} onClick={() => handleMenuClick('Tickets')}>
          Tickets
        </MenuItem>

        <MenuItem isActive={activeMenu === 'Clientes'} onClick={() => handleMenuClick('Clientes')}>
              Clientes IA
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
        {activeMenu === 'Tickets' && <Tickets  userPhone={userInfo.telefono} />}
        {activeMenu === 'Clientes' && <Clientes/>}
        {activeMenu === 'Usuarios' && <UserManagement /> }
        {activeMenu === 'Logout' && <div>Cerrar Sesión</div>}
      </ContentContainer>
    </DashboardContainer>
    </>
  );
};

export default Dashboard;
