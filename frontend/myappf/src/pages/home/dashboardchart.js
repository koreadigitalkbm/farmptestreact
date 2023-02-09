import { useState, useEffect } from 'react';

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import Sensordevice from "../../commonjs/sensordevice";

let dataChart = {
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

function addGarphSensor(sTime, newSensor) {
    dataChart.datasets.push({
      type: 'line',
      yAxisID: newSensor.Name,
      label: newSensor.Name,
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 2,

      data: [{ x: sTime, y: newSensor.value }],
    })
  }
function decodeDsensor(d) {
    dataChart = {
        labels: [],
        datasets: [],
      };
    
    d.forEach(e => {
      if (e.SLIST.length !== 0) {
        console.log('로직시작');
        let isSensor = false;
        let dTime = new Date(e.SDate);
        let sTime = dTime.getHours() + ':' + dTime.getMinutes()
        e.SLIST.forEach(el => {
          let sensor = new Sensordevice(el);
          dataChart.datasets.forEach(ele => {
            if (ele.label === sensor.Name) {
              ele.data.push({ x: sTime, y: el.Val });
              isSensor = true;
            }
          })
          if (!isSensor) addGarphSensor(sTime, sensor)        // 그래프데이터에 센서가 없을경우 그래프 데이터셋 하나 추가
        })
      } else {
        console.log('타임스탬프만 있음');
      }
    })
  }

const DashboardChart = (props) => {
  console.log("------------------------DashboardChart--------------------");

  //다시 만들어야됨
  decodeDsensor(props.chartdatas);

  return (
    <div>
      {Date(props.lasttime)}
      <Line width="500" height="100" key="dashboardChart" data={dataChart} options={optionChart} />{" "}
    </div>
  );
};

export default DashboardChart;
