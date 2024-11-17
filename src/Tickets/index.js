import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import './TicketFilterComponent.css'; // Archivo CSS para los estilos
import TicketModal from '../TicketModal'; 

const TicketFilterComponent = ({userPhone} ) => {
  const [filters, setFilters] = useState({
    codigoTitulo: '',
    fechaInicio: '',
    fechaFin: '',
    estado: '',
  });

  const [ticketsData, setTicketsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);


  const openModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicketId(null);
  };

  // Función para obtener los tickets con los filtros aplicados
  const fetchTickets = async (appliedFilters = {}) => {
    try {
      // Construimos los parámetros de consulta con los filtros aplicados
      const params = new URLSearchParams();

      if (appliedFilters.codigoTitulo) {
        params.append('codigoTitulo', appliedFilters.codigoTitulo.replace("TICKET000",""));
      }
      if (appliedFilters.fechaInicio) {
        params.append('fechaInicio', appliedFilters.fechaInicio);
      }
      if (appliedFilters.fechaFin) {
        params.append('fechaFin', appliedFilters.fechaFin);
      }
      if (appliedFilters.estado) {
        params.append('estado', appliedFilters.estado);
      }

      const response = await fetch(`https://sandy-puddle-hydrangea.glitch.me/tickets?${params.toString()}`);
      const data = await response.json();

      // Formatear los datos recibidos
      const formattedData = data.map(ticket => ({
        codigo: `TICKET000${ticket.id}`,
        titulo: ticket.titulo || 'No descripcion',
        solicitante: `${ticket.nombre} ${ticket.apellido}`,
        asignadoA: ticket.asignado || 'No asignado',
        fechaCreacion: new Date(ticket.fecha).toLocaleDateString('es-ES'),
        estado: ticket.estado,
      }));

      setTicketsData(formattedData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Llamamos a fetchTickets al cargar el componente sin filtros
  useEffect(() => {
    fetchTickets();
    console.log(userPhone);
    console.log("----");
  }, []);

  // Actualizar el estado de los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Aplicar filtros y llamar al backend con los filtros
  const applyFilters = () => {
    fetchTickets(filters);
  };



  return (
    <div className="ticket-filter-component">
      <div className="filters">
        <input
          type="text"
          name="codigoTitulo"
          placeholder="Código / Título"
          value={filters.codigoTitulo}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <div className="date-filter">
          <FaCalendarAlt className="icon" />
          <input
            type="date"
            name="fechaInicio"
            value={filters.fechaInicio}
            onChange={handleFilterChange}
          />
        </div>
        <div className="date-filter">
          <FaCalendarAlt className="icon" />
          <input
            type="date"
            name="fechaFin"
            value={filters.fechaFin}
            onChange={handleFilterChange}
          />
        </div>
        <select
          name="estado"
          value={filters.estado}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        <button onClick={applyFilters} className="filter-button">
          <FaSearch />
        </button>
        <button className="export-button">
          <FaFileExcel /> Exportar
        </button>
      </div>

      <table className="tickets-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>Solicitante</th>
            <th>Asignado A</th>
            <th>Fecha Creación</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {ticketsData.map((ticket, index) => (
            <tr key={index}>
              <td>
                <span
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => openModal(ticket.codigo.replace("TICKET000",""))} // Al hacer clic en el código, abre el modal
                >
                  {ticket.codigo}
                </span>
              </td>
              <td>{ticket.titulo}</td>
              <td>{ticket.solicitante}</td>
              <td>{ticket.asignadoA}</td>
              <td>{ticket.fechaCreacion}</td>
              <td><span className={`status-badge ${ticket.estado.toLowerCase().trim()}`}>{ticket.estado}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal de detalles del ticket */}
      {selectedTicketId && (
        <TicketModal
          ticketId={selectedTicketId}
          isOpen={isModalOpen}
          closeModal={closeModal}
          userPhone={userPhone}
        />
      )}
    </div>
  );
};

export default TicketFilterComponent;
