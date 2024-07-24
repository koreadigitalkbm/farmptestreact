import React from "react";
import KDUtil from "../../commonjs/kdutil";
import KDDefine from "../../commonjs/kddefine";
import Box from "@mui/material/Box";
import AutoControlconfig from "../../commonjs/autocontrolconfig";
import JukeboxTemperatureM1 from "./jukeboxtemperature";
import JukeboxWatersupplyM1 from "./jukeboxwatersupply";
import JukeboxMultiLED from "./jukeboxmultiled";
import MiniHouseLEDOnOFF from "./minihouseledonoff";

import JukeboxAircirculation from "./jukeboxaircirculation";
import MinihouseScreen from "./minihousescreen";
import MinihouseWindows from "./minihousewindows";
import MiniHouseAircirculation from "./minihouseaircirculation";
import MiniHouseAirventilation from "./minihouseairventilation";

import MiniHouseAirhumidity from "./minihouseairhumidity";


import JukeboxCamera from "./jukeboxcamera";
import JukeboxAirhumidity from "./jukeboxairhumidity";
import JukeboxCo2Supply from "./jukeboxco2supply";
import JukeboxNutrientSupply from "./jukeboxnuient";
import JukeboxPIDTemperature from "./jukeboxpidtemperature";
import JukeboxPIDAirhumidity from "./jukeboxpidhumidity";

export default function Autocontroleditbox(props) {
  const orgcfg = props.myconfig;
  const copycfg = AutoControlconfig.deepcopy(orgcfg);
  const saveconfig = props.savecfg;
  //console.log("Autocontroleditbox  name : " + copycfg.Name);

  function isconfigchage() {
    const ischange = AutoControlconfig.cmpObject(orgcfg, copycfg);
//    console.log("isconfigchage  ischange:" + ischange);
    return ischange;
  }

  function inputallchangeHandler(e) {
    switch (e.target.type) {
      case "time":
        copycfg[e.target.name] = KDUtil.timeTosec(e.target.value);
        break;
      default:
        copycfg[e.target.name] = e.target.value;
        break;
    }

    return AutoControlconfig.cmpObject(orgcfg, copycfg);
  }

  function Msavecfg() {
    saveconfig(copycfg, null);
  }

  const formAutoContent = () => {
    console.log("formAutoContent Cat: " + copycfg.Cat);
    switch (copycfg.Cat) {

      
      
      case KDDefine.AUTOCategory.ACT_AIR_CIRU_TIMER_FOR_MINIHOUSE:
        return <MiniHouseAircirculation keyname="aricirc" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_HEATER_HUMIDITY_FOR_MINIHOUSE:
        return <MiniHouseAirhumidity keyname="airhumidity" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_AIR_VENT_CO2_HUMIDITY_FOR_MINIHOUSE:
        return <MiniHouseAirventilation keyname="aricirc" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ATC_LED_ONOFF:
        return <MiniHouseLEDOnOFF keyname="multiled" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_WINDOW_FOR_MINIHOUSE:
        return <MinihouseWindows keyname="miniwindows" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_SCREEN_FOR_MINIHOUSE:
        return <MinihouseScreen keyname="miniscreen" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      
        case KDDefine.AUTOCategory.ACT_PID_HEATER_HUMIDITY_FOR_FJBOX:
        return <JukeboxPIDAirhumidity keyname="pidtempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_PID_TEMP_CONTROL_FOR_FJBOX:
        return <JukeboxPIDTemperature keyname="pidtempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
        return <JukeboxTemperatureM1 keyname="tempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ATC_WATER:
        return <JukeboxWatersupplyM1 keyname="watersuply" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX:
        return <JukeboxMultiLED keyname="multiled" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX:
        return <JukeboxAircirculation keyname="aricirc" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_CAMERA_FJBOX:
        return <JukeboxCamera keyname="camera" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_HEATER_HUMIDITY_FOR_FJBOX:
        return <JukeboxAirhumidity keyname="airhumidity" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_AIR_CO2_FOR_FJBOX:
        return <JukeboxCo2Supply keyname="co2supply" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
      case KDDefine.AUTOCategory.ACT_NUTRIENT_SOL3_FOR_FJBOX:
        return <JukeboxNutrientSupply keyname="netrient" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;

      default:
        return <JukeboxTemperatureM1 keyname="tempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} savecfg={Msavecfg} ischangehandler={isconfigchage} />;
    }
  };

  return <Box sx={{ backgroundColor: "#f1f8e9" }}>{formAutoContent()}</Box>;
}
