
import { Box } from "@mui/material";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";


import Sensordevice from "../../commonjs/sensordevice";
import KDDefine from "../../commonjs/kddefine";
import myAppGlobal from "../../myAppGlobal";

let dataChart = {
  labels: [],
  datasets: [],
};

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const optionChart = {
  plugins: {
    legend: {
      display: false,
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      text: "x title",
       ticks: {
            maxTicksLimit: 10,
        },
    },

    "y-left": {
      min: 0,
      max: 50,
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "수온 (℃)",
        color: "rgb(24, 112, 235)",
      },
    },
    "y-right": {
      min: 0,
      max: 100,
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        text: "습도 (%)",
        color: "rgb(24, 200, 105)",
      },
      grid: {
        display: false,
      },
    },
  },
};

function decodeDsensor(sdatas) {
  dataChart = {
    labels: [],
    datasets: [],
  };

  let xlabels = [];

//데이터없으면 리턴.
  if( sdatas.length <=0)
  {
    return ;
  }


  let leftdatas = {
    type: "line",
    label: "수온",
    yAxisID: "y-left",
    pointStyle: "triangle",
    pointRadius: 4,
    borderColor: "rgb(24, 112, 235)",
    borderWidth: 2,
    data: [],
  };

  let rightdatas = {
    type: "line",
    label: "습도",
    yAxisID: "y-right",
    pointRadius: 4,
    borderColor: "rgb(24, 200, 105)",
    borderWidth: 2,
    data: [],
  };

  
  let leftsensor;
  let rightsensor;
  sdatas[0].SLIST.forEach((sitem) => {
    let sensor = new Sensordevice(sitem, myAppGlobal);
    if (sensor.Sensortype == KDDefine.KDSensorTypeEnum.SUT_WTemperature) {
      if(leftsensor !=null)
      {
        //온도가 여러개이면 채널번호가 낮으것이 내부온도이다.
         if( leftsensor.channel > sensor.channel)
         {
          leftsensor = sensor;
         }
      }
      else{
        leftsensor = sensor;
      }
    }

    if (sensor.Sensortype == KDDefine.KDSensorTypeEnum.SUT_SALINITY) {
      
      if(rightsensor !=null)
      {
         if( rightsensor.channel > sensor.channel)
         {
          rightsensor = sensor;
         }
      }
      else{
        rightsensor = sensor;
      }

    }
  });

  //console.log("------decodeDsensor leftsensor : " + leftsensor.Name + " Unit:" + leftsensor.ValueUnit );

  sdatas.forEach((item) => {
    let dTime = new Date(item.SDate);
    let sTime = dTime.getHours() + ":" + dTime.getMinutes();
    let isSensor = false;

    item.SLIST.forEach((sitem) => {

      if(leftsensor !=null )
      {
        if( sitem.Uid == leftsensor.UniqID)
        {
          leftdatas.data.push(sitem.Val);
          isSensor = true;
        }
      }

      if(rightsensor !=null )
      {
        if( sitem.Uid == rightsensor.UniqID)
        {
          rightdatas.data.push(sitem.Val);
          isSensor = true;
        }
      }

     

    });

    if (isSensor === true) {
      xlabels.push(sTime);
    }
  });

  console.log("------------------------leftdatas--------------------");

  dataChart.labels = xlabels;
  //센서값이 많으면 포인터 삭제
  if (xlabels.length > 30) {
    leftdatas.pointRadius = 0;
    rightdatas.pointRadius = 0;
  }
  dataChart.datasets.push(leftdatas);
  dataChart.datasets.push(rightdatas);
  if(leftsensor !=null )
  {
    optionChart.scales["y-left"].title.text=leftsensor.Name + " (" + leftsensor.ValueUnit + ")";
  }
 
  if(rightsensor !=null )
  {
    optionChart.scales["y-right"].title.text=rightsensor.Name + " (" + rightsensor.ValueUnit + ")";
  }


}

const DashboardChartTank = (props) => {
  console.log("------------------------DashboardChart--------------------");

  //다시 만들어야됨
  decodeDsensor(props.chartdatas);


  return (
    <Box sx={{ display: "flex" ,  height: 300}}>
    
        
        <Line key="dashboardChart" data={dataChart} options={optionChart} />{" "}
     
    </Box>
  );
};

export default DashboardChartTank;
