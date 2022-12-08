import React, { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";
import Outputdevicedisplay from "../outputdevicedisplay";


const Devicepage = () => {
  const [moutdevarray, setUpdate] = useState([]);
  
  useEffect(() => {
    let interval = null;

    //aws 접속이면 5초에 한번만 읽자 머니 나가니까.
    let readtimemsec = 1000;
    if (myAppGlobal.islocal == false) {
      readtimemsec = 2000;
    }
    interval = setInterval(() => {
      myAppGlobal.farmapi.getDeviceStatus().then((ret) => {
        let actuators = ret.Outputs;
        if(actuators !=null)
        {
          console.log("actuators : " + actuators.length);
          if(actuators.length >0)
          {
            setUpdate(actuators);
          }
        }
        
        
      });
    }, readtimemsec);

    return () => clearInterval(interval);
  }, []);


  return (
    <div>
      <h2>device Page.. </h2>
      <div></div>
      <div>
        <button className="" name="on" onClick={actoperation}>
          {" "}
          구동기 on {" "}
        </button>
      </div>
      <div>
        <button className="" name="off" onClick={actoperation}>
          {" "}
          구동기 off {" "}
        </button>
      </div>
      
      <div>{Outputdevicedisplay(moutdevarray, false)}</div>

    </div>
  );
  

  
function actoperation(e) {
  console.log("actoperation : " + e.target.name);
 
  
}


};

export default Devicepage;
