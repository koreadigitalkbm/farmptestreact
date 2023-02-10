import React from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import { Stack, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";



const JukeboxAircirculation = (props) => {
  const [avchecked, setAVChecked] = React.useState(false);
  const [manualactname, setmanualactname] = React.useState("selitem0");
  const [manualontimesec, setmanualontimesec] = React.useState(600);
  const copycfg = props.initvalue;

  const inputchangeHandler = (event) => {

    console.log("inputchangeHandler event.target.name:" +event.target.name);


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
      default:
        break;
    }
  };

  function manualonoff(isSetOn) {
    const actindex = manualactname === "selitem0" ? 0 : 1;
    const actuid = copycfg.Actlist[actindex];
    console.log("manualonoff name:  manualontimesec:" + manualontimesec + " manualactname:" + manualactname + ",actuid : " + actuid);
    let opcmd = new ActuatorOperation(actuid, isSetOn, manualontimesec);
    myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => {});
  }

  ///수동제어
  if (copycfg.Enb === false) {
    const actitems=["환기팬,밸브"];
    
    return (
      <Stack spacing={1}>
        <AutoManualActuator   initvalue={manualactname}  items={actitems} changehandler={inputchangeHandler}  />
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
          <AutoInputTimeRange initvalue={copycfg}  dispstring ="작동시간 설정:"onChange={props.inputallchangeHandler} />
        </Stack>
        <Stack direction="row" alignItems="flex-end">
          <Typography> 켜짐시간 : </Typography>
          <AutoInputControl type="number" initvalue={copycfg.DOnTime} unit="초" keyname="DOnTime" onChange={props.inputallchangeHandler} />
          <Typography> 꺼짐시간 : </Typography>
          <AutoInputControl type="number" initvalue={copycfg.DOffTime} unit="초" keyname="DOffTime" onChange={props.inputallchangeHandler} />
        </Stack>
      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="flex-end">
        <Typography>내부 CO2 센서값 </Typography>
        <AutoInputControl type="number" initvalue={copycfg.NTValue} unit="ppm" keyname="NTValue" onChange={props.inputallchangeHandler} />
        <Typography> 이하로 낮아질경우, 또는 </Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        <Typography> 습도센서 값 </Typography>
        <AutoInputControl type="number" initvalue={copycfg.DTValue} unit="%" keyname="DTValue" onChange={props.inputallchangeHandler} />
        <Typography> 이상 높아질경우 환기팬, 환기밸브를 작동시킵니다.</Typography>
      </Stack>
      <Box sx={{bgcolor: '#fef0e0', boxShadow: 1, borderRadius: 2, p: 2, }}>
      <FormControlLabel control={<Switch checked={avchecked} onChange={inputchangeHandler} name="avencheck" />} label=" 고급설정" />
      
      {avchecked === true ? <AdvenceSetting  initvalue={copycfg} inputallchangeHandler={props.inputallchangeHandler} /> : null}
      </Box>
      
    </Stack>
  );
};
export default JukeboxAircirculation;
