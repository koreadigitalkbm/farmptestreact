import React from "react";
import Sensordevice from "../../commonjs/sensordevice";
import myAppGlobal from "../../myAppGlobal";

function SensorBox(msensorcompact, index) {
  let msensor = new Sensordevice(msensorcompact, myAppGlobal);

  let cname = "sen_con";
  let svalue;
  let iconsrc = "./image/sensor_" + msensor.Sensortype + ".png";

  if (msensor.errorcount > 30) {
    cname = "sen_dis";
    svalue = (
      <div className="sen_result">
        <span className="blinking">{myAppGlobal.langT('LT_MAINPAGE_MAIN_SENSOR_DISCONNECTED')}</span>
      </div>
    );
  } else {
    svalue = (
      <div className="sen_value">
        <label className="value">{msensor.valuestring}</label>
        <label className="unit">{" " + msensor.ValueUnit}</label>
      </div>
    );
  }

  return (
    <div className={cname} key={"senbox" + index}>
      <div className="sen_name">
        <img src={iconsrc} className="icon" /> {msensor.Name}
      </div>
      {svalue}
    </div>
  );
}

const Sensordisplay = (props) => {
  const mysensors = props.sensors;
  console.log("-------------------------Sensordisplay  ---------------------");
  if (mysensors == null) {
    return null;
  }

  return <div className="sensor">{mysensors.map((item, index) => SensorBox(item, index))}</div>;
};

export default Sensordisplay;
