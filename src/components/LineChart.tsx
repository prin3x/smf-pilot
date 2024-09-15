import React from "react";
import { Line } from "react-chartjs-2";

interface ChartProps {
  title: string;
  data: number[];
  label: string;
  backgroundColor: string;
  borderColor: string;
}

const LineChart: React.FC<ChartProps> = ({
  title,
  data,
  label,
  backgroundColor,
  borderColor,
}) => {
  const chartData = {
    labels: data.map((_, index) => index + 1),
    datasets: [
      {
        label,
        data,
        fill: false,
        backgroundColor,
        borderColor,
      },
    ],
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>{title}</h3>
      <Line data={chartData} />
    </div>
  );
};

export default LineChart;
