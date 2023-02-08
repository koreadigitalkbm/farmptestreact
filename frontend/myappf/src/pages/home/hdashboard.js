import { useState, useEffect } from "react";
import Sensordisplay from "./sensordisplay";
import myAppGlobal from "../../myAppGlobal";
import Outputdevicedisplay from "./outputdevicedisplay";
import systemeventdisplay from "./systemeventdisplay";


let lasteventtime = 1;
let lastsensortime = 1;
let eventlist = [];
let dailysensorlist = [];
//홈 메인 대시보드 
const HDashboard = () => {
  const [msensorsarray, setSensors] = useState([]);
  const [moutdevarray, setUpdate] = useState([]);
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
          console.log("sensors length:" + sensors.length);

          setSensors(sensors);
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

              console.log("sysevents lasevttime : " + Date(lasteventtime) + " lenth : " + eventlist.length);
              let revlist = [];
              for (let i = eventlist.length - 1; i >= 0; i--) {
                revlist.push(eventlist[i]);
              }

              setEvents(revlist);
            }
          }

          if (dsensors != null) {
            console.log("dsensors : " + dsensors.length);
            if (dsensors.length > 0) {
              for (let i = 0; i < dsensors.length; i++) {
                dailysensorlist.push(dsensors[i]);
                lastsensortime = dsensors[i].SDate;
              }
              console.log(dailysensorlist);
              // console.log("dsensors lastsensortime : " + Date(lastsensortime) + " lenth : " + eventlist.length);
              // setDailysensor(dailysensorlist);
            }
          }
        }
      });
    }, readtimemsec);

    console.log("-------------------------HDashboard  finish--------------------- out:" + interval);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>{Sensordisplay(msensorsarray, true)}</div>
      <div>{Outputdevicedisplay(moutdevarray, true)}</div>
      <div>{systemeventdisplay(mevnetarray, false)}</div>
    </div>
  );
};

export default HDashboard;
