
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";


const JukeboxTemperatureM1 = (props) => {
  const copycfg = props.initvalue;

  if(copycfg.Enb ===false)
  {
    return (
      <div className="auto_input">
              <div className="aut_in">
                수동제어 이름 :
                <input type="text" key={"name" + copycfg.Uid} defaultValue={copycfg.Name} name="name" onChange={props.inputonchangeHandler} />
              </div>
            </div>
    );
  }


  return (
    <div className="auto_input">
            <div className="aut_in">
              이름 :
              <input type="text" key={"name" + copycfg.Uid} defaultValue={copycfg.Name} name="name" onChange={props.inputonchangeHandler} />
            </div>

            <div className="aut_in">
              온도 :
              <AutoInputControl  type="number"  initvalue={copycfg} keyname="DTValue" onChange={props.inputallchangeHandler} />
            </div>
            <div className="aut_in">
              낮온도 :
              <AutoInputControl  type="number"  initvalue={copycfg} keyname="NTValue" onChange={props.inputallchangeHandler} />
            </div>
            <div className="aut_in">
              바운드온도 :
              <AutoInputControl  type="number"  initvalue={copycfg} keyname="BValue" onChange={props.inputallchangeHandler} />
            </div>

            <div className="aut_in">
              <AutoInputTimeRange initvalue={copycfg} onChange={props.inputallchangeHandler} />
            </div>
          </div>
  );
};
export default JukeboxTemperatureM1;
