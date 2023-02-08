import { useState, useEffect, useMemo } from "react";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

import Sensordisplay from "./sensordisplay";
import myAppGlobal from "../../myAppGlobal";
import Outputdevicedisplay from "./outputdevicedisplay";
import Systemeventdisplay from "./systemeventdisplay";

let lasteventtime = 1;
let lastsensortime = 1;
let eventlist = [];
let dailysensorlist = [];

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

//홈 메인 대시보드
const HDashboard = () => {
  const [msensorsarray, setSensors] = useState([]);
  const [moutdevarray, setActuator] = useState([]);
  const [mevnetarray, setEvents] = useState([]);
  const [mdailysensorarray, setDailysensor] = useState([]);

  console.log("-------------------------HDashboard  ---------------------");

  useEffect(() => {
    //aws 접속이면 5초에 한번만 읽자 머니 나가니까.
    let readtimemsec = 1000;

    console.log("-------------------------HDashboard  useEffect---------------------issetreq:");
    //setEvents(eventlist);

    if (myAppGlobal.islocal === false || myAppGlobal.islocal === "false") {
      readtimemsec = 3000;
    }

    const interval = setInterval(() => {
      myAppGlobal.farmapi.getDeviceStatus(true, true, false, lastsensortime, lasteventtime).then((ret) => {
        //console.log(ret);

        if (ret.IsOK == true) {
          let sensors = ret.Sensors;
          let actuators = ret.Outputs;
          let sysevents = ret.retParam.DEvents;
          let dsensors = ret.retParam.DSensors;

          if (sensors != null) {
            console.log("sensors length:" + sensors.length);
            if (sensors.length > 0) {
              setSensors(sensors);
            }
          }

          if (actuators != null) {
            console.log("actuators : " + actuators.length);
            if (actuators.length > 0) {
              setActuator(actuators);
            }
          }

          if (sysevents != null) {
            if (sysevents.length > 0) {
              let revlasttime;
              console.log("sysevents : " + sysevents.length + "  ,lasevttime : " + Date(lasteventtime));

              for (let i = 0; i < sysevents.length; i++) {
                eventlist.push(sysevents[i]);
                revlasttime = sysevents[i].EDate;
                console.log("r i : " + i+ " time : " + Date(revlasttime) );
              }
              

              if (lasteventtime !== revlasttime) {
                lasteventtime = revlasttime;
                console.log("update event : " + Date(lasteventtime) + " lenth : " + eventlist.length);
                let revlist = [];
                for (let i =0; i <eventlist.length; i++) {
                  revlist.push(eventlist[eventlist.length-i-1]);
                }

                setEvents(revlist);
              }
            }
          }
          /*
          if (dsensors != null) {
            console.log("dsensors : " + dsensors.length);
            if (dsensors.length > 0) {
              for (let i = 0; i < dsensors.length; i++) {
                dailysensorlist.push(dsensors[i]);
                lastsensortime = dsensors[i].SDate;
              }
              //console.log(dailysensorlist);
              // console.log("dsensors lastsensortime : " + Date(lastsensortime) + " lenth : " + eventlist.length);
              // setDailysensor(dailysensorlist);
            }
          }

          */
        }
      });
    }, readtimemsec);

    console.log("-------------------------HDashboard  finish--------------------- out:" + interval);
    return () => clearInterval(interval);
  }, []);

  //이벤트가 변경될때만 렌더링되도록
  const eventbox = useMemo(() => {
    return <Systemeventdisplay mevtlist={mevnetarray} />;
  }, [mevnetarray]);

  return (
    <div>
      <div>
        <Line width="500" height="100" key="dashboardChart" data={dataChart} options={optionChart} />
      </div>

      <div>
        <Sensordisplay msensorsarray={msensorsarray} />
        <div>{Outputdevicedisplay(moutdevarray, false)}</div>
      </div>
      <div>{eventbox}</div>
    </div>
  );
};

export default HDashboard;
