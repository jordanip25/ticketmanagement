import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        password: '',
        numero: '',
        created_at: '',
        rol: '',
        nombre: '',
        apellido: ''
    });

    // Fetch users from your API
    const fetchUsers = () => {
        axios.get('/https://sandy-puddle-hydrangea.glitch.me/allusers')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add or update a user
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.id) {
            axios.put(`/api/users/${formData.id}`, formData)
                .then(() => fetchUsers())
                .catch(error => console.error('Error updating user:', error));
        } else {
            axios.post('/api/users', formData)
                .then(() => fetchUsers())
                .catch(error => console.error('Error adding user:', error));
        }
        setFormData({ id: '', username: '', password: '', numero: '', created_at: '', rol: '', nombre: '', apellido: '' });
    };

    // Delete a user
    const deleteUser = (id) => {
        axios.delete(`/api/users/${id}`)
            .then(() => fetchUsers())
            .catch(error => console.error('Error deleting user:', error));
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Gestión de Usuarios</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required style={styles.input} />
                <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" required type="password" style={styles.input} />
                <input name="numero" value={formData.numero} onChange={handleChange} placeholder="Número" required style={styles.input} />
                <input name="rol" value={formData.rol} onChange={handleChange} placeholder="Rol" required style={styles.input} />
                <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required style={styles.input} />
                <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required style={styles.input} />
                <button type="submit" style={styles.button}>{formData.id ? "Actualizar" : "Agregar"}</button>
            </form>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Número</th>
                        <th>Rol</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.numero}</td>
                            <td>{user.rol}</td>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td>
                                <button onClick={() => setFormData(user)} style={styles.editButton}>Editar</button>
                                <button onClick={() => deleteUser(user.id)} style={styles.deleteButton}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    title: {
        textAlign: 'center',
        color: '#333'
    },
    form: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '20px'
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px'
    },
    button: {
        gridColumn: 'span 2',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
    },
    editButton: {
        padding: '5px 10px',
        borderRadius: '4px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        marginRight: '5px'
    },
    deleteButton: {
        padding: '5px 10px',
        borderRadius: '4px',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
    },
    tableRow: {
        borderBottom: '1px solid #ddd',
        height: '40px'
    }
};

export default UserManagement;
