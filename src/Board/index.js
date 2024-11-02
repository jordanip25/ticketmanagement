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
      draggedOverCol: 0
    };

    this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    this.columns = columnList;
  }

  ingresarPizarra() {
    const registros = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const obj = this.state.data[i];
      const item = {};

      item.id = parseInt(obj.id);
      item.priority = 1;
      item.name = `${obj.nombre} ${obj.apellido}`.toUpperCase();
      item.date = obj.fecha;
      item.description = JSON.stringify({ pregunta: obj.consulta, respuesta: obj.respuesta });
      item.status = this.getStatus(obj.feedback);
      item.color = colorCard;

      registros.push(item);
    }
    console.log(registros);
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
    console.log("iniciando");
    axios.get("https://sandy-puddle-hydrangea.glitch.me/records")
      .then((response) => {
        const data = response.data;
        this.setState({ data }, () => this.ingresarPizarra());
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        this.setState({ isLoading: false });
      });
  }

  handleOnDragEnter(e) {
    e.preventDefault();
  }

  async handleOnDragEnd(e) {
    e.preventDefault();
  }

  getStatusLabel(status) {
    switch (status) {
      case 1:
        return "Por Hacer";
      case 2:
        return "En Progreso";
      case 3:
        return "Finalizado";
      default:
        return "Por Hacer";
    }
  }

  render() {
    if (this.state.isLoading) {
      return <div><div className={"loading"}>Loading&#8230;</div></div>;
    }

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {this.columns.map((column) => (
            <KanbanColumn
              name={column.name}
              stage={column.stage}
              color={column.color}
              projects={this.state.projects.filter((project) => project.status === column.stage)}
              onDragEnter={this.handleOnDragEnter}
              onDragEnd={this.handleOnDragEnd}
              key={column.stage}
            />
          ))}
        </div>
      </div>
    );
  }
}

class KanbanColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mouseIsHovering: false };
  }

  generateKanbanCards() {
    return this.props.projects.map((project) => (
      <KanbanCard
        project={project}
        key={project.description}
        fecha={project.date}
        onDragEnd={this.props.onDragEnd}
      />
    ));
  }

  render() {
    return (
      <div
        style={{
          display: 'inline-block',
          verticalAlign: 'top',
          margin: '0 8px',
          padding: '10px',
          width: '14em',
          height: '40em',
          textAlign: 'center',
          backgroundColor: this.props.color,
          borderRadius: '10px',
          border: '2px solid #ccc',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        onDragEnter={(e) => { this.setState({ mouseIsHovering: true }); this.props.onDragEnter(e, this.props.stage); }}
        onDragExit={(e) => { this.setState({ mouseIsHovering: false }); e.preventDefault(); }}
      >
        <h4 style={{ color: '#333', fontSize: '1.2em', fontWeight: 'bold' }}>{this.props.name}</h4>
        {this.generateKanbanCards()}
      </div>
    );
  }
}

class KanbanCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: true };
  }

  handleDragEnd = (e) => {
    e.preventDefault();
  }

  toggleCollapse = () => {
    this.setState((prevState) => ({ collapsed: !prevState.collapsed }));
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: '1em',
          margin: '0.5em 0',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          border: '1px solid #ddd'
        }}
        draggable
        onDragEnd={this.handleDragEnd}
        onClick={this.toggleCollapse}
      >
        <strong style={{ fontSize: '1em', color: '#333' }}>{this.props.project.name}</strong>
        {!this.state.collapsed && (
          <>
            <p style={{ color: '#777', fontSize: '0.9em' }}>{this.props.fecha}</p>
            <p style={{ color: '#555', fontSize: '0.85em' }}>{this.props.project.description}</p>
          </>
        )}
      </div>
    );
  }
}