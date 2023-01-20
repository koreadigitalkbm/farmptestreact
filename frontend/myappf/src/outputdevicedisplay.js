import React from "react";

import myAppGlobal from "./myAppGlobal";
import KDUtil from "./commonjs/kdutil";
import KDDefine from "./commonjs/kddefine";
import ActuatorOperation from "./commonjs/actuatoroperation";

function manualonoff(actuid, onoff) {
 let opcmd = new ActuatorOperation(actuid, onoff,30);
  

  myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => {});
}

function outputdevbox(mydata, isonlystatus, index) {
  let ismanual;

  //console.log("------------------------outputdevbox--------------------mydata : " + mydata.Uid);

  let actinfo = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, mydata.Uid);
  let devicon = "./image/devicon_" + actinfo.HWType + ".png";
  let onofficon = "./image/opstatus_" + mydata.Sat + ".png";

  if (mydata.Opm === "LM") {
    ismanual = (
      <div className="man_result">
        <span className="blinking">현장제어중</span>
      </div>
    );
  } else if (mydata.Opm == "MA") {
    if (isonlystatus == true) {
      ismanual = <div className="out_result">수동제어</div>;
    } else {
      ismanual = (
        <div className="out_button">
          <button className="button_on" onClick={() => manualonoff(mydata.Uid, true)}>
            수동 On
          </button>{" "}
          <button className="button_off" onClick={() => manualonoff(mydata.Uid, false)}>
            수동 Off
          </button>
        </div>
      );
    }
  } else {
    ismanual = <div className="out_result">자동제어중</div>;
  }

  return (
    <div className="out_con" key={index}>
      <div className="out_name">
        {" "}
        <img src={devicon} className="icon" /> {actinfo.Name}{" "}
      </div>
      <div className="out_value">
        {" "}
        <img src={onofficon} className="onoff" />{" "}
      </div>
      {ismanual}
    </div>
  );
}

function Outputdevicedisplay(moutdevarray, isonlystatus) {
  return <div className="output">
    
    {moutdevarray.map((localState, index) => outputdevbox(localState, isonlystatus, index))}
    
    </div>;
}

export default Outputdevicedisplay;
