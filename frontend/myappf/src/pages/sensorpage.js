import React, { useState, useEffect } from "react";
import Sensordisplay from "../sensordisplay";
import IndoorFarmAPI from "../indoorfarmapi";
import myAppGlobal from "../myAppGlobal";

const Sensorpage = () => {
  const [msensorsarray, setSensors] = useState([]);

  //console.log("-------------------------Sensorpage  ---------------------");

  useEffect(() => {
    let interval = null;

    //aws 접속이면 5초에 한번만 읽자 머니 나가니까.
    let readtimemsec = 1000;
    if (myAppGlobal.islocal == false) {
      readtimemsec = 5000;
    }
    interval = setInterval(() => {
      myAppGlobal.farmapi.getsensors(myAppGlobal.islocal).then((ret) => {
        let sensors = ret.retMessage;
        setSensors(sensors);
      });
    }, readtimemsec);

    return () => clearInterval(interval);
  }, []);

  return <div>{Sensordisplay(msensorsarray, true)}</div>;
};

export default Sensorpage;
