import React from "react";

import myAppGlobal from "../../myAppGlobal";
import KDUtil from "../../commonjs/kdutil";


function outputdevbox(mydata, isonlystatus, index) {
  let ismanual;

//  console.log("------------------------outputdevbox--------------------mydata : " + mydata.Uid);
  if(myAppGlobal.systeminformations == null)
  {
    return null;
  }

  let actinfo = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, mydata.Uid, myAppGlobal);
  let devicon = "./image/devicon_" + actinfo.DevType + ".png";
  let onofficon = "./image/opstatus_" + mydata.Sat + ".png";

  

  if (mydata.Opm === "LM") {
    ismanual = (
      <div className="man_result">
        <span className="blinking">현장제어중</span>
      </div>
    );
  } else if (mydata.Opm == "MA") {
    if (isonlystatus == true) {
      ismanual = <div className="out_result">정지(수동)</div>;
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

  console.log("------------------------Outputdevicedisplay--------------------isonlystatus : " + isonlystatus);

  return <div className="output">
    
    {moutdevarray.map((localState, index) => outputdevbox(localState, isonlystatus, index))}
    
    </div>;
}

export default Outputdevicedisplay;
