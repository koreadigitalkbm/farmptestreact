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
import Box from '@mui/material/Box';
import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";
import KDUtil from "../../commonjs/kdutil";

const JukeboxMultiLED = (props) => {
  const copycfg = props.initvalue;
  const [avchecked, setAVChecked] = React.useState(false);
  const [manualactname, setmanualactname] = React.useState("selitem0");
  const [manualontimesec, setmanualontimesec] = React.useState(600);
  const [manualdemming, setmanualdemming] = React.useState(100);
  const [leddimmingpercent, setleddimmingpercent] = React.useState(copycfg.Params[0]);

  const inputchangeHandler = (event) => {
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

      case "manualdemming":
        setmanualdemming(event.target.value);
        break;

      case "whiteled":
      case "leddeming":
        copycfg.Params[0] = event.target.value;
        setleddimmingpercent(copycfg.Params[0]);
        break;
      case "redled":
        copycfg.Params[1] = event.target.value;
        break;
      case "blueled":
        copycfg.Params[2] = event.target.value;
        break;

      default:
        break;
    }
  };

  function manualonoff(isSetOn) {
    const actindex = manualactname === "selitem0" ? 0 : manualactname === "selitem1" ? 1 : 2;
    const actuid = copycfg.Actlist[actindex];

    const withparam = ActuatorOperation.Gettimewithparam(manualontimesec, manualdemming);
    console.log("manualonoff name:  ontimesec:" + manualontimesec + " leddemming:" + manualdemming + ",actuid : " + actuid + " withparam:" + withparam);

    let opcmd = new ActuatorOperation(actuid, isSetOn, withparam);
    myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => {});
  }

  ///수동제어
  if (copycfg.Enb === false) {
    const actitems=[myAppGlobal.langT('LT_GROWPLANTS_LED_WHITE'),myAppGlobal.langT('LT_GROWPLANTS_LED_RED'),myAppGlobal.langT('LT_GROWPLANTS_LED_BLUE')];

    return (
      <Stack spacing={1}>

        <AutoManualActuator   initvalue={manualactname}  items={actitems} changehandler={inputchangeHandler}  />
        <Stack direction="row" alignItems="flex-end">
          <Typography>{myAppGlobal.langT('LT_GROWPLANTS_LED_DAY2')}</Typography>
          <AutoInputControl type="number" initvalue={manualdemming} unit="%" keyname="manualdemming" onChange={inputchangeHandler} />
        </Stack>
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
        <Stack direction="row" alignItems="flex-end">
          <Typography>{myAppGlobal.langT('LT_GROWPLANTS_LED_WHITE')}</Typography>
          <AutoInputControl type="number" initvalue={leddimmingpercent} unit="%" keyname="whiteled" onChange={inputchangeHandler} />
          &nbsp;
          <Typography>{myAppGlobal.langT('LT_GROWPLANTS_LED_RED')}</Typography>
          <AutoInputControl type="number" initvalue={copycfg.Params[1]} unit="%" keyname="redled" onChange={inputchangeHandler} />
          &nbsp;
          <Typography>{myAppGlobal.langT('LT_GROWPLANTS_LED_BLUE')}</Typography>
          <AutoInputControl type="number" initvalue={copycfg.Params[2]} unit="%" keyname="blueled" onChange={inputchangeHandler} />
        </Stack>
      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="flex-end">
        <Typography>{KDUtil.Stringformat(myAppGlobal.langT(`LT_GROWPLANTS_LED_DAY1`), KDUtil.secToTime(copycfg.STime) + "~" + KDUtil.secToTime(copycfg.ETime))}</Typography>
        <AutoInputControl type="number" initvalue={leddimmingpercent} unit="%" keyname="leddeming" onChange={inputchangeHandler} />
        <Typography>{myAppGlobal.langT('LT_GROWPLANTS_LED_DAY2')}</Typography>
      </Stack>
      <Box sx={{bgcolor: '#fef0e0', boxShadow: 1, borderRadius: 2, p: 2, }}>
      <FormControlLabel control={<Switch checked={avchecked} onChange={inputchangeHandler} name="avencheck" />} label={myAppGlobal.langT('LT_GROWPLANTS_ADVANCEDSETTING')} />

      {avchecked === true ? <AdvenceSetting initvalue={copycfg} inputallchangeHandler={props.inputallchangeHandler} /> : null}
      </Box>
    </Stack>
  );
};
export default JukeboxMultiLED;
