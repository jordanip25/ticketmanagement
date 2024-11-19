import React, { useState, useEffect } from 'react';
import './CreateTicketModal.css';
import './skeleton.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');
const CreateTicketModal = ({ isOpen, onClose , userPhone}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipo, setTipo] = useState('');
  const [author, setAuthor] = useState([]);
  const [asignado, setAsignado] = useState('');
  const [descripcion, setDescripcion] = useState("");
  const [users, setUsers] = useState([]);


  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };
  const handleTipoChange = (e) => {
    console.log(e.target.value);
    setTipo(e.target.value);
  };

  const handleAsignadoChange = (e) => {
    setAsignado(e.target.value);
  };


  const handleCreate = async () => {
    if (isSubmitting) return; // Evita múltiples clics

    setIsSubmitting(true);

    try {
        const payload = {
            nombre: author.nombre, 
            apellido: author.apellido, 
            tipo: tipo, 
            consulta: descripcion, 
            telefono: userPhone, 
            asignado: asignado === "Sin Asignar" ? null : asignado,
        };

        const response = await fetch('https://sandy-puddle-hydrangea.glitch.me/tickets/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Error al crear el ticket.');
        }

        const result = await response.json();
        console.log('Ticket creado:', result);
        onClose(); // Cierra el modal
    } catch (error) {
        console.error('Error al crear el ticket:', error);
    } finally {
        setIsSubmitting(false); // Habilita el botón
    }
};

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`https://sandy-puddle-hydrangea.glitch.me/allusers`);
          const data = await response.json();
          setUsers(data);
          setTipo("Incidencia");
        } catch (error) {
          console.error("Error al cargar los usuarios:", error);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  // Obtener los usuarios con el teléfono específico cuando se abre el modal
  useEffect(() => {
    if (isOpen && userPhone) {
      console.log("Cargando usuario con teléfono:", userPhone);
      const fetchUsers = async () => {
        try {
          const response = await fetch(`https://sandy-puddle-hydrangea.glitch.me/users/telefono/${userPhone}`);
          const data = await response.json();
          console.log("Usuario cargado:", data);
          setAuthor(data[0]); // Guardar usuarios obtenidos por teléfono
        } catch (error) {
          console.error("Error al cargar los usuarios:", error);
        }
      };
      fetchUsers();
    }
  }, [isOpen, userPhone]);

  return isOpen ? (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Información del Ticket"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '20%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          width: '50%',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        },
      }}
    >
        <h2>Crear Ticket</h2>
        <div>
        <p><strong>Titulo:</strong></p>
        <input type="text" style={{ width: "50%", padding: "9px 10px", border: "1px solid #ccc", fontWeight: "bold"}} ></input>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <p><strong>Tipo: </strong></p>
                <select
                    value={tipo}
                    onChange={handleTipoChange}
                    style={{
                    color: '#141dc4',
                    fontWeight: 'bold',
                    height: '50%',
                    alignSelf: 'center',
                    border: '2px solid #141dc4',
                    borderRadius: '5px',
                    padding: '2px 8px',
                    }}
                >
                    <option value="Incidencia">Incidencia</option>
                    <option value="Requerimiento">Requerimiento</option>
                </select>
                </div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <p><strong>Asignado a: </strong></p>
                <select
                value={asignado}
                onChange={handleAsignadoChange}
                style={{
                    color: '#141dc4',
                    fontWeight: 'bold',
                    border: '1px solid #141dc4',
                    borderRadius: '5px',
                    padding: '2px 8px',
                }}
                >
                <option value="Sin Asignar">Sin Asignar</option>
                {users.map((user) => (
                    <option key={user.id} value={`${user.nombre} ${user.apellido}`}>
                    {`${user.nombre} ${user.apellido}`}
                    </option>
                ))}
                </select>
            </div>
        </div>
        <p><strong>Descripción:</strong></p>
            <textarea
                value={descripcion}
                onChange={handleDescripcionChange}
                rows="4"
                cols="50"
                style={{
                width: '95%',
                padding: '8px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                transition: 'border-color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = '#888')}
  onMouseLeave={(e) => (e.target.style.borderColor = '#ddd')}
            />
        <div className="modal-actions">
        <button onClick={handleCreate} disabled={isSubmitting} style={{ position: 'relative', minWidth: '100px', minHeight: '40px' }}>
            {isSubmitting ? (
                <div className="skeleton"></div>
            ) : (
                'Guardar'
            )}
        </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
        </Modal>
  ) : null;
};

export default CreateTicketModal;
