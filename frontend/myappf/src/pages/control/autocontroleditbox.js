import React from "react";

import KDUtil from "../../commonjs/kdutil";
import KDDefine from "../../commonjs/kddefine";

import JukeboxTemperatureM1 from "./jukeboxtemperature";
import JukeboxWatersupplyM1 from "./jukeboxwatersupply";
import JukeboxMultiLED from "./jukeboxmultiled";
import JukeboxAircirculation from "./jukeboxaircirculation";
import JukeboxCamera from "./jukeboxcamera";

export default function Autocontroleditbox(props) {
  const copycfg = props.myconfig;

  console.log("Autocontroleditbox  name : " + copycfg.Name);

  function inputallchangeHandler(e) {
    //console.log("inputallchangeHandler name: " + e.target.name + " type : " + e.target.type + " value:"+e.target.value);
    switch (e.target.type) {
      case "time":
        copycfg[e.target.name] = KDUtil.timeTosec(e.target.value);
        break;
      default:
        copycfg[e.target.name] = e.target.value;
        break;
    }
  }

  const formAutoContent = () => {
    console.log("formAutoContent Cat: " + copycfg.Cat);
    switch (copycfg.Cat) {
      case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
        return <JukeboxTemperatureM1 keyname="tempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} />;
      case KDDefine.AUTOCategory.ATC_WATER:
        return <JukeboxWatersupplyM1 keyname="watersuply" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} />;
      case KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX:
        return <JukeboxMultiLED keyname="multiled" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} />;
      case KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX:
        return <JukeboxAircirculation keyname="aricirc" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} />;
        case KDDefine.AUTOCategory.ACT_CAMERA_FJBOX:
          return <JukeboxCamera keyname="camera" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} />;
        
      default:
        return <JukeboxTemperatureM1 keyname="tempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} />;
    }
  };

  return (
    <div>
      <div className="auto_control">
        <div className="autosetupinnerbox">{formAutoContent()}</div>
      </div>
    </div>
  );
}
