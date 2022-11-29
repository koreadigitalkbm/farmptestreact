import React, { useState, useEffect } from "react";
import Sensordisplay from "../sensordisplay";
import IndoorFarmAPI from "../indoorfarmapi";
import myAppGlobal from "../myAppGlobal";




const Sensorpage = () => {


    const [msensorsarray, setSensors] = useState([]);
  
    console.log("-------------------------Sensorpage  ---------------------");

    useEffect(() => {
      let interval = null;
  
      console.log("-------------------------Sensorpage useEffect ---------------------");

      interval = setInterval(() => {
        myAppGlobal.farmapi.getsensordatas().then((sensors) => {
          setSensors(sensors);
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);

    
    return(
        
            <div>
              {Sensordisplay(msensorsarray,true)}

              
              </div>
        
    )
}

export default Sensorpage;