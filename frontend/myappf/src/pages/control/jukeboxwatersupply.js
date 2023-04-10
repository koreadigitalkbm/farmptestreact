import React from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import { Button, Stack, Typography } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormHelperText from "@mui/material/FormHelperText";

import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Box from "@mui/material/Box";
import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoControlUtil from "../../commonjs/autocontrolutil";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";
import KDUtil from "../../commonjs/kdutil";

const JukeboxWatersupplyM1 = (props) => {
  const [avchecked, setAVChecked] = React.useState(true);
  const [manualactname, setmanualactname] = React.useState("selitem0");
  const [manualontimesec, setmanualontimesec] = React.useState(600);
  const [savedisable, setBtnDisable] = React.useState(true);
  const commoninputhandler = props.inputallchangeHandler;
  const commonischangehandler = props.ischangehandler;
  const copycfg = props.initvalue;
  const saveconfig = props.savecfg;

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
        commoninputhandler(event);
        break;
    }
    setBtnDisable(commonischangehandler());

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
    const actitems = [myAppGlobal.langT("LT_GROWPLANTS_WATERSUPPLY_IRRIGATIONPUMP")];
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
      <Stack direction={{ xs: "colurm", sm: "colurm" }} alignItems="flex-start">
        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
          <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_SETTO_DAYTIME")}</Typography>

          <AutoInputTimeRange initvalue={copycfg} onChange={inputchangeHandler} />
        </Box>
      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={0}>
      <Box sx={{ display: "flex", flexWrap: "wrap", m: 2 }}>
        <Typography sx={{ m: 2 }}>{KDUtil.Stringformat(myAppGlobal.langT(`LT_GROWPLANTS_WATERSUPPLY_DAY1`), KDUtil.secToTime(copycfg.STime) + "~" + KDUtil.secToTime(copycfg.ETime))}</Typography>
        <AutoInputControl type="number" initvalue={dayintervaltime} unit={myAppGlobal.langT("LT_GROWPLANTS_WATERSUPPLY_INTERVALUNIT")} keyname="DOffTime" onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT(`LT_GROWPLANTS_WATERSUPPLY_DAY2`)}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.DOnTime} unit={myAppGlobal.langT("LT_GROWPLANTS_WATERSUPPLY_OPERATETIMEUNIT")} keyname="DOnTime" onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT(`LT_GROWPLANTS_WATERSUPPLY_DAY3`)}</Typography>

        <Typography sx={{ m: 2 }}>{myAppGlobal.langT(`LT_GROWPLANTS_WATERSUPPLY_NIGHT1`)}</Typography>
        <AutoInputControl type="number" initvalue={nightintervaltime} unit={myAppGlobal.langT("LT_GROWPLANTS_WATERSUPPLY_INTERVALUNIT")} keyname="NOffTime" onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_WATERSUPPLY_NIGHT2")} </Typography>
        <AutoInputControl type="number" initvalue={copycfg.NOnTime} unit={myAppGlobal.langT("LT_GROWPLANTS_WATERSUPPLY_OPERATETIMEUNIT")} keyname="NOnTime" onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_WATERSUPPLY_NIGHT3")} </Typography>
      </Box>
      <Box sx={{ bgcolor: "#c5e1a5", boxShadow: 1, borderRadius: 2, p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box align="left">
            <Typography color={"#fb8c00"} mr={2} fontSize={15}>
              {"※ " + myAppGlobal.langT("LT_GROWPLANTS_WATERSUPPLY_HELP1")}
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
export default JukeboxWatersupplyM1;
