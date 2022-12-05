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

        myAppGlobal.farmapi.getsensors(myAppGlobal.islocal).then((ret) => {
          
          let sensors = ret.retMessage;
          setSensors(sensors);
         });

       
      }, 5000);
  
      return () => clearInterval(interval);
    }, []);

    
    return(
        
            <div>
              {Sensordisplay(msensorsarray,true)}

              
              </div>
        
    )
}

export default Sensorpage;