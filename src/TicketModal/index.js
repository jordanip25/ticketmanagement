import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaWhatsapp } from 'react-icons/fa';
import "./estilos.css";
import "./skeleton.css";

Modal.setAppElement('#root');

const TicketModal = ({ ticketId, isOpen, closeModal, userPhone  }) => {
  const [ticketData, setTicketData] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [descripcionOriginal, setDescripcionOriginal] = useState(descripcion);
  const [tipo, setTipo] = useState("");
  const [fechaFin, setfechaFin] = useState("");
  const [asignado, setAsignado] = useState("");
  const [estado, setEstado] = useState("");
  const [users, setUsers] = useState([]);
  const [author, setAuthor] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState(""); // Estado para el nuevo comentario
  const [recomendacion, setRecomendacion] = useState(""); // Estado para la recomendación
  const [comments, setComments] = useState([]); // Estado para los comentarios

  const handleDescripcionChange = (e) => {
    const newDescripcion = e.target.value;
    setDescripcion(newDescripcion);
    updateTicket("consulta", newDescripcion);
  };

  const handleGuardar = () => {
    // Aquí guardas la descripción y puedes añadir más lógica si es necesario
    setDescripcionOriginal(descripcion);
  };

  const handleCancelar = () => {
    // Revertir el cambio de descripción
    setDescripcion(descripcionOriginal);
    updateTicket("consulta", descripcionOriginal); 
  };

  const handleTipoChange = (e) => {
    const newTipo = e.target.value;
    setTipo(newTipo);
    updateTicket("tipo", newTipo); // Actualiza el campo "tipo" en la base de datos
  };
  
  const handleAsignadoChange = (e) => {
    const newAsignado = e.target.value;
    setAsignado(newAsignado);
    updateTicket("asignado", newAsignado); // Actualiza el campo "asignado" en la base de datos
  };

  const handleNuevoComentarioChange = (e) => {
    setNuevoComentario(e.target.value);
  };

  const handleEstadoChange = (e) => {
    const newEstado = e.target.value;
    setEstado(newEstado);
    updateTicket("estado", newEstado);
  };

  const updateTicket = async (field, value) => {

    try {

        if (field === "estado" && (value === "Finalizado" || value === "Cancelado")) {
            updateTicket("fechaFin", new Date().toISOString());
            setfechaFin(new Date().toISOString());
        }
          
      const response = await fetch(`https://sandy-puddle-hydrangea.glitch.me/tickets/${ticketId}`, {
        method: "PATCH", // Cambia a PUT si tu backend lo requiere
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, value }),
      });
  
      if (!response.ok) {
        throw new Error(`Error al actualizar el campo ${field}`);
      }
  
      const updatedData = await response.json();
      console.log(`Campo ${field} actualizado exitosamente`, updatedData);
    } catch (error) {
      console.error(`Error al actualizar el campo ${field}:`, error);
    }
  };
  

  const generarRecomendacion = async () => {
    try {
        // Realiza la solicitud al endpoint
        const response = await fetch('https://sandy-puddle-hydrangea.glitch.me/suggest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ descripcion }),
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener la recomendación');
        }
  
        const data = await response.json();
        setRecomendacion(data.response); // Establece la recomendación recibida
      } catch (error) {
        console.error('Error al generar recomendación:', error);
        setRecomendacion('Hubo un error al generar la recomendación.');
      }
  };

  // Obtener comentarios del backend
  const fetchComments = async () => {
    try {
      const response = await fetch(`https://sandy-puddle-hydrangea.glitch.me/tickets/${ticketId}/allcomments`);
      const data = await response.json();
      console.log(data);
      console.log("Comentarios");
      setComments(data);
    } catch (error) {
      console.error("Error al cargar los comentarios:", error);
    }
  };

  const addComment = async () => {
    if (!nuevoComentario.trim()) {
      alert("El comentario no puede estar vacío.");
      return;
    }
    try {
      const response = await fetch(`https://sandy-puddle-hydrangea.glitch.me/tickets/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ticketId: ticketId, autor: author.nombre+" "+author.apellido, comentario: nuevoComentario }),
      });
      if (response.ok) {
        setNuevoComentario("");
        fetchComments(); 
      } else {
        console.error("Error al agregar el comentario");
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };

  useEffect(() => {
    if (isOpen && ticketId) {
      const fetchTicketData = async () => {
        try {
          const response = await fetch(`https://sandy-puddle-hydrangea.glitch.me/tickets/${ticketId}`);
          const data = await response.json();
          setTicketData(data);
          setDescripcion(data.consulta);
          setTipo(data.tipo || "Sin especificar");
          setAsignado(data.asignado || "Sin Asignar");
          setEstado(data.estado || "Pendiente");
          setfechaFin(data.fechaFin || "Sin Finalizar");
        } catch (error) {
          console.error("Error al cargar el ticket:", error);
        }
      };
      fetchTicketData();
      fetchComments();
    }
  }, [ticketId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`https://sandy-puddle-hydrangea.glitch.me/allusers`);
          const data = await response.json();
          setUsers(data);
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
  

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
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
          width: '80%',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        },
      }}
    >
      <button
        onClick={closeModal}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#333',
        }}
      >
        &times;
      </button>

      {ticketData ? (
        <div style={{ lineHeight: '1.6', display: 'flex', gap: '20px' }}>
          <div style={{ flex: '2', overflowY: 'auto', maxHeight: '500px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p><strong>TICKET000{ticketData.id}</strong></p>
                <div style={{ display: 'flex', justifyContent: 'left' }}>
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
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                <p><strong>Estado: </strong></p>
                <select className={`status-badge ${estado.toLowerCase().trim()}`}
                    value={estado}
                    onChange={handleEstadoChange}
                    style={{
                        fontWeight: 'bold',
                        borderRadius: '5px',
                        padding: '2px 8px',
                        height: '50%',
                    alignSelf: 'center',
                        alignItems: 'center'
                    }}
                    disabled={estado === "Finalizado" || estado === "Cancelado"}
                    >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Cancelado">Cancelado</option>
                    </select>
                </div>  
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p><strong>Fecha Inicio:</strong> {formatDate(ticketData.fecha)}</p>
                <p><strong>Fecha Fin:</strong> {formatDate(fechaFin).replace("NaN-NaN-NaN","Pendiente")}</p>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                {ticketData ? ticketData.titulo : 'Título del Ticket'}
            </h2>
            <p><strong>Solicitado por:</strong> {ticketData.nombre.charAt(0).toUpperCase() + ticketData.nombre.slice(1).toLowerCase()} {ticketData.apellido.charAt(0).toUpperCase() + ticketData.apellido.slice(1).toLowerCase()}
                <button
                style={{
                    backgroundColor: '#25D366',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    marginLeft: '10px',
                }}
                onClick={() => window.open(`https://wa.me/${ticketData.telefono}`, '_blank')}
                >
                <FaWhatsapp size={20} />
                </button>
            </p>
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
            <p><strong>Descripción:</strong></p>
            <div style={{ position: 'relative', width: '100%' }}>
            <textarea
                value={descripcion}
                onChange={handleDescripcionChange}
                rows="4"
                cols="50"
                style={{
                width: '97%',
                padding: '8px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                transition: 'border-color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = '#888')}
                onMouseLeave={(e) => (e.target.style.borderColor = '#ddd')}
            />
            <div style={{ position: 'absolute', bottom: '-0px', right: '0', display: 'flex', gap: '10px' }}>
            <button
                onClick={handleGuardar}
                style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    opacity: 0.5,
                    transition: 'opacity 0.3s, background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.5)}
                >
          Guardar
        </button>
        <button
          onClick={handleCancelar}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            opacity: 0.5,
            transition: 'opacity 0.3s, background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.5)}
        >
          Cancelar
        </button>
        </div>
            </div>
            <ul style={{ padding: 0 }}>
                {comments.map((comment) => (
                <li key={comment.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <p>{comment.comentario}</p>
                    <small style={{ color: "#555" }}>Publicado por {comment.autor} el {formatDate(comment.fecha)}</small>
                </li>
                ))}
            </ul>
            <p><strong>Nuevo Comentario:</strong></p>
            <textarea
                value={nuevoComentario}
                onChange={handleNuevoComentarioChange}
                rows="3"
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
            <button
                onClick={addComment}
                style={{
                backgroundColor: '#1a73e8',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                }}
            >
                Agregar Comentario
            </button>
            </div>


            <div style={{ flex: '1', borderLeft: '1px solid #ddd', paddingLeft: '15px' }}>
            <button
              onClick={generarRecomendacion}
              style={{
                backgroundColor: '#1a73e8',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '80%',
                marginBottom: '20px',
              }}
            >
              Generar recomendación
            </button>
            <div style={{ flex: '1', borderLeft: '1px solid #ddd', overflowY: 'auto',maxHeight: '500px', paddingLeft: '15px' }}>
            
            <p  style={{ whiteSpace: 'pre-line', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' , fontSize: '14px', color: '#333', whiteSpace: 'pre-line' }}>
              {recomendacion}
            </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ lineHeight: '1.6', display: 'flex', gap: '20px' }}>
          <div style={{ flex: '2', maxHeight: '500px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="skeleton-container">
                <div className="skeleton-title"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-row"></div>
                <div className="skeleton-text"></div>
                </div>
        </div>
        </div>
        </div>
      )}
    </Modal>
  );
};

export default TicketModal;
