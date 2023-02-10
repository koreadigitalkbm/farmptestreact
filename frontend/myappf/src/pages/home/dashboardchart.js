import { useState, useEffect } from 'react';

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import Sensordevice from "../../commonjs/sensordevice";
import KDDefine from '../../commonjs/kddefine';
import myAppGlobal from '../../myAppGlobal';

let dataChart = {
  labels: [],
  datasets: [],
};

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const optionChart = {
  scales: {
    x: {
      display: true,
      text: "x title",
    },
    
    'y-left': {
      min: 10,
      max: 40,
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: '온도'
      }
    },
    'y-right': {
      min: 0,
      max: 100,
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        text: '습도'
      },
      grid: {
        display: false
      }
    },
  },
};

function decodeDsensor(d) {
    dataChart = {
        labels: [],
        datasets: [],
      };
    
      let xlabels=[];
      let leftdatas=
      {
        type: 'line',
        label: '온도',
        yAxisID: 'y-left',
        pointStyle:'triangle',
        pointRadius:4,
        borderColor: 'rgb(24, 112, 235)',
        borderWidth: 2,
        data: [],
      };

      let rightdatas=
      {
        type: 'line',
        label: '습도',
        yAxisID: 'y-right',
        pointRadius:4,
        borderColor: 'rgb(54, 250, 135)',
        borderWidth: 2,
        data: [],
      };
      

    d.forEach(e => {
      
      let dTime = new Date(e.SDate);
      let sTime = dTime.getHours() + ':' + dTime.getMinutes()
      let isSensor = false;

      
      
          e.SLIST.forEach(el => {
          let sensor = new Sensordevice(el,myAppGlobal);
          if(sensor.Sensortype == KDDefine.KDSensorTypeEnum.SUT_Temperature)
          {
            leftdatas.data.push(sensor.valuestring);
            isSensor=true;
          }

          if(sensor.Sensortype == KDDefine.KDSensorTypeEnum.SUT_Humidity)
          {
            rightdatas.data.push(sensor.valuestring);
            isSensor=true;
          }

        })

        if (isSensor===true) 
        {
          xlabels.push(sTime);
        }


    })

    console.log("------------------------leftdatas--------------------");
    

    dataChart.labels = xlabels;
    //센서값이 만드면 포인터 삭제
    if(xlabels.length >30)
    {
      leftdatas.pointRadius=0;
      rightdatas.pointRadius=0;
    }
    dataChart.datasets.push(leftdatas) ;
    dataChart.datasets.push(rightdatas) ;




  }

const DashboardChart = (props) => {
  console.log("------------------------DashboardChart--------------------");

  //다시 만들어야됨
  decodeDsensor(props.chartdatas);

  return (
    <div className="dashboardchar">
      {Date(props.lasttime)}
      <Line  key="dashboardChart" data={dataChart} options={optionChart} />{" "}
    </div>
  );
};

export default DashboardChart;
