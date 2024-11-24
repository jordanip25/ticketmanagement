import React, { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5';
import { DataGrid } from '@mui/x-data-grid';
import { Skeleton } from '@mui/material';

const SkeletonLoader = ({ rows = 5, cols = 6 }) => {
    return (
        <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <td key={colIndex} style={styles.skeletonCell}></td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        password: '',
        telefono: '',
        created_at: '',
        rol: 'User',
        nombre: '',
        apellido: ''
    });

    // Fetch users from your API
    const fetchUsers = () => {
        setLoading(true);
        axios.get('https://sandy-puddle-hydrangea.glitch.me/allusers')
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
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

        // Clone formData without the 'id' and encrypt the password for new users
        const dataToSend = { ...formData };
        if (!formData.id) {
            delete dataToSend.id;
            delete dataToSend.created_at;
            dataToSend.password = md5(formData.password).toString();
            axios.post('https://sandy-puddle-hydrangea.glitch.me/api/users', dataToSend)
                .then(() => fetchUsers())
                .catch(error => console.error('Error adding user:', error));
        } else {
            dataToSend.password = md5(formData.password).toString();
            axios.put(`https://sandy-puddle-hydrangea.glitch.me/api/users/${formData.id}`, dataToSend)
                .then(() => fetchUsers())
                .catch(error => console.error('Error updating user:', error));
        }
        setFormData({ id: '', username: '', password: '', telefono: '', created_at: '', rol: '', nombre: '', apellido: '' });
    };

    // Delete a user
    const deleteUser = (id) => {
        axios.delete(`https://sandy-puddle-hydrangea.glitch.me/api/users/${id}`)
            .then(() => fetchUsers())
            .catch(error => console.error('Error deleting user:', error));
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 60 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'telefono', headerName: 'Número', width: 150 },
        { field: 'rol', headerName: 'Rol', width: 80 },
        { field: 'nombre', headerName: 'Nombre', width: 150 },
        { field: 'apellido', headerName: 'Apellido', width: 150 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 150,
            renderCell: (params) => (
                <>
                    <button
                        onClick={() => setFormData(params.row)}
                        style={styles.editButton}
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => deleteUser(params.row.id)}
                        style={styles.deleteButton}
                    >
                        Eliminar
                    </button>
                </>
            ),
        },
    ];

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Gestión de Usuarios</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required style={styles.input} />
                <input name="password" value={formData.password} onFocus={() => setFormData({ ...formData, password: '' })} onChange={handleChange} placeholder="Password" required type="password" style={styles.input} />
                <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Número" required style={styles.input} />
                <select name="rol" value={formData.rol} onChange={handleChange} required style={styles.input}>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>
                <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required style={styles.input} />
                <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required style={styles.input} />
                <button type="submit" style={styles.button}>{formData.id ? "Actualizar" : "Agregar"}</button>
            </form>

            <div style={{ height: 400, width: '100%' }}>
                {loading ? (
                    <div>
                        {[...Array(5)].map((_, index) => (
                            <Skeleton key={index} variant="rectangular" height={40} style={{ marginBottom: 8 }} />
                        ))}
                    </div>
                ) : (
                    <DataGrid
                        rows={users}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        style={styles.table}
                    />
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
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
    },
    skeletonCell: {
        background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        height: '20px',
        borderRadius: '4px',
    },
    '@keyframes shimmer': {
        from: {
            backgroundPosition: '100% 0',
        },
        to: {
            backgroundPosition: '-100% 0',
        },
    },
};

export default UserManagement;
