import { useState, useEffect } from "react";
import Sensordisplay from "../sensordisplay";
import myAppGlobal from "../myAppGlobal";
import Outputdevicedisplay from "../outputdevicedisplay";
import systemeventdisplay from "../systemeventdisplay";

let lasteventtime = 1;
let lastsensortime = 1;
let eventlist = [];
const Sensorpage = () => {
  const [msensorsarray, setSensors] = useState([]);
  const [moutdevarray, setUpdate] = useState([]);
  const [mevnetarray, setEvents] = useState([]);
  console.log("-------------------------Sensorpage  ---------------------");

  useEffect(() => {
    let interval = null;
    //aws 접속이면 5초에 한번만 읽자 머니 나가니까.
    let readtimemsec = 1000;
    console.log("-------------------------Sensorpage  useEffect---------------------");
    setEvents(eventlist);
    
    if (myAppGlobal.islocal == false) {
      readtimemsec = 2000;
    }
    interval = setInterval(() => {
      myAppGlobal.farmapi.getDeviceStatus(true, true, false, lastsensortime, lasteventtime).then((ret) => {
        let sensors = ret.Sensors;
        let actuators = ret.Outputs;
        let sysevents = ret.retParam.DEvents;
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

            console.log("sysevents lasevttime : " + lasteventtime + " lenth : " + eventlist.length);
            setEvents(eventlist);
          }
        }
      });
    }, readtimemsec);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>{Sensordisplay(msensorsarray, true)}</div>
      <div>{Outputdevicedisplay(moutdevarray, false)}</div>
      <div>{systemeventdisplay(mevnetarray, false)}</div>
    </div>
  );
};

export default Sensorpage;
