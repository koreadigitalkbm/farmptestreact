import React from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import { Button, Stack, Typography } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoControlUtil from "../../commonjs/autocontrolutil";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";

const JukeboxWatersupplyM1 = (props) => {
  const copycfg = props.initvalue;
  const [avchecked, setAVChecked] = React.useState(false);
  const [manualactname, setmanualactname] = React.useState("selitem0");
  const [manualontimesec, setmanualontimesec] = React.useState(600);

  let dayintervaltime = AutoControlUtil.Getintervaltimeminute(copycfg.DOnTime, copycfg.DOffTime);
  let nightintervaltime = AutoControlUtil.Getintervaltimeminute(copycfg.NOnTime, copycfg.NOffTime);

  console.log("JukeboxWatersupplyM1  DOnTime:" + copycfg.DOnTime + " DOffTime:" + copycfg.DOffTime);

  const inputchangeHandler = (event) => {
    let offtimesec = 0;
    switch (event.target.name) {
      case "avencheck":
        setAVChecked(event.target.checked);
        break;
      case "devselgroup":
        setmanualactname(event.target.value);
        break;
      case "ontimesec":
        setmanualontimesec(event.target.value);
        break;
      case "DOnTime":
        offtimesec = dayintervaltime * 60 - event.target.value;
        if (offtimesec > 0) {
          copycfg.DOnTime = event.target.value;
          copycfg.DOffTime = offtimesec;
        }
        break;
      case "DOffTime":
        dayintervaltime = event.target.value;
        copycfg.DOffTime = event.target.value * 60 - copycfg.DOnTime;
        break;

      case "NOnTime":
        offtimesec = nightintervaltime * 60 - event.target.value;
        if (offtimesec > 0) {
          copycfg.NOnTime = event.target.value;
          copycfg.NOffTime = offtimesec;
        }
        break;
      case "NOffTime":
        nightintervaltime = event.target.value;
        copycfg.NOffTime = event.target.value * 60 - copycfg.DOnTime;
        break;

      default:
        break;
    }
    console.log("inputchangeHandler  DOnTime:" + copycfg.DOnTime + " DOffTime:" + copycfg.DOffTime + " dayintervaltime:" + dayintervaltime);
  };

  function manualonoff(isSetOn) {
    const actindex = manualactname === "selitem0" ? 0 : 1;
    const actuid = copycfg.Actlist[actindex];
    let opcmd = new ActuatorOperation(actuid, isSetOn, manualontimesec);
    myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => {});
  }

  ///수동제어
  if (copycfg.Enb === false) {
    const actitems = ["관수펌프"];
    return (
      <Stack spacing={1}>
        <AutoManualActuator initvalue={manualactname} items={actitems} changehandler={inputchangeHandler} />

        <AutoManualCommon initvalue={manualontimesec} inputchangeHandler={inputchangeHandler} manualHandler={manualonoff} />
      </Stack>
    );
  }

  //자동 고급설정 따로
  const AdvenceSetting = (props) => {
    const copycfg = props.initvalue;
    return (
      <Stack spacing={1}>
        <Stack direction="row" alignItems="flex-end">
          <AutoInputTimeRange initvalue={copycfg} onChange={props.inputallchangeHandler} />
        </Stack>
      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="flex-end">
        <Typography>물을 주간(9시~16시)에는</Typography>
        <AutoInputControl type="number" initvalue={dayintervaltime} unit="분" keyname="DOffTime" onChange={inputchangeHandler} />
        <Typography>간격으로 </Typography>
        <AutoInputControl type="number" initvalue={copycfg.DOnTime} unit="초간" keyname="DOnTime" onChange={inputchangeHandler} />
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        <Typography> 공급하고 야간에는</Typography>
        <AutoInputControl type="number" initvalue={nightintervaltime} unit="분" keyname="NOffTime" onChange={inputchangeHandler} />
        <Typography>간격으로 </Typography>
        <AutoInputControl type="number" initvalue={copycfg.NOnTime} unit="초간" keyname="NOnTime" onChange={inputchangeHandler} />
        <Typography>공급 합니다.</Typography>
      </Stack>

      <FormControlLabel control={<Switch checked={avchecked} onChange={inputchangeHandler} name="avencheck" />} label="고급설정" />

      {avchecked === true ? <AdvenceSetting initvalue={copycfg} inputallchangeHandler={props.inputallchangeHandler} /> : null}
    </Stack>
  );
};
export default JukeboxWatersupplyM1;
