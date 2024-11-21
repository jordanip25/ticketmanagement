import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FaPlus, FaSearch, FaDownload, FaEye} from "react-icons/fa";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

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
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
    </div>
  );
};

export default Clientes;
