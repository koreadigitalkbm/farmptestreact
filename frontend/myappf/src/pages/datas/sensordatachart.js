
import { Box } from "@mui/material";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';


import Sensordevice from "../../commonjs/sensordevice";
import KDDefine from "../../commonjs/kddefine";
import KDUtil from "../../commonjs/kdutil";

import blue from '@mui/material/colors/blue';


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
    },

    "y-left": {
      min: 10,
      max: 40,
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "온도 (℃)",
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
    label: "온도",
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
    if (sensor.Sensortype == KDDefine.KDSensorTypeEnum.SUT_Temperature) {
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

    if (sensor.Sensortype == KDDefine.KDSensorTypeEnum.SUT_Humidity) {
      
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

const SensorDataChart = (props) => {
  console.log("------------------------SensorDataChart--------------------");

  
  //optionChart.scales["y-right"].title.text="hahahha";

  return (


    <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={1} >
      <Grid item xs={10} >
      <Line key="sensordataChart" data={dataChart} options={optionChart} />{" "}
      </Grid>
      <Grid item xs={2} >
      <Box     sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }} >
           <FormLabel component="legend">센서선택</FormLabel>
           <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked  color="secondary"  />} label="Label"  sx={{  color:'#9c27b0' }} />
      <FormControlLabel control={<Checkbox />} label="Disabled" />
    </FormGroup>
      </Box>
        
      </Grid>
      
    </Grid>
    </Box>


    
  );
};

export default SensorDataChart;
