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
        <span className="blinking">{myAppGlobal.langT("LT_MAINPAGE_MAIN_SENSOR_DISCONNECTED")}</span>
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
      <div className="sen_namebox">
        <img width={40} height={40} src={iconsrc} className="icon" />
        {msensor.Name}
      </div>

      {svalue}
    </div>
  );
}

const Sensordisplay = (props) => {
  const mysensors = props.sensors;
  //console.log("-------------------------Sensordisplay  ---------------------");



  if (mysensors == null) {
    return null;
  }

  //센서 순서를 정렬함. 센서 타입번호로 정렬
  let sortsensors=[];
  for(let i=1;i<64;i++)
  {
    for(let j=0;j<mysensors.length;j++)
    {
      let Sensortype = Sensordevice.Getsensortype(mysensors[j].Uid);
      console.log("-------------------------Sensordisplay  ---------------------" +Sensortype);
      if(Sensortype == i)
      {
        sortsensors.push(mysensors[j]);
        break;
      }
    }
    

  }
  

  return <div className="sensor">{sortsensors.map((item, index) => SensorBox(item, index))}</div>;
};

export default Sensordisplay;
