import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function DepartmentChart() {

  const data = {
    labels: [
      "Computer",
      "IT",
      "MBA",
      "BCA",
    ],

    datasets: [
      {
        data: [42, 28, 18, 12],

        backgroundColor: [
          "#2563eb",
          "#06b6d4",
          "#16a34a",
          "#f59e0b",
        ],

        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,
          padding: 18,
        },
      },
    },

    cutout: "70%",
  };

  return (
    <div className="chart-card">

      <div className="chart-header">

        <div>
          <h3>Departments</h3>
          <small>Department Distribution</small>
        </div>

      </div>

      <div style={{ height: "300px" }}>

        <Doughnut
          data={data}
          options={options}
        />

      </div>

    </div>
  );
}

export default DepartmentChart;