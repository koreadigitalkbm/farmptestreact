import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { CenterFocusWeak } from "@mui/icons-material";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Sensordevice from "../../commonjs/sensordevice";

import myAppGlobal from "../../myAppGlobal";

let chboxlist = [
  { label: "l1", color: "#1976d2", key: "0", checked: false, sensor: null },
  { label: "l2", color: "#2e7d32", key: "1", checked: false, sensor: null },
  { label: "l3", color: "#9c27b0", key: "2", checked: false, sensor: null },
  { label: "l4", color: "#d32f2f", key: "3", checked: false, sensor: null },

  { label: "l4", color: "#ed6c02", key: "4", checked: false, sensor: null },
  { label: "l4", color: "#0288d1", key: "5", checked: false, sensor: null },
  { label: "l4", color: "#ef5350", key: "6", checked: false, sensor: null },
  { label: "l4", color: "#4caf50", key: "7", checked: false, sensor: null },

  { label: "l4", color: "#000010", key: "8", checked: false, sensor: null },
  { label: "l4", color: "#000010", key: "9", checked: false, sensor: null },
  { label: "l4", color: "#000010", key: "10", checked: false, sensor: null },
  { label: "l4", color: "#000010", key: "11", checked: false, sensor: null },

  { label: "l4", color: "#000010", key: "12", checked: false, sensor: null },
  { label: "l4", color: "#000010", key: "13", checked: false, sensor: null },
  { label: "l4", color: "#000010", key: "14", checked: false, sensor: null },
  { label: "l4", color: "#000010", key: "15", checked: false, sensor: null },
];

let dataChart = {
  labels: [],
  datasets: [],
};

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, zoomPlugin);

const zoomOptions = {
  action: [
    {
      name: "Reset zoom",
      handler(chart) {
        chart.resetZoom();
      },
    },
  ],
  limits: {},
  pan: {
    enabled: true,
  },
  zoom: {
    wheel: {
      enabled: true,
    },
    pinch: {
      enabled: true,
    },
    mode: "xy",
  },
};

let optionChart = {
  plugins: {
    legend: {
      display: false,
    },
    zoom: zoomOptions,
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      position: "bottom",
      type: "time",
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

function Drawchart(sensorlistforchart) {
  dataChart = {
    labels: [],
    datasets: [],
  };

  console.log("Drawchart sensorlistforchart.length: " + sensorlistforchart.length);

  let isleft = false;
  let isright = false;
  for (let i = 0; i < sensorlistforchart.length; i++) {
    if (chboxlist[i].checked === true) {
      sensorlistforchart[i].yAxisID = "y-left";

      if (isleft === false) {
        isleft = true;
        const msensor = Sensordevice.createSensor(sensorlistforchart[i].stype, sensorlistforchart[i].nodeid, sensorlistforchart[i].channel, myAppGlobal);
        optionChart.scales["y-left"].title.text = msensor.Name + "(" + msensor.ValueUnit + ")";
        optionChart.scales["y-left"].title.color = chboxlist[i].color;
      } else if (isright === false && isleft === true) {
        isright = true;
        const msensor = Sensordevice.createSensor(sensorlistforchart[i].stype, sensorlistforchart[i].nodeid, sensorlistforchart[i].channel, myAppGlobal);
        optionChart.scales["y-right"].title.text = msensor.Name + "(" + msensor.ValueUnit + ")";
        optionChart.scales["y-right"].title.color = chboxlist[i].color;
        sensorlistforchart[i].yAxisID = "y-right";
        optionChart.scales["y-right"].display = true;
      }

      //console.log(optionChart);

      sensorlistforchart[i].borderColor = chboxlist[i].color;
      dataChart.datasets.push(sensorlistforchart[i]);
    }
  }

  //차트가 한개라면 오른쪽 축 삭제
  if (isright === false) {
    optionChart.scales["y-right"].display = false;
  }
}

const SensorDataChart = (props) => {
  const [bcheckeds, setCheckeds] = useState(true);

  const sensorchartdatas = props.datas;

  const chartRef = React.useRef(null);

  const resetZoomBtn = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  };
  console.log("------------------------SensorDataChart-------------------- length:" + props.datas.length);

  if (sensorchartdatas.length === 0) {
    return (
      <Typography variant="body2" fontSize="large" color="secondary">
        {myAppGlobal.langT("LT_DATAPAGE_NOSENSORDATA")}
      </Typography>
    );
  }

  const handleChange = (event) => {
    console.log("------------------------handleChange--------------------event : " + event.target.name + ",ch:" + event.target.checked);
    chboxlist[event.target.name].checked = event.target.checked;
    //그냥 화면 갱신
    setCheckeds(!bcheckeds);
  };

  Drawchart(sensorchartdatas);

  let chlist = [];

  for (let i = 0; i < sensorchartdatas.length; i++) {
    const newsensor = Sensordevice.createSensor(sensorchartdatas[i].stype, sensorchartdatas[i].nodeid, sensorchartdatas[i].channel, myAppGlobal);
    chboxlist[i].label = newsensor.Name;
    chboxlist[i].sensor = newsensor;

    const chb = (
      <FormControlLabel
        key={"keylabel" + chboxlist[i].key}
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
        <Grid item xs={8} minHeight={300}>
          <Line ref={chartRef} key="sensordataChart" data={dataChart} options={optionChart} redraw={true} />
        </Grid>

        <Grid item xs={0} minWidth={48}>
          <React.Fragment>
            <Grid item xs={0}>
              <IconButton onClick={resetZoomBtn}><CenterFocusWeak /></IconButton>
            </Grid>
            <Grid item xs={0}>
              <IconButton onClick={resetZoomBtn}><BookmarkAddedIcon /></IconButton>
            </Grid>
            <Grid item xs={0}>
              <IconButton onClick={resetZoomBtn}><ZoomInIcon /></IconButton>
            </Grid>
          </React.Fragment>
        </Grid>

        <Grid item xs={3} padding={1}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              p: 1,
              m: 1,
              bgcolor: "#eceff1",
              borderRadius: 1,
            }}
          >
            <FormLabel component="legend">
              <Typography variant="body2" color="textSecondary">
                {myAppGlobal.langT("LT_DATAPAGE_SENSORCHART_CHECK")}
              </Typography>
            </FormLabel>

            {chlist}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SensorDataChart;
