// src/components/SystemMonitor.jsx
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const generateInitialData = () => Array(20).fill(0);
const generateLabels = () => Array(20).fill('');

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { color: '#9ca3af' }
    },
    x: {
      ticks: { color: '#9ca3af' }
    }
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

const SystemMonitor = () => {
  const [cpuData, setCpuData] = useState({
    labels: generateLabels(),
    datasets: [{
      label: 'CPU Usage',
      data: generateInitialData(),
      borderColor: '#34d399',
      backgroundColor: 'rgba(52, 211, 153, 0.2)',
      fill: true,
    }],
  });

  const [memData, setMemData] = useState({
    labels: generateLabels(),
    datasets: [{
      label: 'Memory Usage',
      data: generateInitialData(),
      borderColor: '#60a5fa',
      backgroundColor: 'rgba(96, 165, 250, 0.2)',
      fill: true,
    }],
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Update CPU data
      setCpuData(prevData => {
        const newData = [...prevData.datasets[0].data.slice(1), Math.random() * 80 + 10];
        return { ...prevData, datasets: [{ ...prevData.datasets[0], data: newData }] };
      });

      // Update Memory data
      setMemData(prevData => {
        const newData = [...prevData.datasets[0].data.slice(1), Math.random() * 60 + 20];
        return { ...prevData, datasets: [{ ...prevData.datasets[0], data: newData }] };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 text-gray-200 h-full flex flex-col gap-4">
      <div>
        <h3 className="font-bold mb-2">CPU Usage (%)</h3>
        <div className="h-40">
          <Line data={cpuData} options={chartOptions} />
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-2">Memory Usage (%)</h3>
        <div className="h-40">
          <Line data={memData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;