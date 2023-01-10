import { useState, useEffect } from 'react';

import { ThemeProvider } from '@mui/material/styles'
import { Avatar, Box, Button, Card, colors, CardHeader, Grid, Typography } from '@mui/material'
import { DeviceThermostat, Opacity, Water, Waves, Scale, LocalDrink, LibraryAdd } from '@mui/icons-material'

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, } from 'react-chartjs-2'

import muiTheme from './muiTheme';
// import getIcon from "./pages/getIcon"
import myAppGlobal from "../myAppGlobal"
import Sensordevice from "../commonjs/sensordevice";

import { useTranslation } from 'react-i18next';


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
let dailysensorlist = [];

const dataChart = {
  labels: [],
  datasets: [
  ],
};

export default function HomePage() {
  const [mdailysensorarray, setDailysensor] = useState([]);

  const [sensorList, setSensorList] = useState([]);

  const {t } = useTranslation();

  useEffect(() => {
    let interval = null;

    function decodeDsensor(d) {
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

    let readtimemsec = 1000;
    if (myAppGlobal.islocal === false) {
      readtimemsec = 5000;
    }
    setDailysensor(dailysensorlist);
    interval = setInterval(() => {
      myAppGlobal.farmapi.getDeviceStatus(true, true, false, lastsensortime, lasteventtime).then((ret) => {
        let sensors = ret.Sensors;
        let dsensors = ret.retParam.DSensors;


        if (dsensors != null) {
          console.log("dsensors : " + dsensors.length);
          if (dsensors.length > 0) {
            for (const element of dsensors) {
              dailysensorlist.push(element);
              lastsensortime = element.SDate;
            }
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
        return <DeviceThermostat sx={{ fontSize: 40, color: colors.red[500] }} />

      case 2:
        return <Opacity sx={{ fontSize: 40, color: colors.blue[500] }} />

      case 26:
        return <Water sx={{ fontSize: 40, color: colors.blue[500] }} />

      case 27:
        return <Waves sx={{ fontSize: 40, color: colors.blue[500] }} />

      case 29:
        return <Scale sx={{ fontSize: 40, color: colors.indigo[500] }} />

      case 30:
        return <LocalDrink sx={{ fontSize: 40, color: colors.blue[500] }} />

      default:
        return <LibraryAdd sx={{ fontSize: 30, color: colors.common[500] }} />
    }
  }

  function drawDailyGraph() {
    if (mdailysensorarray.length !== 0) {
      return (
        <Line
          key='dashboardChart'
          data={dataChart}
          options={
            optionChart
          } />
      )
    }
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
          title={t("Dashboard")} />
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
            <Avatar sx={{ bgcolor: colors.blueGrey[300] }} aria-label="sensorIcon">
              {getSensorIcon(sensor.Sensortype)}
            </Avatar>
          }
          title={t(sensor.Name)}
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
          {t('Home')}
        </Typography>

        <Box className="HomePageElement" id="dashBoard" sx={{ m: 3 }}>
          {cardDashboard()}
        </Box>

        <Box className="HomePageElement" id="sensor" sx={{ m: 3 }}>
          <Card>
            <Typography variant="h5" sx={{ m: 2 }}>{t("Sensorboard")}</Typography>

            <Grid container spacing={1}>
              {sensorList.map((sensor) => (
                <Grid key={sensor.Uid} item xs={12} sm={6} md={6} lg={4} xl={4}>
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