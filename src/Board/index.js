import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, ChartDataLabels);

const Board = () => {
  const [barData, setBarData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [totalTickets, setTotalTickets] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://sandy-puddle-hydrangea.glitch.me/tickets'); // Cambia esta línea por el endpoint real
      const tickets = await response.json();

      const statusCounts = tickets.reduce((acc, ticket) => {
        acc[ticket.estado] = (acc[ticket.estado] || 0) + 1;
        return acc;
      }, {});

      const pieChartData = {
        labels: Object.keys(statusCounts),
        datasets: [
          {
            label: 'Estados de tickets',
            data: Object.values(statusCounts),
            backgroundColor: ['#FF5374', '#36A2EB', '#FFCE56', '#4BC0C0'],
            hoverBackgroundColor: ['#FF5374', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      };

      const monthCounts = tickets.reduce((acc, ticket) => {
        const month = new Date(ticket.fecha).toLocaleString('es-ES', { month: 'long' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const barChartData = {
        labels: months,
        datasets: [
          {
            label: 'Tickets por mes',
            data: months.map(month => monthCounts[month] || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      setPieData(pieChartData);
      setBarData(barChartData);
      setTotalTickets(tickets.length);
    };

    fetchData();
  }, []);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        display: true,
        color: 'white',
        anchor: 'end',
        align: 'start',
        formatter: (value, context) => `${value}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        display: true,
        color: '#fff',
        formatter: (value, context) => {
          const percentage = ((value / totalTickets) * 100).toFixed(1);
          return `${value} (${percentage}%)`;
        },
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2rem', width: '80%', margin: '0 auto' }}>
      <div style={{ width: '40%' }}>
        <h3>Tickets según estado</h3>
        <p>Total de tickets: {totalTickets}</p>
        {pieData && <Pie data={pieData} options={pieOptions} />}
      </div>
      <div style={{ width: '60%' }}>
        <h3>Tickets por mes</h3>
        {barData && <Bar data={barData} options={barOptions} />}
      </div>
    </div>
  );
};

export default Board;
