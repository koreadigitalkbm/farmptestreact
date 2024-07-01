import React from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import { Button, Stack, Typography, Box, Switch } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";
import KDUtil from "../../commonjs/kdutil";

const MiniHouseLEDOnOFF = (props) => {
  const [avchecked, setAVChecked] = React.useState(true);
  const [manualactname, setmanualactname] = React.useState("selitem0");
  const [manualontimesec, setmanualontimesec] = React.useState(600);
  const [manualdemming, setmanualdemming] = React.useState(100);

  const [savedisable, setBtnDisable] = React.useState(true);
  const commoninputhandler = props.inputallchangeHandler;
  const commonischangehandler = props.ischangehandler;
  const copycfg = props.initvalue;
  const saveconfig = props.savecfg;
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
        console.log("inputchangeHandler event.target.name 1:" + leddimmingpercent);

        copycfg.Params[0] = event.target.value;
        setleddimmingpercent(copycfg.Params[0]);

        console.log("inputchangeHandler event.target.name2:" + leddimmingpercent);

        break;
      case "redled":
        copycfg.Params[1] = event.target.value;
        break;
      case "blueled":
        copycfg.Params[2] = event.target.value;
        break;

      default:
        commoninputhandler(event);
        break;
    }

    setBtnDisable(commonischangehandler());
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
    const actitems = [myAppGlobal.langT("LT_GROWPLANTS_LED_WHITE")];

    return (
      <Stack spacing={1}>
        <AutoManualActuator initvalue={manualactname} items={actitems} changehandler={inputchangeHandler} />
        <Stack direction="row" alignItems="flex-end" sx={{ ml: 2 }}>
          <Typography sx={{ ml: 2, mb: 1 }}>{myAppGlobal.langT("LT_GROWPLANTS_LED_BRIGHT")}</Typography>
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
      <Stack direction={{ xs: "colurm", sm: "colurm" }} alignItems="flex-start">
        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
          <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_SETTO_DAYTIME")}</Typography>
          <AutoInputTimeRange initvalue={copycfg} onChange={inputchangeHandler} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
          <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_LED_WHITE")}</Typography>
          <AutoInputControl type="number" initvalue={leddimmingpercent} unit="%" keyname="whiteled" onChange={inputchangeHandler} />
        </Box>
       
      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={0}>
      <Box sx={{ display: "flex", flexWrap: "wrap", m: 2 }}>
        <Typography sx={{ m: 2 }}>{KDUtil.Stringformat(myAppGlobal.langT(`LT_GROWPLANTS_LED_DAY1`), KDUtil.secToTime(copycfg.STime) + "~" + KDUtil.secToTime(copycfg.ETime))}</Typography>
        <AutoInputControl type="number" initvalue={leddimmingpercent} unit="%" keyname="leddeming" onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_LED_DAY2")}</Typography>
      </Box>
      <Box sx={{ bgcolor: "#c5e1a5", boxShadow: 1, borderRadius: 2, p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box align="left">
            <Typography color={"#fb8c00"} mr={2} fontSize={15}>
              {"※ " + myAppGlobal.langT("LT_GROWPLANTS_LED_HELP2")}
            </Typography>
          </Box>

          <FormControlLabel control={<Switch checked={avchecked} onChange={inputchangeHandler} name="avencheck" color="success" />} label={myAppGlobal.langT("LT_GROWPLANTS_ADVANCEDSETTING")} />
        </Stack>

        {avchecked === true ? <hr /> : null}
        {avchecked === true ? <AdvenceSetting initvalue={copycfg} inputallchangeHandler={inputchangeHandler} /> : null}

        <hr />
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button disabled={savedisable} variant="contained" sx={{ backgroundColor: "#fb8c00" }} onClick={() => saveconfig()} endIcon={<SaveAltIcon fontSize="large" />}>
            {myAppGlobal.langT("LT_GROWPLANTS_SAVE")}
          </Button>
          <FormHelperText>{myAppGlobal.langT("LT_GROWPLANTS_SAVE_NOTI")}</FormHelperText>
        </Stack>
      </Box>
    </Stack>
  );
};
export default MiniHouseLEDOnOFF;
