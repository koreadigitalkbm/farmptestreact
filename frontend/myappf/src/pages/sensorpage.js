import { useState, useEffect } from "react";
import Sensordisplay from "../sensordisplay";
import myAppGlobal from "../myAppGlobal";
import Outputdevicedisplay from "../outputdevicedisplay";
import systemeventdisplay from "../systemeventdisplay";

const Sensorpage = () => {
  const [msensorsarray, setSensors] = useState([]);
  const [moutdevarray, setUpdate] = useState([]);
  const [mevnetarray, setEvents] = useState([]);
  //console.log("-------------------------Sensorpage  ---------------------");

  useEffect(() => {
    let interval = null;
    //aws 접속이면 5초에 한번만 읽자 머니 나가니까.
    let readtimemsec = 1000;
    if (myAppGlobal.islocal == false) {
      readtimemsec = 2000;
    }
    interval = setInterval(() => {
      myAppGlobal.farmapi.getDeviceStatus().then((ret) => {
        let sensors = ret.Sensors;
        let actuators = ret.Outputs;
        let sysevents = ret.retParam.DEvents;
        console.log("sensors length:" + sensors.length);

        setSensors(sensors);
        if(actuators !=null)
        {
          console.log("actuators : " + actuators.length);
          if(actuators.length >0)
          {
            setUpdate(actuators);
          }
        }
        if(sysevents !=null)
        {
          console.log("sysevents : " + sysevents.length);
          if(sysevents.length >0)
          {
            setEvents(sysevents);
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
