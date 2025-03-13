import React from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import { Stack, Typography } from "@mui/material";
import { Button } from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";
import KDUtil from "../../commonjs/kdutil";

const JukeboxChillerControl = (props) => {
  const [avchecked, setAVChecked] = React.useState(true);
  const [manualactname, setmanualactname] = React.useState("selitem0");
  const [manualontimesec, setmanualontimesec] = React.useState(600);
  const [savedisable, setBtnDisable] = React.useState(true);
  const commoninputhandler = props.inputallchangeHandler;
  const commonischangehandler = props.ischangehandler;
  const copycfg = props.initvalue;
  const saveconfig = props.savecfg;

  
  const inputchangeHandler = (event) => {
    //console.log("inputchangeHandler event.target.name:" +event.target.name);
    switch (event.target.name) {
      case "Params[0]":
        copycfg.Params[0] = event.target.value;
        break;
      case "Params[1]":
        //시작시간임
        copycfg.Params[1] =KDUtil.timeTosec(event.target.value);
        break;
      case "Params[2]":
        copycfg.Params[2] = event.target.value;
        break;
      case "Params[3]":
        copycfg.Params[3] = event.target.value;
        break;
      case "Params[4]":
        copycfg.Params[4] = event.target.value;
        break;
      case "Params[5]":
        copycfg.Params[5] = event.target.value;
        break;
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

  function manualonoff(isSetOn) {
    
    
    const actchiller = copycfg.Actlist[0];
    const actpump = copycfg.Actlist[1];
    const actvv1 = copycfg.Actlist[2];
    const actvv2 = copycfg.Actlist[3];
    const actvv3 = copycfg.Actlist[4];
    const actvv4 = copycfg.Actlist[5];



    let opcmds = [];

    if(manualactname === "selitem0")
    {
      //opcmddev = new ActuatorOperation(actchiller, isSetOn, manualontimesec);
       //칠러나 펌프를 켜면 내부 순환 펌프 밸브도 같이 켜준다.
    opcmds.push(new ActuatorOperation(actchiller, isSetOn, manualontimesec));
    opcmds.push(new ActuatorOperation(actpump, isSetOn, manualontimesec));
      opcmds.push(new ActuatorOperation(actvv1, isSetOn, manualontimesec));
      opcmds.push(new ActuatorOperation(actvv3, isSetOn, manualontimesec));
      if(isSetOn === true)
      {

        opcmds.push(new ActuatorOperation(actvv2, false, manualontimesec));
        opcmds.push(new ActuatorOperation(actvv4, false, manualontimesec));
      }

    

    }
    else if(manualactname === "selitem1") //내부 순환 펌프
    {   
      opcmds.push(new ActuatorOperation(actpump, isSetOn, manualontimesec));
      opcmds.push(new ActuatorOperation(actvv1, isSetOn, manualontimesec));
      opcmds.push(new ActuatorOperation(actvv3, isSetOn, manualontimesec));
      if(isSetOn === true)
      {

        opcmds.push(new ActuatorOperation(actvv2, false, manualontimesec));
        opcmds.push(new ActuatorOperation(actvv4, false, manualontimesec));
      }

    }
    else if(manualactname === "selitem2")
    {
      //배수 
      opcmds.push(new ActuatorOperation(actpump, isSetOn, manualontimesec));
      opcmds.push(new ActuatorOperation(actvv1, isSetOn, manualontimesec));
      opcmds.push(new ActuatorOperation(actvv4, isSetOn, manualontimesec));
      if(isSetOn === true)
        {
  
          opcmds.push(new ActuatorOperation(actvv2, false, manualontimesec));
          opcmds.push(new ActuatorOperation(actvv3, false, manualontimesec));
        }


    }
    else if(manualactname === "selitem3")
    {
        //급수 
        opcmds.push(new ActuatorOperation(actpump, isSetOn, manualontimesec));
        opcmds.push(new ActuatorOperation(actvv2, isSetOn, manualontimesec));
        opcmds.push(new ActuatorOperation(actvv3, isSetOn, manualontimesec));
        if(isSetOn === true)
          {
    
            opcmds.push(new ActuatorOperation(actvv1, false, manualontimesec));
            opcmds.push(new ActuatorOperation(actvv4, false, manualontimesec));
          }
  
    }
    
   

    myAppGlobal.farmapi.setActuatorOperation(opcmds).then((ret) => {});

  }

  ///수동제어
  if (copycfg.Enb === false) {
    const actitems = [myAppGlobal.langT("LT_GROWPLANTS_CHILLER"), myAppGlobal.langT("LT_GROWPLANTS_WATERPUMP"), myAppGlobal.langT("LT_GROWPLANTS_DRAINPUMP"), myAppGlobal.langT("LT_GROWPLANTS_SUPPLYPUMP")];

    return (
      <Stack spacing={0}>
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

        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
          <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_TEMPERATUREINTERVAL")}</Typography>
          <AutoInputControl type="number" initvalue={copycfg.BValue} unit="℃" keyname="BValue" onChange={inputchangeHandler} />
        </Box>

        <Stack direction={{ xs: "colurm", sm: "colurm" }} alignItems="flex-start" sx={{ backgroundColor: "#ddffdd" }}>
        
        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_AUTO_WATERING_SETUP")}</Typography>
        <Typography sx={{ m: 2 , color: "red" }}>{myAppGlobal.langT("LT_AUTO_WATERING_WARNING")}</Typography>
        </Box>
        

        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_AUTO_FREQUENCY")}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.Params[0]} keyname="Params[0]" unit={myAppGlobal.langT("LT_GROWPLANTS_TAKEPICTURE_NUMBEROFTIMES")}  onChange={inputchangeHandler} />
        <Typography sx={{ fontSize: '0.8rem', color: '#cc9900' , alignSelf: "flex-end" }}>{myAppGlobal.langT("LT_AUTO_FREQUENCY_NOTI")}</Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_AUTO_WATERING_STARTTIME")}</Typography>
        <AutoInputControl type="time" initvalue={copycfg.Params[1]} keyname="Params[1]" unit=""  onChange={inputchangeHandler} />
        </Box>
        
        
        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_AUTO_WATERING_DRAINTIME")}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.Params[2]} keyname="Params[2]" unit={myAppGlobal.langT("LT_GROWPLANTS_OPERATEUNIT")} onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_AUTO_WATERING_DRAINMM")}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.Params[4]} keyname="Params[4]" unit="mm"  onChange={inputchangeHandler} />

        <Typography sx={{ fontSize: '0.8rem', color: '#cc9900' , alignSelf: "flex-end" }}>{myAppGlobal.langT("LT_AUTO_WATERING_DRAIN_NOTI")}</Typography>
        </Box>
        
        <Box sx={{ display: "flex", flexWrap: "wrap", m: 0 }}>
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_AUTO_WATERING_FILLTIME")}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.Params[3]} keyname="Params[3]" unit={myAppGlobal.langT("LT_GROWPLANTS_OPERATEUNIT")} onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_AUTO_WATERING_FILLMM")}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.Params[5]} keyname="Params[5]" unit="mm"  onChange={inputchangeHandler} />
        <Typography sx={{ fontSize: '0.8rem', color: '#cc9900' , alignSelf: "flex-end" }}>{myAppGlobal.langT("LT_AUTO_WATERING_FILL_NOTI")}</Typography>
        </Box>
        </Stack>

      </Stack>
    );
  };
  //자동제어 일반
  return (
    <Stack spacing={0}>
      <Box sx={{ display: "flex", flexWrap: "wrap", m: 2 }}>
        <Typography sx={{ m: 2 }}>{KDUtil.Stringformat(myAppGlobal.langT(`LT_GROWPLANTS_TEMPERATURE_DAY1`), KDUtil.secToTime(copycfg.STime) + "~" + KDUtil.secToTime(copycfg.ETime))}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.DTValue} unit="℃" keyname="DTValue" onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT("LT_GROWPLANTS_TEMPERATURE_DAY2")}</Typography>

        <Typography sx={{ m: 2 }}>{myAppGlobal.langT(`LT_GROWPLNATS_TEMPERAUTRE_NIGHT1`)}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.NTValue} unit="℃" keyname="NTValue" onChange={inputchangeHandler} />
        <Typography sx={{ m: 2 }}>{myAppGlobal.langT(`LT_GROWPLNATS_TEMPERAUTRE_NIGHT2`)}</Typography>
      </Box>

      <Box sx={{ bgcolor: "#c5e1a5", boxShadow: 1, borderRadius: 2, p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box align="left"></Box>
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
export default JukeboxChillerControl;
