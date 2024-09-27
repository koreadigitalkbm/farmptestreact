import React from "react";
import myAppGlobal from "../../myAppGlobal";
import KDUtil from "../../commonjs/kdutil";
import KDDefine from "../../commonjs/kddefine";

import AutoModeIcon from '@mui/icons-material/AutoMode';


function outputdevbox(mydata, index) {
  let ismanual;
  let isacton="";

  //  console.log("------------------------outputdevbox--------------------mydata : " + mydata.Uid);
  if (myAppGlobal.systeminformations == null) {
    return null;
  }

  let actinfo = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, mydata.Uid, myAppGlobal);
  if (actinfo == null) {
    return null;
  }
  let devicon = "./image/devicon_" + actinfo.DevType + ".png";
  let onofficon = "./image/opstatus_" + mydata.Sat + ".png";

  if (mydata.Opm == KDDefine.OPMode.OPM_Local) {
    ismanual = (
      <div className="man_result">
        <span className="blinking">{myAppGlobal.langT("LT_MAINPAGE_MAIN_ACTUATOR_FIELDCONTROL")}</span>
      </div>
    );
  } else if (mydata.Opm == KDDefine.OPMode.OPM_Manual) {
    ismanual = <div className="out_result">{myAppGlobal.langT("LT_MAINPAGE_MAIN_ACTUATOR_MANUAL")}</div>;
  } else {
    ismanual = <div className="out_result">{myAppGlobal.langT("LT_MAINPAGE_MAIN_ACTUATOR_AUTOMATIC")}</div>;
  }

  if(mydata.Sat == 201 || mydata.Sat == 202)
  {
    isacton=<AutoModeIcon  sx={{ color: '#FF9860',animation: "spin 4s linear infinite","@keyframes spin": {"0%": {transform: "rotate(0deg)",},"100%": {transform: "rotate(360deg)",}, }, }}/>;
  }
  


  return (
    <div className="out_con" key={"outdevi" + index}>
      <div className="out_namebox">
        <img src={devicon} width={40} height={40} className="icon" />
        {actinfo.Name}
      </div>
      <div className="out_value">
      
        <img src={onofficon} className="onoff" />
        <div className="out_value_on_icon"  style={{ top: -8, left: 42 }} >
        {isacton}
        </div>
      </div>
      {ismanual}
    </div>
  );
}

const ActuatorDisplay = (props) => {
  const myactuators = props.actuators;

  return <div className="output">{myactuators.map((item, index) => outputdevbox(item, index))}</div>;
};

export default ActuatorDisplay;
