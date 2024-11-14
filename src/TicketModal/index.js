import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Asocia el modal al elemento raíz de tu aplicación

const TicketModal = ({ ticketId, isOpen, closeModal }) => {
  const [ticketData, setTicketData] = useState(null);

  // Función para cargar los datos del ticket
  useEffect(() => {
    if (isOpen && ticketId) {
      const fetchTicketData = async () => {
        try {
          const response = await fetch(`https://sandy-puddle-hydrangea.glitch.me/tickets/${ticketId}`); // Llama al endpoint con el ID del ticket
          const data = await response.json();
          setTicketData(data);
        } catch (error) {
          console.error("Error al cargar el ticket:", error);
        }
      };
      fetchTicketData();
    }
  }, [ticketId, isOpen]); // Re-ejecuta cuando el ticketId o isOpen cambian

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
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <h2>Información del Ticket</h2>
      {ticketData ? (
        <div>
          <p><strong>ID:</strong> {ticketData.id}</p>
          <p><strong>Solicitado por:</strong> {ticketData.solicitado_por}</p>
          <p><strong>Asignado a:</strong> {ticketData.asignado_a}</p>
          <p><strong>Fecha de Creación:</strong> {ticketData.fecha_creacion}</p>
          <p><strong>Descripción:</strong> {ticketData.descripcion}</p>
        </div>
      ) : (
        <p>Cargando datos del ticket...</p>
      )}
      <button onClick={closeModal}>Cerrar</button>
    </Modal>
  );
};

export default TicketModal;
