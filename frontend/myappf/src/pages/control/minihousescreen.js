import React from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import { Button, Stack, Typography, Box, Switch } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import FormHelperText from "@mui/material/FormHelperText";
import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoManualSwtich from "../uicomponent/automanualswitch";
import AutoManualActuator from "../uicomponent/automanualactuator";

const MinihouseScreen = (props) => {
  const [avchecked, setAVChecked] = React.useState(true);
  const [manualactname, setmanualactname] = React.useState("selitem0");
  const [manualontimesec, setmanualontimesec] = React.useState(60);
  const [savedisable, setBtnDisable] = React.useState(true);
  const commoninputhandler = props.inputallchangeHandler;
  const commonischangehandler = props.ischangehandler;
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
        commoninputhandler(event);
        break;
    }
    setBtnDisable(commonischangehandler());
  };

  function manualswitch(mSetmotor) {
    const actindex = manualactname === "selitem0" ? 0 : 1;
    const actuid = copycfg.Actlist[actindex];
    console.log("manual switch name:  manualontimesec:" + manualontimesec + " manualactname:" + manualactname + ",actuid : " + actuid + ",mSetmotor :"+mSetmotor);
    let opcmd = new ActuatorOperation(actuid, true, manualontimesec,mSetmotor);
    myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => {});
  }

  ///수동제어
  if (copycfg.Enb === false) {
    const actitems = [myAppGlobal.langT("LT_GROWPLANTS_WINDOW_MOTOR")];

    return (
      <Stack spacing={1}>
        <AutoManualActuator initvalue={manualactname} items={actitems} changehandler={inputchangeHandler} />
        <AutoManualSwtich initvalue={manualontimesec} inputchangeHandler={inputchangeHandler} manualHandler={manualswitch} />
      </Stack>
    );
  }

  //자동 고급설정 따로
  const AdvenceSetting = (props) => {
    const copycfg = props.initvalue;

    return (
      <Stack direction={{ xs: "colurm", sm: "colurm" }} alignItems="flex-start">
        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
          <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_SETTO_OPERATINGTIME")}</Typography>
          <AutoInputTimeRange initvalue={copycfg} onChange={inputchangeHandler} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
          <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_ACT_OPERATINGTIME")}</Typography>
          <AutoInputControl type="number" initvalue={copycfg.DOnTime} unit={myAppGlobal.langT("LT_GROWPLANTS_OPERATEUNIT")} keyname="DOnTime" onChange={inputchangeHandler} />
        </Box>
        
      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={0}>
      <Box sx={{ display: "flex", flexWrap: "wrap", m: 2 }}>
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_MINIHOUSE_SCREEN_V1")}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.DTValue} unit="W" keyname="DTValue" onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_MINIHOUSE_SCREEN_V2")}</Typography>
        
      </Box>
      <Box sx={{ bgcolor: "#c5e1a5", boxShadow: 1, borderRadius: 2, p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box align="left">
            <Typography color={"#fb8c00"} mr={2} fontSize={15}>
              {"※ " + myAppGlobal.langT("LT_GROWPLANTS_MINIHOUSE_SCREEN_HELP1")}
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
export default MinihouseScreen;
