// src/components/Board.js
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Board = () => {
  // Datos para el gráfico de barras
  const barData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        label: 'Ventas en 2024',
        data: [50, 75, 30, 90, 45],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones para el gráfico de barras
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Datos para el gráfico de pastel
  const pieData = {
    labels: ['Producto A', 'Producto B', 'Producto C', 'Producto D'],
    datasets: [
      {
        label: 'Distribución de Ventas',
        data: [30, 20, 25, 25],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '80%', margin: '0 auto' }}>
      <h2>Gráficos de Ventas</h2>
      <div style={{ width: '60%' }}>
        <h3>Gráfico de Barras</h3>
        <Bar data={barData} options={barOptions} />
      </div>
      <div style={{ width: '40%' }}>
        <h3>Gráfico de Pastel</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Board;
