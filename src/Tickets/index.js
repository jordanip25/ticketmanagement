import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import './TicketFilterComponent.css'; // Archivo CSS para los estilos

const ticketsData = [
  {
    codigo: "AJUT-2024-95103",
    titulo: "ALERTA DE ESPACIO EN DISCO - SVBWSTSAPP01",
    subtipo: "NINSURG",
    solicitante: "TACUCHE MELENDEZ CARLOS ALFREDO",
    asignadoA: "VILLAFLORES CASAS DAVID ALLAN",
    fechaCreacion: "29/10/2024",
    estado: "Asignado",
  },
  // Agrega más tickets si es necesario
];

const TicketFilterComponent = () => {
  const [filters, setFilters] = useState({
    codigoTitulo: '',
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    tipo: '',
  });

  const [filteredTickets, setFilteredTickets] = useState(ticketsData);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    let filtered = ticketsData;

    if (filters.codigoTitulo) {
      filtered = filtered.filter(ticket =>
        ticket.codigo.toLowerCase().includes(filters.codigoTitulo.toLowerCase()) ||
        ticket.titulo.toLowerCase().includes(filters.codigoTitulo.toLowerCase())
      );
    }

    if (filters.fechaInicio) {
      filtered = filtered.filter(ticket =>
        new Date(ticket.fechaCreacion) >= new Date(filters.fechaInicio)
      );
    }

    if (filters.fechaFin) {
      filtered = filtered.filter(ticket =>
        new Date(ticket.fechaCreacion) <= new Date(filters.fechaFin)
      );
    }

    if (filters.estado) {
      filtered = filtered.filter(ticket =>
        ticket.estado.toLowerCase().includes(filters.estado.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
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
          <option value="Creado">Creado</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Asignado">Asignado</option>
          <option value="Esperando">Esperando</option>
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
            <th>Subtipo</th>
            <th>Solicitante</th>
            <th>Asignado A</th>
            <th>Fecha Creación</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket, index) => (
            <tr key={index}>
              <td>{ticket.codigo}</td>
              <td>{ticket.titulo}</td>
              <td>{ticket.subtipo}</td>
              <td>{ticket.solicitante}</td>
              <td>{ticket.asignadoA}</td>
              <td>{ticket.fechaCreacion}</td>
              <td><span className={`status-badge ${ticket.estado.toLowerCase()}`}>{ticket.estado}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketFilterComponent;
