import React from "react";
import axios from 'axios';
//import "@fontsource/karla";

let colorCard = "#f9fdf7";

const columnList = [
  { name: "EN PROGRESO", stage: 1, color: "#F8CC8A" },
  { name: "COMPLETADO", stage: 2, color: "#2B29CC" },
  { name: "CANCELADO", stage: 3, color: "#FF6B6B" }
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
      case "Pendiente":
        return 1;
      case "Finalizado":
        return 2;
      case "Cancelado":
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
        return "Pendiente";
      case 2:
        return "Finalizado";
      case 3:
        return "Cancelado";
      default:
        return "Pendiente";
    }
  }

  render() {
    if (this.state.isLoading) {
      return <div><div className={"loading"}>Loading&#8230;</div></div>;
    }

    return (
      <div>
        <div>
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
          marginRight: '5px',
          marginBottom: '5px',
          paddingLeft: '5px',
          paddingTop: '0px',
          width: '12.5em',
          height: '35em',
          textAlign: 'center',
          backgroundColor: this.state.mouseIsHovering ? '#d3d3d3' : this.props.color,
          borderRadius: '8px',
          borderStyle: 'solid',
          borderWidth: 'medium'
        }}
        onDragEnter={(e) => { this.setState({ mouseIsHovering: true }); this.props.onDragEnter(e, this.props.stage); }}
        onDragExit={(e) => {this.setState({ mouseIsHovering: false }); e.preventDefault(); }}
      >
        <h4>{this.props.name}</h4>
        {this.generateKanbanCards()}
        <br />
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
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          padding: '1em',
          margin: '0.5em 0',
          borderRadius: '5px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          cursor: 'pointer'
        }}
        draggable
        onDragEnd={this.handleDragEnd}
        onClick={this.toggleCollapse}
      >
        <strong>{this.props.project.name}</strong>
        <p>{this.state.collapsed ? '' : this.props.fecha}</p>
        <p>{this.state.collapsed ? '' : this.props.project.description}</p>
      </div>
    );
  }
}