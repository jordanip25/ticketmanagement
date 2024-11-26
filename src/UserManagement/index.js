import React, { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5';
//import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button  } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { Skeleton } from '@mui/material';
import "./modal.css";


const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userSelected, setUserSelected] = useState('');
    const [response, setResponse] = useState('');
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

    const [feedbacks, setFeedbacks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch users from your API
    const fetchUsers = () => {
        setLoading(true);
        axios.get('https://sandy-puddle-hydrangea.glitch.me/allusers')
            .then(response => {
                setUsers(response.data);
                setLoading(false);
                setUserSelected('');
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

    const handleConcatenateAndSend = async () => {
        if (!feedbacks || feedbacks.length === 0) {
            console.error('No hay datos para procesar.');
            return;
        }
    
        // Concatenar preguntas y respuestas
        const concatenatedQueries = feedbacks.map(feedback => {
            return `
            1. ¿Cómo calificarías la atención del técnico? 
               Respuesta: ${feedback.pregunta1 || "Sin respuesta"}
            2. ¿El problema fue resuelto de manera efectiva? 
               Respuesta: ${feedback.pregunta2 || "Sin respuesta"}
            3. ¿Estás satisfecho con el tiempo de respuesta? 
               Respuesta: ${feedback.pregunta3 || "Sin respuesta"}
            4. ¿Recomendarías nuestro servicio? 
               Respuesta: ${feedback.pregunta4 || "Sin respuesta"}
            5. Dame un pequeño feedback, por favor. 
               Respuesta: ${feedback.pregunta5 || "Sin respuesta"}
            `;
        }).join('\n');
    
        console.log('Concatenated Queries:', concatenatedQueries);
    
        // Enviar al backend
        try {
            const response = await fetch('https://sandy-puddle-hydrangea.glitch.me/resumefeedbacks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ concatenatedQueries })
            });
    
            if (!response.ok) {
                throw new Error('Error en el servidor al procesar la solicitud');
            }
    
            const data = await response.json();
            setResponse(data.response); // Mostrar la respuesta en el contenedor derecho
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    

    // Delete a user
    const deleteUser = (id) => {
        axios.delete(`https://sandy-puddle-hydrangea.glitch.me/api/users/${id}`)
            .then(() => fetchUsers())
            .catch(error => console.error('Error deleting user:', error));
    };

    const evaluateUser = (user) => {
        setUserSelected(user);
        axios.post('https://sandy-puddle-hydrangea.glitch.me/feedbacksbyuser', { user })
        .then(response => {
            // Mapeos para las respuestas
            const mappings = {
                pregunta1: {
                    "1": "Muy insatisfecho",
                    "2": "Insatisfecho",
                    "3": "Neutro",
                    "4": "Satisfecho",
                    "5": "Muy satisfecho",
                },
                pregunta2: {
                    "1": "Sí",
                    "2": "No",
                    "3": "Probablemente",
                },
                pregunta3: {
                    "1": "Muy insatisfecho",
                    "2": "Insatisfecho",
                    "3": "Neutro",
                    "4": "Satisfecho",
                    "5": "Muy satisfecho",
                },
                pregunta4: {
                    "1": "Sí",
                    "2": "No",
                },
            };

            // Transformar los datos
            const transformedData = response.data.map(feedback => ({
                ...feedback,
                pregunta1: mappings.pregunta1[feedback.pregunta1.charAt(0)] || feedback.pregunta1,
                pregunta2: mappings.pregunta2[feedback.pregunta2.charAt(0)] || feedback.pregunta2,
                pregunta3: mappings.pregunta3[feedback.pregunta3.charAt(0)] || feedback.pregunta3,
                pregunta4: mappings.pregunta4[feedback.pregunta4.charAt(0)] || feedback.pregunta4,
            }));

            setFeedbacks(transformedData);
            setIsModalOpen(true); // Abrir el modal
        })
        .catch(error => console.error('Error fetching feedbacks:', error));
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'username', headerName: 'Username', width: 80 },
        { field: 'telefono', headerName: 'Número', width: 150 },
        { field: 'rol', headerName: 'Rol', width: 80 },
        { field: 'nombre', headerName: 'Nombre', width: 120 },
        { field: 'apellido', headerName: 'Apellido', width: 120 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 230,
            renderCell: (params) => (
                <>
                    <button
                        onClick={() => evaluateUser(params.row.nombre + " "+params.row.apellido)}
                        style={styles.evaluateButton}
                    >
                        Evaluar
                    </button>
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
             {/* Modal para mostrar feedbacks */}
             <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DialogTitle>
                Feedbacks del Usuario: {userSelected}
                <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                    float: "right",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "18px",
                    }}
                >
                    &times;
                </button>
                </DialogTitle>
                <DialogContent>
                <div className="modal-content-container">
                    {/* Panel izquierdo: Tickets */}
                    <div className="left-panel">
                        {feedbacks.length > 0 ? (
                            <div className="ticket-container-horizontal">
                            {feedbacks.map((feedback) => (
                                <div key={feedback.id} className="ticket-card">
                                <h3>TICKET{feedback.ticketId.toString().padStart(4, "0")}</h3>
                                <p>
                                    <strong>¿Cómo calificarías la atención del técnico?</strong>
                                    <br />
                                    {feedback.pregunta1}
                                </p>
                                <p>
                                    <strong>¿El problema fue resuelto de manera efectiva?</strong>
                                    <br />
                                    {feedback.pregunta2}
                                </p>
                                <p>
                                    <strong>¿Estás satisfecho con el tiempo de respuesta?</strong>
                                    <br />
                                    {feedback.pregunta3}
                                </p>
                                <p>
                                    <strong>¿Recomendarías nuestro servicio?</strong>
                                    <br />
                                    {feedback.pregunta4}
                                </p>
                                <p>
                                    <strong>Dame un pequeño feedback, por favor</strong>
                                    <br />
                                    {feedback.pregunta5}
                                </p>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <p>No se encontraron feedbacks.</p>
                        )}
                        </div>

                    {/* Panel derecho */}
                    <div className="right-panel">
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: loading ? "#d1d5db" : "#3B82F6", 
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        disabled={loading}
                        onClick={() => handleConcatenateAndSend()}
                        >
                        Sugerencia IA
                        </button>
                        <div style={{backgroundColor: "#d1e7ff",  alignSelf: "flex-end"}} >
                        {response && (
        <div
            style={{
                overflowY: "auto", // Habilitar desplazamiento interno si es necesario
                maxHeight: "300px", // Limitar altura máxima para mantener diseño limpio
                width: "100%",
                whiteSpace: "pre-line",
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.6",
            }}
            dangerouslySetInnerHTML={{
                __html: response
                    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Reemplazar **texto** con <b>texto</b>
                    .replace(/<\/ul>\s*<ul>/g, ""), // Quitar <ul> duplicados consecutivos
            }}
        />
    )}
                        </div>
                    </div>
                </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};


const Dialog = ({ open, onClose, children }) => {
    if (!open) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">{children}</div>
      </div>
    );
  };
  
  const DialogTitle = ({ children }) => (
    <div className="modal-title">{children}</div>
  );
  
  const DialogContent = ({ children }) => (
    <div className="modal-body">{children}</div>
  );


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
        color: '#000',
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
    evaluateButton: {
        padding: '5px 10px',
        borderRadius: '4px',
        backgroundColor: '#5E63DC',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
         marginRight: '5px'
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
