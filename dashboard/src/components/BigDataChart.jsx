import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BigDataChart = ({
  totalInpatients,
  totalOutpatients,
  totalBedCapacity,
  availableBeds,
  totalDoctors,
}) => {
  const data = {
    labels: [
      "Inpatients",
      "Outpatients",
      "BedCapacity",
      "AvailableBeds",
      "Doctors",
    ],
    datasets: [
      {
        label: "",
        data: [
          totalInpatients,
          totalOutpatients,
          totalBedCapacity,
          availableBeds,
          totalDoctors,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Nodado General Hospital",
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BigDataChart;
