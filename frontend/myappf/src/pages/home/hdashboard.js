import { useState, useEffect, useMemo } from "react";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

import Sensordisplay from "./sensordisplay";
import myAppGlobal from "../../myAppGlobal";
import ActuatorDisplay from "./actuatordisplay";
import Systemeventdisplay from "./systemeventdisplay";
import DashboardChart from "./dashboardchart";

let lasteventtime = 1;
let lastsensortime = 1;
let eventlist = [];
let dailysensorlist = [];


//홈 메인 대시보드
const HDashboard = () => {
  const [msensorsarray, setSensors] = useState([]);
  const [moutdevarray, setActuator] = useState([]);
  const [mevnetarray, setEvents] = useState([]);
  const [mdailysensorarray, setDailysensor] = useState([]);
  const [msensorlasttime, setLasttime] = useState(1);

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
              let isupdateevent=false;
              console.log("sysevents : " + sysevents.length + "  ,lasevttime : " + Date(lasteventtime));

              for (let i = 0; i < sysevents.length; i++) {

                revlasttime = sysevents[i].EDate;
                if(revlasttime > lasteventtime)
                {
                  eventlist.push(sysevents[i]);
                  isupdateevent=true;
                  console.log("r i : " + i+ " eventtime : " +revlasttime  + " lasteventtime: "+lasteventtime);
                }
              }
              

              if (isupdateevent ===true) {
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
          
          if (dsensors != null) {
            console.log("dsensors : " + dsensors.length);
            if (dsensors.length > 0) {
              let recivelasttime;
              let isupdate=false;

              for (let i = 0; i < dsensors.length; i++) {
                recivelasttime = dsensors[i].SDate;
                if(recivelasttime >lastsensortime )
                {
                  dailysensorlist.push(dsensors[i]);
                  isupdate=true;

                }
              }
              if(isupdate === true)
              {
                lastsensortime =  recivelasttime;
                setDailysensor(dailysensorlist);
                setLasttime(recivelasttime);
                console.log("update sensor : " + Date(lastsensortime) + " lenth : " + dailysensorlist.length);
                console.log(dailysensorlist);
              }
              
            }
          }

          
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


  const chartbox = useMemo(() => {
    return <DashboardChart chartdatas ={mdailysensorarray} lasttime= {msensorlasttime} />;
  }, [msensorlasttime]);



  return (
    <div>
      
        {chartbox}
        <Sensordisplay sensors={msensorsarray} />
        <ActuatorDisplay actuators={moutdevarray} />
        {eventbox}
    </div>
  );
};

export default HDashboard;
