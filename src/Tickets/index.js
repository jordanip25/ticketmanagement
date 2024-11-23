import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCalendarAlt, FaDownload, FaPlus, FaFileExcel , FaRegFile } from 'react-icons/fa';
import './TicketFilterComponent.css'; // Archivo CSS para los estilos
import TicketModal from '../TicketModal'; 
import CreateTicketModal from '../CreateTicketModal';
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const TicketFilterComponent = ({userPhone} ) => {

  const inputStyle = {
    width: "150px",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "box-shadow 0.2s",
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: "#6200EE",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };


  const [filters, setFilters] = useState({
    codigoTitulo: '',
    fechaInicio: '',
    fechaFin: '',
    estado: '',
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [ticketsData, setTicketsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

const handleOpenCreateModal = () => setIsCreateModalOpen(true);
const handleCloseCreateModal = () =>{ setIsCreateModalOpen(false); fetchTickets()}

  const openModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicketId(null);
    fetchTickets();
  };

  const handleViewTicket = (ticket) => {
    openModal(ticket);
  };

  const columns = [
    {
      field: "codigo",
      headerName: "Código",
      width: 120,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => openModal(params.value.replace("TICKET000", ""))} // Llama a la función para abrir el modal
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "titulo", headerName: "Título", width: 220 , headerAlign: "center"},
    { field: "solicitante", headerName: "Solicitante", width: 140 , headerAlign: "center"},
    { field: "asignadoA", headerName: "Asignado A", width: 140 , headerAlign: "center" },
    { field: "fechaCreacion", headerName: "Fecha Creación", width: 140 , headerAlign: "center" },
    {
      field: "estado",
      headerName: "Estado",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor:
              params.value === "Pendiente"
                ? "orange"
                : params.value === "Cancelado"
                ? "red"
                : "green",
            color: "white",
            textAlign: "center",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 85,
      headerAlign: "center",
      renderCell: (params) => (
        <button
            onClick={() => {
              handleViewTicket(params.row.codigo.replace("TICKET000", ""));
            }}
          style={{
            padding: "6px 10px",
            backgroundColor: "#E5E7EB",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex", // Asegura un contenedor flexible
            alignItems: "center", // Centra verticalmente
            justifyContent: "center", // Centra horizontalmente
          }}
        >
          <FaEye />
        </button>
      ),
    },
  ];

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
        codigo: ticket.id > 9 ? `TICKET00${ticket.id}` : `TICKET000${ticket.id}`,
        titulo: ticket.titulo || 'No descripcion',
        solicitante: `${ticket.nombre} ${ticket.apellido}`,
        asignadoA: ticket.asignado || 'No asignado',
        fechaCreacion: new Date(ticket.fecha).toLocaleDateString('es-ES'),
        estado: ticket.estado,
      }));
      console.log(formattedData);
      setTicketsData(formattedData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
  
    // Cambiar dirección si la misma columna es seleccionada nuevamente
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
  
    // Actualizar estado del ordenamiento
    setSortConfig({ key, direction });
  
    // Ordenar los datos dinámicamente
    const sortedData = [...ticketsData].sort((a, b) => {
      // Orden alfabético para strings
      if (typeof a[key] === "string") {
        const valueA = a[key].toLowerCase();
        const valueB = b[key].toLowerCase();
        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
      }
  
      // Orden numérico o de fechas
      if (key === "fechaCreacion") {
        const dateA = new Date(a[key].split("/").reverse().join("-"));
        const dateB = new Date(b[key].split("/").reverse().join("-"));
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }
  
      // Default para otros casos
      return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
    });
  
    // Actualizar la lista de tickets
    setTicketsData(sortedData);
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
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2rem', width: '80%', maxWidth: '800px', margin: '0 2%' }}>
    <div className="ticket-filter-component">
      <div className='filters'>
      <button className="new-button" onClick={handleOpenCreateModal}>
        <FaPlus /> Nuevo
    </button>
      </div>
    <div className="filters">
      <input
        type="text"
        name="codigoTitulo"
        placeholder="Código / Título"
        value={filters.codigoTitulo}
        onChange={handleFilterChange}
        style={inputStyle}
        className="filter-input"
        onFocus={(e) => (e.target.style = inputFocusStyle)}
        onBlur={(e) => (e.target.style = inputStyle)}
      />
      <div className="date-filter">
        <FaCalendarAlt className="icon" />
        <DatePicker
          selected={filters.fechaInicio}
          onChange={(date) => handleFilterChange({ target: { name: "fechaInicio", value: date } })}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fecha Inicio"
          customInput={
            <input
              type="text"
              style={inputStyle}
              onFocus={(e) => (e.target.style = inputFocusStyle)}
              onBlur={(e) => (e.target.style = inputStyle)}
            />
          }
        />
      </div>
      <div className="date-filter">
        <FaCalendarAlt className="icon" />
        <DatePicker
          selected={filters.fechaFin}
          onChange={(date) => handleFilterChange({ target: { name: "fechaFin", value: date } })}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fecha Fin"
          customInput={
            <input
              type="text"
              style={inputStyle}
              onFocus={(e) => (e.target.style = inputFocusStyle)}
              onBlur={(e) => (e.target.style = inputStyle)}
            />
          }
        />
      </div>
  <select
    name="estado"
    value={filters.estado}
    onChange={handleFilterChange}
    className="filter-select"
    style={{
      ...inputStyle,
      padding: "10px",
      fontSize: "14px",
      cursor: "pointer",
    }}
  >
    <option value="">Estado</option>
    <option value="Pendiente">Pendiente</option>
    <option value="En Proceso">En Proceso</option>
    <option value="Finalizado">Finalizado</option>
    <option value="Cancelado">Cancelado</option>
    </select>
    <button onClick={applyFilters} className="filter-button">
        <FaSearch /> Buscar
    </button>
    </div>

      <Box style={{ maxHeight: 100, width: 1000 }}>
        <DataGrid rows={ticketsData} columns={columns} getRowId={(row) => row.codigo} pageSize={5} disableSelectionOnClick sx={{
            boxShadow: 2,
            border: 1,
            borderColor: "divider",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
        }} />
      </Box>
        {/* Modal de detalles del ticket */}
        {selectedTicketId && (
          <TicketModal
            ticketId={selectedTicketId}
            isOpen={isModalOpen}
            closeModal={closeModal}
            userPhone={userPhone}
          />
        )}
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          userPhone={userPhone}
        />
      </div>
    </div>
  );
};

export default TicketFilterComponent;
