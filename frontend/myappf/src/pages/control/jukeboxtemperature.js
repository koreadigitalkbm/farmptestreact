import React from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import { Button, Stack,  Typography } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";

const JukeboxTemperatureM1 = (props) => {
  const [avchecked, setAVChecked] = React.useState(false);
  const [manualactname, setmanualactname] = React.useState("heater");
  const [manualontimesec, setmanualontimesec] = React.useState(600);
  const copycfg = props.initvalue;

  const handleChange = (event) => {
    setAVChecked(event.target.checked);
  };

  const handleChangeAct = (event) => {
    setmanualactname(event.target.value);
  };

  const inputchangeHandler = (event) => {
    setmanualontimesec(event.target.value);
  };

  function manualonoff(ontimesec) {
    const actindex = manualactname === "heater" ? 0 : 1;
    const actuid = copycfg.Actlist[actindex];
    const onoff = ontimesec > 0 ? true : false;
    console.log("manualonoff name:  ontimesec:" + ontimesec + " manualactname:" + manualactname + ",actuid : " + actuid);
    let opcmd = new ActuatorOperation(actuid, onoff, ontimesec);
    myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => {});
  }

  ///수동제어
  if (copycfg.Enb === false) {
    return (
      <Stack spacing={1}>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">구동장비를 선택하세요.</FormLabel>
          <RadioGroup aria-labelledby="demo-controlled-radio-buttons-group" name="controlled-radio-buttons-group" value={manualactname} onChange={handleChangeAct}>
            <FormControlLabel value="heater" control={<Radio />} label="난방기(히터)" />
            <FormControlLabel value="cooler" control={<Radio />} label="냉방기(쿨러)" />
          </RadioGroup>
        </FormControl>

        <Stack direction="row" alignItems="flex-end">
          <Typography> 켜짐시간 : </Typography>
          <AutoInputControl type="number" initvalue={manualontimesec} unit="초" keyname="ontimesec" onChange={inputchangeHandler} />
        </Stack>
        <Button type="submit" variant="contained" onClick={() => manualonoff(manualontimesec)}>
          켜짐
        </Button>
        <Button type="submit" variant="contained" onClick={() => manualonoff(0)}>
          꺼짐
        </Button>
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
        <Stack direction="row" alignItems="flex-end">
          <Typography> 온도조절간격 : </Typography>
          <AutoInputControl type="number" initvalue={copycfg.BValue} unit="℃" keyname="BValue" onChange={props.inputallchangeHandler} />
        </Stack>
      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="flex-end">
        <Typography>내부 온도를 주간(9시~16시)에는</Typography>
        <AutoInputControl type="number" initvalue={copycfg.DTValue} unit="℃" keyname="DTValue" onChange={props.inputallchangeHandler} />
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        <Typography>야간시간동안에는</Typography>
        <AutoInputControl type="number" initvalue={copycfg.NTValue} unit="℃" keyname="NTValue" onChange={props.inputallchangeHandler} />
        <Typography>유지합니다.</Typography>
      </Stack>

      <FormControlLabel control={<Switch checked={avchecked} onChange={handleChange} name="avencheck" />} label="고급설정" />

      {avchecked === true ? <AdvenceSetting initvalue={copycfg} inputallchangeHandler={props.inputallchangeHandler} /> : null}
    </Stack>
  );
};
export default JukeboxTemperatureM1;
