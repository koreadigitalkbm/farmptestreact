import * as React from 'react';
import { ThemeProvider, styled } from '@mui/material/styles'

import SvgIcon from '@mui/material/SvgIcon';
import { red, blue, blueGrey } from '@mui/material/colors';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'

import muiTheme from './muiTheme';
import DeviceSystemconfig from "../commonjs/devsystemconfig"
import myAppGlobal from "../myAppGlobal"

const theme = muiTheme

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

const sensors = [
  {
    name: '실내온도',
    type: 'Thermometer',
    value: 27,
    unit: '℃',
  },
  {
    name: '실내습도',
    type: 'Hygrometer',
    value: 50,
    unit: '%'
  }
]

export default function HomePage() {

  const getSensorIcon = (sensorType) => {
    switch (sensorType) {
      case "Thermometer":
        return (
          <ThermostatIcon sx={{ fontSize: 40, color: red[500] }} />
        )

      case "Hygrometer":
        return (
          <HygrometerIcon sx={{ fontSize: 40, color: blue[500] }} />
        )

      default:
        return "unknownIcon"
    }
  }

  const getSensorCard = (sensorsInfo) => {
    return (
      <Card sx={{ minWidth: 200, maxWidth: 200, m: 3 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: blueGrey[300] }} aria-label="sensorIcon">
              {getSensorIcon(sensorsInfo.type)}
            </Avatar>
          }
          title={sensorsInfo.name}
          subheader={sensorsInfo.type}
        />
        <Typography variant="h2" align='center'>{sensorsInfo.value} {sensorsInfo.unit}</Typography>
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
          <Card>
            <Typography variant='h5' sx={{ m: 2 }}>대시 보드</Typography>
          </Card>
        </Box>

        <Box className="HomePageElement" id="sensor" sx={{ m: 3 }}>
          <Card>
            <Typography variant="h5" sx={{ m: 2 }}>센서 보드</Typography>

            <Grid container spacing={1}>
              {sensors.map((sensor) => (
                <Grid key={sensor.name} xs={12} sm={6} md={6} lg={4} xl={4}>
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