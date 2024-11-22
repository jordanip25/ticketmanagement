import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FaPlus, FaSearch, FaDownload, FaEye , FaBookmark} from "react-icons/fa";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button  } from "@mui/material";

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); 
  const [tickets, setTickets] = useState([]); // Tickets asociados
  const [loading, setLoading] = useState(false); // Indicador de carga

  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const inputStyle = {
    width: "170px",
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


  // Fetch data from the API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("https://sandy-puddle-hydrangea.glitch.me/clients");
        const data = await response.json();
        setClients(data);
        setResponse(null);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("https://sandy-puddle-hydrangea.glitch.me/clients");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleViewClient = (client) => {
    const fullName = `${client.nombre} ${client.apellido}`; // Concatenar nombre y apellido
    setSelectedClient(client); // Seleccionar cliente
    setViewModalOpen(true); // Abrir modal
    fetchTickets(fullName); // Obtener tickets del cliente
  };

  const fetchTickets = async (fullName) => {
    setLoading(true);
    try {
      const response = await fetch("https://sandy-puddle-hydrangea.glitch.me/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: fullName }), // Consulta por nombre completo
      });
  
      if (response.ok) {
        const data = await response.json();
        setTickets(data); // Guarda los tickets en el estado
        setResponse(null);
      } else {
        const errorData = await response.json();
        console.error("Error al obtener los tickets:", errorData.message);
        setTickets([]); // Vacía los tickets si no hay resultados
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Filtered data
  const filteredClients = clients.filter((client) =>
    Object.keys(filters).every((key) =>
      client[key]?.toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  // Handle modal form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddClient = async () => {
    try {
      const response = await fetch("https://sandy-puddle-hydrangea.glitch.me/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });
      if (response.ok) {
        const addedClient = await response.json();
        setClients([...clients, addedClient]); // Update the table with the new client
        await fetchClients();
        setIsModalOpen(false);
        setNewClient({ nombre: "", apellido: "", telefono: "" }); // Reset form
      } else {
        console.error("Failed to add client");
      }
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const handleConcatenateAndSend = async () => {
    console.log(tickets);
    const concatenatedQueries = tickets.map(ticket => ticket.consulta).join(' ');
    console.log(concatenatedQueries);
    try {
      const response = await fetch('https://sandy-puddle-hydrangea.glitch.me/resume', {
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
      setError(error.message);
    }
  };

  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "apellido", headerName: "Apellido", flex: 1 },
    { field: "telefono", headerName: "Teléfono", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      renderCell: (params) => (
        <button
            onClick={() => {
                handleViewClient(params.row)
            }}
          style={{
            padding: "6px 10px",
            backgroundColor: "#E5E7EB",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Header Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "10px 15px",
            backgroundColor: "#6200EE",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <FaPlus /> Agregar cliente
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={filters.nombre}
          onChange={handleFilterChange}
          onFocus={(e) => (e.target.style = inputFocusStyle)}
        onBlur={(e) => (e.target.style = inputStyle)}
          style={{
            padding: "10px",
            width: "150px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={filters.apellido}
          onChange={handleFilterChange}
          onFocus={(e) => (e.target.style = inputFocusStyle)}
        onBlur={(e) => (e.target.style = inputStyle)}
          style={{
            padding: "10px",
            width: "150px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={filters.telefono}
          onChange={handleFilterChange}
          onFocus={(e) => (e.target.style = inputFocusStyle)}
        onBlur={(e) => (e.target.style = inputStyle)}
          style={{
            padding: "10px",
            width: "150px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          style={{
            padding: "10px 15px",
            backgroundColor: "#3B82F6",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <FaSearch /> Buscar
        </button>
      </div>

      {/* DataGrid */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredClients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          sx={{
            boxShadow: 2,
            border: 1,
            borderColor: "divider",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
        />
      </div>
    
      {/* Modal for Adding Client */}
      <Dialog  open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>
          Agregar Cliente
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
          <TextField
            fullWidth
            margin="normal"
            label="Nombres"
            name="nombre"
            value={newClient.nombre}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Apellidos"
            name="apellido"
            value={newClient.apellido}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Número"
            name="telefono"
            value={newClient.telefono}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddClient}
            variant="contained"
            style={{ backgroundColor: "#34D399", color: "#fff" }}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de detalles */}
      <Dialog 
         maxWidth="lg" // Cambia el ancho máximo. Opciones: 'xs', 'sm', 'md', 'lg', 'xl'.
         fullWidth open={viewModalOpen} onClose={() => {setViewModalOpen(false); setResponse(null);}}>
        <DialogTitle>
            Información del Cliente
            <button
            onClick={() => setViewModalOpen(false)}
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
        <DialogContent >
        {selectedClient ? (
  <div>
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px",
          overflow: "hidden",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Cliente:</strong> {selectedClient.nombre} {selectedClient.apellido}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Número:</strong> {selectedClient.telefono}
        </p>
      </div>
    </div>

    {/* Contenedor de dos columnas */}
    <div
      style={{
        display: "flex",
        gap: "20px", // Espaciado entre las columnas
        marginTop: "20px",
      }}
    >
      {/* Columna izquierda: Tickets */}
      <div
        style={{
          flex: 3, // Esta columna ocupará más espacio
          maxHeight: "300px",
          maxWidth: "600px",
          overflowY: "scroll",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {loading ? (
          <p>Cargando tickets...</p>
        ) : tickets.length > 0 ? (
          <div>
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                style={{
                  display: "inline-block",
                  border: "1px solid #eee",
                  boxShadow: "0 2px 2px #ccc",
                  width: "250px",
                  padding: "10px",
                  margin: "5px",
                }}
              >
                <FaBookmark />
                <h2>{ticket.titulo ? ticket.titulo : "Sin descripción"}</h2>
                <p>
                  <strong>
                    {ticket.id > 9 ? `TICKET00${ticket.id}` : `TICKET000${ticket.id}`}
                  </strong>
                </p>
                <p>
                  <strong>Descripción:</strong> {ticket.consulta}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay tickets disponibles.</p>
        )}
      </div>

      {/* Columna derecha: Botón de Sugerencia IA */}
      <div
        style={{
          flex: 1, // Esta columna ocupará menos espacio
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ddd",
          borderRadius: "5px",
          maxHeight: "280px",
          maxWidth: "600px",
          overflowY: "scroll",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
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
          <div readonly style={{ overflowY: "auto", // Habilitar desplazamiento interno si es necesario
            maxHeight: "200px", // Limitar altura máxima para mantener diseño limpio
            width: "100%",  whiteSpace: 'pre-line', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            {response}
          </div>
        )}
        </div>
      </div>
    </div>
  </div>
) : (
  <p>No se encontró información del cliente.</p>
)}

        </DialogContent>
        </Dialog>

    </div>
  );
};

export default Clientes;
