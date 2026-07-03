import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function AttendanceChart() {

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

    datasets: [
      {
        label: "Attendance",
        data: [90, 92, 94, 93, 96, 98, 97],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#2563eb",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: false,
        min: 80,
        max: 100,

        ticks: {
          callback: (value) => value + "%",
        },
      },
    },
  };

  return (
    <div className="chart-card">

      <div className="chart-header">
        <div>
          <h3>Attendance Overview</h3>
          <small>Last 7 Days</small>
        </div>
      </div>

      <div style={{ height: "300px" }}>
        <Line
          data={data}
          options={options}
        />
      </div>

    </div>
  );
}

export default AttendanceChart;