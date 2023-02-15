import { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";

import Sensordevice from "../../commonjs/sensordevice";
import KDDefine from "../../commonjs/kddefine";
import KDUtil from "../../commonjs/kdutil";

import blue from "@mui/material/colors/blue";

import myAppGlobal from "../../myAppGlobal";

let chboxlist = [
  { label: "l1", color: "#1976d2", key: "0", checked: false ,sensor:null},
  { label: "l2", color: "#2e7d32", key: "1", checked: false ,sensor:null},
  { label: "l3", color: "#9c27b0", key: "2", checked: false ,sensor:null},
  { label: "l4", color: "#d32f2f", key: "3", checked: false ,sensor:null},

  { label: "l4", color: "#ed6c02", key: "4", checked: false ,sensor:null},
  { label: "l4", color: "#0288d1", key: "5", checked: false ,sensor:null},
  { label: "l4", color: "#ef5350", key: "6", checked: false ,sensor:null},
  { label: "l4", color: "#4caf50", key: "7", checked: false ,sensor:null},

  { label: "l4", color: "#000010", key: "8", checked: false ,sensor:null},
  { label: "l4", color: "#000010", key: "9", checked: false ,sensor:null},
  { label: "l4", color: "#000010", key: "10", checked: false ,sensor:null},
  { label: "l4", color: "#000010", key: "11", checked: false ,sensor:null},

  { label: "l4", color: "#000010", key: "12", checked: false ,sensor:null},
  { label: "l4", color: "#000010", key: "13", checked: false ,sensor:null},
  { label: "l4", color: "#000010", key: "14", checked: false ,sensor:null},
  { label: "l4", color: "#000010", key: "15", checked: false ,sensor:null},
];

let checkflgs = [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

let dataChart = {
  labels: [],
  datasets: [],
};

let sensorlistforchart=[];

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip );

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

function getsensorfromlist(stype,nodeid,channel)
{
  

  for(let i=0;i< sensorlistforchart.length ; i++)
  {
    if(sensorlistforchart[i].stype == stype &&  sensorlistforchart[i].nodeid == nodeid && sensorlistforchart[i].channel == channel )
    {
      return sensorlistforchart[i];
    }

  }
  
  console.log("n :" + stype );   

  let newdatas = {
    stype:stype,
    nodeid:nodeid,
    channel:channel,
    type: "line",
    label: "온도",
    yAxisID: "y-left",
    pointStyle: "triangle",
    pointRadius: 0,
    borderColor: "rgb(24, 112, 235)",
    borderWidth: 2,
    data: [],
  };
  sensorlistforchart.push(newdatas);


  return newdatas;


}

function DecodeSensorbyDB(sdatas) {
 


  
  sensorlistforchart=[];


  console.log("------decodeDsensor sdatas.lenth : " + sdatas.length );

  
  for(let i=0;i<sdatas.length ;i++)
  {
   

         const msensor = getsensorfromlist(sdatas[i].P,sdatas[i].N,sdatas[i].C);
         let dTime = new Date(sdatas[i].T);
          let sTime = dTime.getHours() + ":" + dTime.getMinutes();

         const xydata={x:sTime, y:sdatas[i].V};

     msensor.data.push(xydata);

  }


  console.log("------------------------sensorlistforchart -------------------- L: "+ sensorlistforchart.length);

  for(let i=0;i<sensorlistforchart.length ;i++)
  {
   const newsensor= Sensordevice.createSensor(sensorlistforchart[i].stype,sensorlistforchart[i].nodeid,sensorlistforchart[i].channel, myAppGlobal);
   
    chboxlist[i].label = newsensor.Name;
    chboxlist[i].sensor =newsensor;
   }



  return sensorlistforchart.length;

}

function Drawchart()
{
  
  dataChart = {
    labels: [],
    datasets: [],
  };

  

  


  let leftdatas = {
    type: "line",
    label: "온도ss",
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


  console.log("Drawchart");


  
  for(let i=0;i<sensorlistforchart.length ; i++)
  {
    if(chboxlist[i].checked==true)
    {
      dataChart.datasets.push(sensorlistforchart[i]);
    }
    
  }
  
  



}

const SensorDataChart = (props) => {
  const [bcheckeds, setCheckeds] = useState(true);
  

  console.log("------------------------SensorDataChart--------------------");

  useEffect(() => {
    console.log("-------------------------SensorDataChart  useEffect---------------------issetreq:");
  }, []);

  //optionChart.scales["y-right"].title.text="hahahha";

  const handleChange = (event) => {
    console.log("------------------------handleChange--------------------event : " + event.target.name + ",ch:" + event.target.checked);
    chboxlist[event.target.name].checked = event.target.checked;

    //그냥 화면 갱신
    setCheckeds(!bcheckeds);
  };


const scount =   DecodeSensorbyDB(props.datas);

Drawchart();

  //console.log(props.datas);




  let chlist = [];

  for (let i = 0; i < scount; i++) {
    const chb = (
      <FormControlLabel
        control={
          <Checkbox
            key={"keych" + chboxlist[i].key}
            name={chboxlist[i].key}
            checked={chboxlist[i].checked}
            onChange={handleChange}
            sx={{
              color: chboxlist[i].color,
              "&.Mui-checked": { color: chboxlist[i].color },
            }}
          />
        }
        label={chboxlist[i].label}
      />
    );

    chlist.push(chb);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={9}>
          <Line key="sensordataChart" data={dataChart} options={optionChart} />{" "}
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              p: 1,
              m: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            <FormLabel component="legend"> 센서를 선택하세요. </FormLabel>

            {chlist}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SensorDataChart;
