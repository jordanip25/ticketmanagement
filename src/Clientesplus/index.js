import React, { useEffect, useState } from "react";
import { FaPlus, FaEye, FaSearch, FaDownload } from "react-icons/fa";

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filters, setFilters] = useState({
    nombres: "",
    apellidos: "",
    numero: "",
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("https://sandy-puddle-hydrangea.glitch.me/users");
        const data = await response.json();
        setClients(data);
        setFilteredClients(data); // Initialize filtered clients
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    // Filter the clients based on the inputs
    const newFilteredClients = clients.filter((client) =>
      Object.keys(filters).every((key) =>
        client[key]?.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredClients(newFilteredClients);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Header Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button
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
        <button
          style={{
            padding: "10px 15px",
            backgroundColor: "#A7F3D0",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <FaDownload /> Descargar
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={filters.nombres}
          onChange={handleFilterChange}
          style={{
            padding: "10px",
            width: "150px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={filters.apellidos}
          onChange={handleFilterChange}
          style={{
            padding: "10px",
            width: "150px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="text"
          name="numero"
          placeholder="Número"
          value={filters.numero}
          onChange={handleFilterChange}
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

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead style={{ backgroundColor: "#F3F4F6" }}>
          <tr>
            <th style={headerStyle}>Nombres</th>
            <th style={headerStyle}>Apellidos</th>
            <th style={headerStyle}>Número</th>
            <th style={headerStyle}></th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #E5E7EB" }}>
              <td style={cellStyle}>{client.nombres}</td>
              <td style={cellStyle}>{client.apellidos}</td>
              <td style={cellStyle}>{client.numero}</td>
              <td style={{ textAlign: "center", padding: "10px" }}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const headerStyle = {
  padding: "10px",
  textAlign: "left",
  color: "#6B7280",
  fontWeight: "bold",
  textTransform: "uppercase",
  fontSize: "12px",
};

const cellStyle = {
  padding: "10px",
  textAlign: "left",
};

export default Clientes;
