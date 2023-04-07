import React from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import { Button, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";
import KDUtil from "../../commonjs/kdutil";

const JukeboxNutrientSupply = (props) => {
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
    const actindex = manualactname === "selitem0" ? 0 : manualactname === "selitem1" ? 1 : manualactname === "selitem2" ? 2 : 3;
    const actuid = copycfg.Actlist[actindex];

    console.log("manualonoff name:  manualontimesec:" + manualontimesec + " manualactname:" + manualactname + ",actuid : " + actuid);
    let opcmd = new ActuatorOperation(actuid, isSetOn, manualontimesec);
    myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => {});
  }

  ///수동제어
  if (copycfg.Enb === false) {
    let actinfoa = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, copycfg.Actlist[0], myAppGlobal);
    let actinfob = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, copycfg.Actlist[1], myAppGlobal);
    let actinfoc = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, copycfg.Actlist[2], myAppGlobal);
    let actinfopump = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, copycfg.Actlist[3], myAppGlobal);
    //const actitems = [actinfoa.Name, myAppGlobal.langT("LT_GROWPLANTS_NUTI_SOL2"), myAppGlobal.langT("LT_GROWPLANTS_NUTI_SOL3")];
    let actitems = [];
    if (actinfoa != null) {
      actitems.push(actinfoa.Name);
    }
    if (actinfob != null) {
      actitems.push(actinfob.Name);
    }
    if (actinfoc != null) {
      actitems.push(actinfoc.Name);
    }
    if (actinfopump != null) {
      actitems.push(actinfopump.Name);
    }

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
          <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_VALVEONTIME")}</Typography>
          <AutoInputControl type="number" initvalue={copycfg.DOnTime} unit={myAppGlobal.langT("LT_GROWPLANTS_OPERATEUNIT")} keyname="DOnTime" onChange={props.inputallchangeHandler} />
          <Typography color={"#fb8c00"} sx={{ m: 2 }} fontSize={15}>
            {"※ " + myAppGlobal.langT("LT_GROWPLANTS_NUTI_HELP1")}
          </Typography>
          </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
          <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_VALVEOFFTIME")}</Typography>
          <AutoInputControl type="number" initvalue={copycfg.DOffTime} unit={myAppGlobal.langT("LT_GROWPLANTS_OPERATEUNIT")} keyname="DOffTime" onChange={props.inputallchangeHandler} />
          <Typography color={"#fb8c00"} sx={{ m: 2 }} fontSize={15}>
            {"※ " + myAppGlobal.langT("LT_GROWPLANTS_NUTI_HELP2")}
          </Typography>
          </Box>
      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={0}>
      <Box sx={{ display: "flex", flexWrap: "wrap", m: 2 }}>
        <Typography sx={{ m: 2 }}>{KDUtil.Stringformat(myAppGlobal.langT(`LT_GROWPLANTS_NUTI_TXT1`), KDUtil.secToTime(copycfg.STime) + "~" + KDUtil.secToTime(copycfg.ETime))}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.DTValue} unit="pH" keyname="DTValue" onChange={props.inputallchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_NUTI_TXT2")}</Typography>

        <Typography sx={{ m: 2 }}>{myAppGlobal.langT(`LT_GROWPLANTS_NUTI_TXT3`)}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.NTValue} unit="mS" keyname="NTValue" onChange={props.inputallchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT(`LT_GROWPLANTS_NUTI_TXT4`)}</Typography>
      </Box>

      <Box sx={{ bgcolor: "#c5e1a5", boxShadow: 1, borderRadius: 2, p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box align="left">
            <Typography color={"#fb8c00"} mr={2} fontSize={15}>
              {"※ " + myAppGlobal.langT("LT_GROWPLANTS_NUTI_HELP3")}
            </Typography>
          </Box>
          <FormControlLabel control={<Switch checked={avchecked} onChange={inputchangeHandler} name="avencheck" color="success" />} label={myAppGlobal.langT("LT_GROWPLANTS_ADVANCEDSETTING")} />
        </Stack>
        {avchecked === true ? <hr /> : null}
        {avchecked === true ? <AdvenceSetting initvalue={copycfg} inputallchangeHandler={props.inputallchangeHandler} /> : null}
        <hr />
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="contained" sx={{ backgroundColor: "#fb8c00" }} onClick={() => saveconfig()} endIcon={<SaveAltIcon fontSize="large" />}>
            {myAppGlobal.langT("LT_GROWPLANTS_SAVE")}
          </Button>
          <FormHelperText>{myAppGlobal.langT("LT_GROWPLANTS_SAVE_NOTI")}</FormHelperText>
        </Stack>
      </Box>
    </Stack>
  );
};
export default JukeboxNutrientSupply;
