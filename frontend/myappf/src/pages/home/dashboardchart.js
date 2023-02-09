import React from "react";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

const dataChart = {
  labels: [],
  datasets: [],
};

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const optionChart = {
  scales: {
    온도: {
      type: "linear",
      display: true,
      position: "right",
    },
    습도: {
      type: "linear",
      display: true,
      position: "left",
    },
  },
};

const DashboardChart = (props) => {
  console.log("------------------------DashboardChart--------------------");
  const mydatas = props.chartdatas;

  return (
    <div>
      {" "}
      <Line width="500" height="100" key="dashboardChart" data={dataChart} options={optionChart} />{" "}
    </div>
  );
};

export default DashboardChart;
