import React from "react";
import axios from 'axios';

let colorCard = "#f9fdf7";

const columnList = [
  { name: "POR HACER", stage: 1, color: "#F8CC8A" },
  { name: "EN PROGRESO", stage: 2, color: "#2B29CC" },
  { name: "FINALIZADO", stage: 3, color: "#FF6B6B" }
];

export default class IBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      projects: [],
      data: [],
      draggedOverCol: 0,
      selectedProject: null // Estado para la tarjeta seleccionada
    };

    this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    this.columns = columnList;
  }

  convertirFechaHora(fechaOriginal) {
    const fecha = new Date(fechaOriginal);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const día = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
    return `${año}-${mes}-${día} ${hora}:${minutos}:${segundos}`;
  }

  ingresarPizarra() {
    const registros = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const obj = this.state.data[i];
      const item = {};
      item.id = parseInt(obj.id);
      item.priority = 1;
      item.name = `${obj.nombre} ${obj.apellido}`.toUpperCase() + " " + this.convertirFechaHora(obj.fecha);
      item.date = this.convertirFechaHora(obj.fecha);
      item.description = JSON.stringify({ pregunta: obj.consulta, respuesta: obj.respuesta });
      item.status = this.getStatus(obj.feedback);
      item.numero = obj.numero;
      item.consulta = obj.consulta;
      item.respuesta = obj.respuesta;
      item.color = colorCard;
      registros.push(item);
    }
    this.setState({ projects: registros, isLoading: false });
  }

  getStatus(status) {
    switch (status) {
      case "Por Hacer":
        return 1;
      case "En Progreso":
        return 2;
      case "Finalizado":
        return 3;
      default:
        return 1;
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios.get("https://sandy-puddle-hydrangea.glitch.me/records")
      .then((response) => {
        const data = response.data;
        this.setState({ data }, () => this.ingresarPizarra());
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        this.setState({ isLoading: false });
      });
  }

  handleOnDragEnter(e) {
    e.preventDefault();
  }

  handleOnDragEnd(e) {
    e.preventDefault();
  }

  openModal = (project) => {
    this.setState({ selectedProject: project });
  };

  closeModal = () => {
    this.setState({ selectedProject: null });
  };

  render() {
    if (this.state.isLoading) {
      return <div><div className={"loading"}>Loading&#8230;</div></div>;
    }

    return (
      <div className="board-container">
        {this.columns.map((column) => (
          <KanbanColumn
            name={column.name}
            stage={column.stage}
            color={column.color}
            projects={this.state.projects.filter((project) => project.status === column.stage)}
            onDragEnter={this.handleOnDragEnter}
            onDragEnd={this.handleOnDragEnd}
            onCardClick={this.openModal} // Pasa la función para abrir el modal
            key={column.stage}
          />
        ))}
        {this.state.selectedProject && (
          <Modal project={this.state.selectedProject} onClose={this.closeModal} />
        )}
      </div>
    );
  }
}

class KanbanColumn extends React.Component {
  generateKanbanCards() {
    return this.props.projects.map((project) => (
      <KanbanCard
        project={project}
        key={project.description}
        onDragEnd={this.props.onDragEnd}
        onClick={() => this.props.onCardClick(project)} // Agrega la función para abrir el modal
      />
    ));
  }

  render() {
    return (
      <div
        className="kanban-column"
        style={{
          backgroundColor: this.props.color
        }}
        onDragEnter={(e) => { this.props.onDragEnter(e, this.props.stage); }}
      >
        <h4>{this.props.name}</h4>
        {this.generateKanbanCards()}
        <br />
      </div>
    );
  }
}

class KanbanCard extends React.Component {
  handleDragEnd = (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <div
        className="kanban-card"
        draggable
        onDragEnd={this.handleDragEnd}
        onClick={this.props.onClick} // Agrega el evento onClick para abrir el modal
      >
        <strong>{this.props.project.name}</strong>
      </div>
    );
  }
}

// Componente Modal para mostrar información detallada
function Modal({ project, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">&times;</button>
        <h2>{project.name}</h2>
        <p><strong>Numero de Contacto: </strong>{project.numero}</p>
        <p><strong>Fecha:</strong> {project.date}</p>
        <p><strong>Pregunta:</strong> {project.consulta}</p>
        <p><strong>Respuesta:</strong> {project.respuesta}</p>
      </div>
    </div>
  );
}

// CSS para el modal y el tablero responsive
const styles = `
.board-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3em;
  padding: 2em;
}

.kanban-column {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  max-width: 18em;
  height: auto;
  padding: 1em;
  text-align: center;
  border-radius: 8px;
  border-style: solid;
  border-width: medium;
  margin-bottom: 1em;
}

.kanban-card {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 1em;
  margin: 0.5em 0;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2em;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;
}

.close-button {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

@media (min-width: 600px) {
  .kanban-column {
    width: 45%;
  }
}

@media (min-width: 900px) {
  .kanban-column {
    width: 25%;
  }
}
`;

// Insertar estilos en la página
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
