import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";

interface BarChartProps {
  title: string;
  data: number[];
  label: string;
  backgroundColor: string;
  borderColor: string;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  label,
  backgroundColor,
  borderColor,
}) => {
  const chartData: ChartData = {
    labels: data.map((_, index) => index + 1),
    datasets: [
      {
        label,
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>{title}</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
