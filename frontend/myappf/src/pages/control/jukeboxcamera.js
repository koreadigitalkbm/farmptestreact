import React, { useState, useEffect } from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import { Button, Box,Stack, Typography } from "@mui/material";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import KDDefine from "../../commonjs/kddefine";
import KDUtil from "../../commonjs/kdutil";



let manultakefilename = "image/noimage.png";
let recenturl="";
let recenturl_thum="";
let togleflg=0;

const JukeboxCamera = (props) => {
  
  const [takeimageurl, settakeimageurl] = useState(manultakefilename);
  const copycfg = props.initvalue;
  const saveconfig = props.savecfg;

  console.log("JukeboxCamera recenturl:" + recenturl + ' togleflg:'+ togleflg + "takeimageurl : " +takeimageurl);

  function manualreload() {
    if(togleflg ==0)
    {
    settakeimageurl(recenturl_thum);
    togleflg=1;
    }
    else
    {
    settakeimageurl(recenturl);
    togleflg=0;
    }
  
  }
  function manualtake(istake) {
    const actuid = copycfg.Actlist[0];
    let opcmd = new ActuatorOperation(actuid, istake, 0);

    

    if (istake === true) {
      let timestr=KDUtil.dateTostringforme(new Date(),true, true)

      timestr=timestr.replace(":","_");
      timestr=timestr.replace(":","_");
      timestr=timestr.replace(":","_");
      timestr=timestr.replace(" ","_");
      
      
      let capfilename = "cameara_" +"T_"+timestr + "_manual_"+ KDUtil.GetRandom10() + ".jpg";
         

      manultakefilename =capfilename;
    }
    console.log("manultakefilename : " + manultakefilename);
    
    opcmd.setoperation(KDDefine.ONOFFOperationTypeEnum.OPT_Camera_TakeSave, 0, manultakefilename, istake);
    myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => {
      if (istake === true) {
        const newurl = "/cameraimage/" + myAppGlobal.logindeviceid + "/manual/" + manultakefilename;
        console.log("JukeboxCamera url:" + newurl);
        recenturl = newurl;
        recenturl_thum=newurl.replace(".jpg", "_thum.jpg");
     //   alert("촬영되었습니다.");
        settakeimageurl(newurl);
        
      } else {
        alert("저장되었습니다.");
      }
    });
  }

  ///수동제어
  if (copycfg.Enb === false) {
    return (
      <Stack spacing={1}>
        <img src={takeimageurl} loading="lazy" width={400} />

        <Button type="submit" variant="contained" onClick={() => manualtake(true)}>
          {myAppGlobal.langT('LT_GROWPLANTS_TAKEPICTURE_SHOOT')}
        </Button>

        <Button type="submit" variant="contained" onClick={() =>manualreload()}>
        {myAppGlobal.langT('LT_GROWPLANTS_TAKEPICTURE_LOADRECENTLYPICTURE')}
        </Button>
        

        <Button type="submit" variant="contained" onClick={() => manualtake(false)}>
        {myAppGlobal.langT('LT_GROWPLANTS_TAKEPICTURE_SAVEPICTURE')}
        </Button>
      </Stack>
    );
  }

  //자동제어 일반
  return (
    <Stack spacing={0}>
      <Stack direction="row" alignItems="flex-end" sx={{ m: 2 }}>
        <Typography>{myAppGlobal.langT('LT_GROWPLANTS_TAKEPICTURE_EVERYDAY1')}</Typography>
        <AutoInputControl type="number" initvalue={copycfg.DTValue} unit={myAppGlobal.langT('LT_GROWPLANTS_TAKEPICTURE_NUMBEROFTIMES')} keyname="DTValue" onChange={props.inputallchangeHandler} />
        <Typography>{myAppGlobal.langT('LT_GROWPLANTS_TAKEPICTURE_EVERYDAY2')}</Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-end" sx={{ m: 2 }}>
        <Typography>{myAppGlobal.langT('LT_GROWPLANTS_TAKEPICTURE_STARTTIME')}</Typography>
        <AutoInputControl type="time" initvalue={copycfg.STime} unit="" keyname="STime" onChange={props.inputallchangeHandler} />
      </Stack>
      <Box sx={{ bgcolor: "#c5e1a5", boxShadow: 1, borderRadius: 2, p: 2 }}>
      <hr/>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="contained" sx={{ backgroundColor: "#fb8c00" }} onClick={() => saveconfig()} endIcon={<SaveAltIcon fontSize="large" />}>
            {myAppGlobal.langT("LT_GROWPLANTS_SAVE")}
          </Button>
          <Typography color={"#1b5e20"} >{myAppGlobal.langT("LT_GROWPLANTS_SAVE_NOTI")}</Typography>
        </Stack>
        </Box>
    </Stack>
  );
};
export default JukeboxCamera;
