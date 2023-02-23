import React from "react";
import myAppGlobal from "../../myAppGlobal";
import KDUtil from "../../commonjs/kdutil";
import KDDefine from "../../commonjs/kddefine";

function outputdevbox(mydata, index) {
  let ismanual;

  //  console.log("------------------------outputdevbox--------------------mydata : " + mydata.Uid);
  if (myAppGlobal.systeminformations == null) {
    return null;
  }
 
  let actinfo = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, mydata.Uid, myAppGlobal);
  let devicon = "./image/devicon_" + actinfo.DevType + ".png";
  let onofficon = "./image/opstatus_" + mydata.Sat + ".png";

  if (mydata.Opm == KDDefine.OPMode.OPM_Local) {
    ismanual = (
      <div className="man_result">
        <span className="blinking">현장제어중</span>
      </div>
    );
  } else if (mydata.Opm == KDDefine.OPMode.OPM_Manual) {
    ismanual = <div className="out_result">정지(수동)</div>;
  } else {
    ismanual = <div className="out_result">자동제어중</div>;
  }

  return (
    <div className="out_con" key={"outdevi"+index}>
      <div className="out_name"  >
        <img src={devicon} className="icon" /> {actinfo.Name}{" "}
      </div>
      <div className="out_value" >
        <img src={onofficon} className="onoff" />{" "}
      </div>
    {ismanual}
    </div>
  );
}

const  ActuatorDisplay=(props)=> {
  console.log("------------------------ActuatorDisplay--------------------"  );
  const myactuators = props.actuators;

  return <div className="output">{myactuators.map((item, index) => outputdevbox(item, index))}</div>;
}

export default ActuatorDisplay;
