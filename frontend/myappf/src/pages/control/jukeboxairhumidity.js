import React from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import { Button, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";
import KDUtil from "../../commonjs/kdutil";

const JukeboxAirhumidity = (props) => {
  const [avchecked, setAVChecked] = React.useState(true);
  const [manualactname, setmanualactname] = React.useState("selitem0");
  const [manualontimesec, setmanualontimesec] = React.useState(600);
  const copycfg = props.initvalue;
  const saveconfig = props.savecfg;

  const inputchangeHandler = (event) => {
    console.log("inputchangeHandler event.target.name:" + event.target.name);

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
    const actitems = [myAppGlobal.langT("LT_GROWPLANTS_HUMIDITY_HEATER")];

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
        <Stack direction="row" alignItems="flex-end">
          <Typography>{myAppGlobal.langT("LT_GROWPLANTS_HUMIDITY_INTERVAL")}</Typography>
          <AutoInputControl type="number" initvalue={copycfg.BValue} unit="%" keyname="BValue" onChange={props.inputallchangeHandler} />
        </Stack>
      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={0}>
      <Stack direction="row" alignItems="flex-end" sx={{ m: 2 }}>
        <Typography>{KDUtil.Stringformat(myAppGlobal.langT(`LT_GROWPLANTS_HUMIDITY_DAY1`), KDUtil.secToTime(copycfg.STime) + "~" + KDUtil.secToTime(copycfg.ETime))}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.DTValue} unit="%" keyname="DTValue" onChange={props.inputallchangeHandler} />
        <Typography>{myAppGlobal.langT("LT_GROWPLANTS_HUMIDITY_DAY2")}</Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-end" sx={{ m: 2 }}>
        <Typography>{myAppGlobal.langT(`LT_GROWPLNATS_HUMIDITY_NIGHT1`)}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.NTValue} unit="%" keyname="NTValue" onChange={props.inputallchangeHandler} />
        <Typography>{myAppGlobal.langT(`LT_GROWPLNATS_HUMIDITY_NIGHT2`)}</Typography>
      </Stack>

      <Box sx={{ bgcolor: "#c5e1a5", boxShadow: 1, borderRadius: 2, p: 2 }}>
        <Stack direction="column" alignItems="flex-end">
          <Stack direction="row" alignItems="flex-start">
            <Typography color={"#fb8c00"} mr={2} fontSize={15} sx={{ minWidth: 540 }}>
              {"※ " + myAppGlobal.langT("LT_GROWPLANTS_HUMIDITY_HELP1")}
            </Typography>

            <FormControlLabel control={<Switch checked={avchecked} onChange={inputchangeHandler} name="avencheck" color="success" />} label={myAppGlobal.langT("LT_GROWPLANTS_ADVANCEDSETTING")} />
          </Stack>
        </Stack>

        {avchecked === true ? <AdvenceSetting initvalue={copycfg} inputallchangeHandler={props.inputallchangeHandler} /> : null}
        <hr />
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="contained" sx={{ backgroundColor: "#fb8c00" }} onClick={() => saveconfig()} endIcon={<SaveAltIcon fontSize="large" />}>
            {myAppGlobal.langT("LT_GROWPLANTS_SAVE")}
          </Button>
          <Typography color={"#1b5e20"}>{myAppGlobal.langT("LT_GROWPLANTS_SAVE_NOTI")}</Typography>
        </Stack>
      </Box>
    </Stack>
  );
};
export default JukeboxAirhumidity;
