import { useState, useEffect } from 'react';
import { ThemeProvider, styled } from '@mui/material/styles'

import SvgIcon from '@mui/material/SvgIcon';
import { red, blue, blueGrey, yellow, common, indigo } from '@mui/material/colors';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'

import muiTheme from './muiTheme';
import DeviceSystemconfig from "../commonjs/devsystemconfig"

import myAppGlobal from "../myAppGlobal"
import Sensordevice from "../commonjs/sensordevice";

import {Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'
import { Line, } from 'react-chartjs-2'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const optionChart = {
  scales: {
    온도: {
      type: 'linear',
      display: true,
      position: 'right'
    },
    습도: {
      type: 'linear',
      display: true,
      position: 'left'
    },
    유량: {
      type: 'linear',
      display: false,
      position: 'left'
    },
    적산유량: {
      type: 'linear',
      display: false,
      position: 'left'
    },
    무게: {
      type: 'linear',
      display: false,
      position: 'left'
    },
    수위: {
      type: 'linear',
      display: false,
      position: 'left'
    },
    배지온도: {
      type: 'linear',
      display: false,
      position: 'left'
    },
    "신규센서(45)": {
      type: 'linear',
      display: false,
      position: 'left'
    },
  }
}

const theme = muiTheme

let lasteventtime = 1;
let lastsensortime = 1;
let eventlist = [];
let dailysensorlist = [];

let nowTime = new Date(Date.now());

const dataChart = {
  labels: [],
  datasets: [
  ],
};
// {
//   type: 'line',
//   label: 'Dataset 1',
//   borderColor: 'rgb(54, 162, 235)',
//   borderWidth: 2,
//   data: [{ x: nowTime.getHours(), y: 1.3 }, { x: nowTime.getHours() + 1, y: 2.3 }, { x: nowTime.getHours() + 2, y: 3.3 }, { x: nowTime.getHours() + 3, y: 4.3 }, { x: nowTime.getHours() + 4, y: 5.3 }],
// },
// {
//   type: 'line',
//   label: 'Dataset 2',
//   backgroundColor: 'rgb(255, 99, 132)',
//   data: [{ x: nowTime.getHours(), y: 1.7 }, { x: nowTime.getHours() + 1, y: 2.9 }, { x: nowTime.getHours() + 2, y: 3.6 }, { x: nowTime.getHours() + 3, y: 4.8 }, { x: nowTime.getHours() + 4, y: 5.7 }],
//   borderColor: 'red',
//   borderWidth: 2,
// },
function ThermostatIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z" />
    </SvgIcon>
  )
}

function HygrometerIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M17.66 8 12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z" />
    </SvgIcon>
  )
}

function FlowmeterIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M21.98 14H22h-.02zM5.35 13c1.19 0 1.42 1 3.33 1 1.95 0 2.09-1 3.33-1 1.19 0 1.42 1 3.33 1 1.95 0 2.09-1 3.33-1 1.19 0 1.4.98 3.31 1v-2c-1.19 0-1.42-1-3.33-1-1.95 0-2.09 1-3.33 1-1.19 0-1.42-1-3.33-1-1.95 0-2.09 1-3.33 1-1.19 0-1.42-1-3.33-1-1.95 0-2.09 1-3.33 1v2c1.9 0 2.17-1 3.35-1zm13.32 2c-1.95 0-2.09 1-3.33 1-1.19 0-1.42-1-3.33-1-1.95 0-2.1 1-3.34 1-1.24 0-1.38-1-3.33-1-1.95 0-2.1 1-3.34 1v2c1.95 0 2.11-1 3.34-1 1.24 0 1.38 1 3.33 1 1.95 0 2.1-1 3.34-1 1.19 0 1.42 1 3.33 1 1.94 0 2.09-1 3.33-1 1.19 0 1.42 1 3.33 1v-2c-1.24 0-1.38-1-3.33-1zM5.35 9c1.19 0 1.42 1 3.33 1 1.95 0 2.09-1 3.33-1 1.19 0 1.42 1 3.33 1 1.95 0 2.09-1 3.33-1 1.19 0 1.4.98 3.31 1V8c-1.19 0-1.42-1-3.33-1-1.95 0-2.09 1-3.33 1-1.19 0-1.42-1-3.33-1-1.95 0-2.09 1-3.33 1-1.19 0-1.42-1-3.33-1C3.38 7 3.24 8 2 8v2c1.9 0 2.17-1 3.35-1z" />
    </SvgIcon>
  )
}

function Flowmeter_intergrateIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M17 16.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.95c1.35 0 2.2-.42 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm0-4.45c-1.35 0-2.2.43-2.95.8-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.32-1.17.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm2.95-8.08c-.75-.38-1.58-.8-2.95-.8s-2.2.42-2.95.8c-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.37-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.93c1.35 0 2.2-.43 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8V5.04c-.9 0-1.4-.25-2.05-.58zM17 8.09c-1.35 0-2.2.43-2.95.8-.65.35-1.15.6-2.05.6s-1.4-.25-2.05-.6c-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.35-1.15.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.32 1.18-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8V9.49c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8z" />
    </SvgIcon>
  )
}

function WeightmeterIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M14 11V8c4.56-.58 8-3.1 8-6H2c0 2.9 3.44 5.42 8 6v3c-3.68.73-8 3.61-8 11h6v-2H4.13c.93-6.83 6.65-7.2 7.87-7.2s6.94.37 7.87 7.2H16v2h6c0-7.39-4.32-10.27-8-11zm-2 11c-1.1 0-2-.9-2-2 0-.55.22-1.05.59-1.41C11.39 17.79 16 16 16 16s-1.79 4.61-2.59 5.41c-.36.37-.86.59-1.41.59z" />
    </SvgIcon>
  )
}

function WaterguageIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="m3 2 2.01 18.23C5.13 21.23 5.97 22 7 22h10c1.03 0 1.87-.77 1.99-1.77L21 2H3zm9 17c-1.66 0-3-1.34-3-3 0-2 3-5.4 3-5.4s3 3.4 3 5.4c0 1.66-1.34 3-3 3zm6.33-11H5.67l-.44-4h13.53l-.43 4z" />
    </SvgIcon>
  )
}

export default function HomePage() {
  const [moutdevarray, setUpdate] = useState([]);
  const [mevnetarray, setEvents] = useState([]);
  const [mdailysensorarray, setDailysensor] = useState([]);

  const [sensorList, setSensorList] = useState([]);

  useEffect(() => {
    let interval = null;

    let readtimemsec = 1000;
    if (myAppGlobal.islocal === false) {
      readtimemsec = 5000;
    }
    setDailysensor(dailysensorlist);
    interval = setInterval(() => {
      myAppGlobal.farmapi.getDeviceStatus(true, true, false, lastsensortime, lasteventtime).then((ret) => {
        let sensors = ret.Sensors;
        let actuators = ret.Outputs;
        let sysevents = ret.retParam.DEvents;
        let dsensors = ret.retParam.DSensors;

        if (actuators != null) {
          console.log("actuators : " + actuators.length);
          if (actuators.length > 0) {
            setUpdate(actuators);
          }
        }

        if (sysevents != null) {
          console.log("sysevents : " + sysevents.length);
          if (sysevents.length > 0) {
            for (let i = 0; i < sysevents.length; i++) {
              eventlist.push(sysevents[i]);
              lasteventtime = sysevents[i].EDate;
            }
            setEvents(eventlist);
          }
        }

        if (dsensors != null) {
          console.log("dsensors : " + dsensors.length);
          if (dsensors.length > 0) {
            for (let i = 0; i < dsensors.length; i++) {
              dailysensorlist.push(dsensors[i]);
              lastsensortime = dsensors[i].SDate;
            }
            // console.log("dsensors lastsensortime : " + Date(lastsensortime) + " lenth : " + eventlist.length);
            setDailysensor(dailysensorlist);
            console.log('☆☆☆☆☆차트데이터☆☆☆☆☆')
            console.log(dataChart);
            console.log('☆☆☆☆☆차트데이터☆☆☆☆☆')
            decodeDsensor(dsensors)
          }
        }
        setSensorList(sensors);
      });
    }, readtimemsec);

    return () => clearInterval(interval);
  }, []);

  const getSensorIcon = (sensorType) => {
    switch (sensorType) {
      case 1:
      case 7:
        return (
          <ThermostatIcon sx={{ fontSize: 40, color: red[500] }} />
        )

      case 2:
        return (
          <HygrometerIcon sx={{ fontSize: 40, color: blue[500] }} />
        )

      case 26:
        return (
          <FlowmeterIcon sx={{ fontSize: 40, color: blue[500] }} />
        )

      case 27:
        return (
          <Flowmeter_intergrateIcon sx={{ fontSize: 40, color: blue[500] }} />
        )

      case 29:
        return (
          <WeightmeterIcon sx={{ fontSize: 40, color: indigo[500] }} />
        )

      case 30:
        return (
          <WaterguageIcon sx={{ fontSize: 40, color: blue[500] }} />
        )
      default:
        return "unknownIcon"
    }
  }

  function drawDailyGraph() {
    if (mdailysensorarray.length !== 0) {
      return (
        <Line
          key='dashboardChart'
          data={dataChart}
          options = {
            optionChart
          } />
      )
    }
  }

  function decodeDsensor(d) {
    console.log('데일리센서 디코딩시작');
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

  const cardDashboard = () => {
    return (
      <Card>
        <CardHeader
          title="대시 보드" />
        {drawDailyGraph()}
      </Card>
    )
  }

  const getSensorCard = (sensorInfo) => {
    let sensor = new Sensordevice(sensorInfo);
    return (
      <Card sx={{ minWidth: 200, maxWidth: 200, m: 3 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: blueGrey[300] }} aria-label="sensorIcon">
              {getSensorIcon(sensor.Sensortype)}
            </Avatar>
          }
          title={sensor.Name}
          subheader={sensor.Sensortype}
        />
        <Typography variant="h2" align='center'>{sensor.GetValuestring(false, true)}</Typography>
      </Card>
    )
  }

  return (
    <Box>
      <ThemeProvider theme={theme}>
        <Typography variant="h1">
          홈페이지입니다.
        </Typography>

        <Box className="HomePageElement" id="dashBoard" sx={{ m: 3 }}>
          {cardDashboard()}
        </Box>

        <Box className="HomePageElement" id="sensor" sx={{ m: 3 }}>
          <Card>
            <Typography variant="h5" sx={{ m: 2 }}>센서 보드</Typography>

            <Grid container spacing={1}>
              {sensorList.map((sensor) => (
                <Grid key={sensor.Uid} xs={12} sm={6} md={6} lg={4} xl={4}>
                  {getSensorCard(sensor)}
                </Grid>
              ))}

            </Grid>
          </Card>
        </Box>
      </ThemeProvider>
    </Box>

  );
}