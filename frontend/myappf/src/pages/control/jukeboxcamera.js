import React, { useState, useEffect } from "react";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";
import {Button, Stack, Typography } from "@mui/material";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import ActuatorOperation from "../../commonjs/actuatoroperation";
import myAppGlobal from "../../myAppGlobal";
import AutoManualCommon from "../uicomponent/automanualcommon";
import AutoManualActuator from "../uicomponent/automanualactuator";

import KDDefine from "../../commonjs/kddefine";
import KDUtil from "../../commonjs/kdutil";

const JukeboxCamera = (props) => {
  
let manultakefilename="devicon_0.png";
  const [takeimageurl, settakeimageurl] = useState(manultakefilename);
  const copycfg = props.initvalue;

  console.log("JukeboxCamera manultakefilename:" +manultakefilename);




  function manualtake(istake) {
    
    const actuid = copycfg.Actlist[0];
    let opcmd = new ActuatorOperation(actuid, istake, 0);

    if(istake=== true)
    {
        let rid=KDUtil.GetRandom10();
        manultakefilename= "cameara_" + "m_" + rid+ ".jpg";
    }
    
    opcmd.setoperation(KDDefine.ONOFFOperationTypeEnum.OPT_Camera_TakeSave,0,manultakefilename,istake);
     myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => {
        if(istake === true)
        {
        const  newurl="/cameraimage/" +myAppGlobal.logindeviceid + "/manual/"+manultakefilename;
        console.log("JukeboxCamera url:" +newurl);
        alert("촬영되었습니다.");
        settakeimageurl(newurl);
        }
        else{
            alert("저장되었습니다.");
        }
    });

  }

  ///수동제어
  if (copycfg.Enb === false) {
    
    
    return (
      <Stack spacing={1}>
        <img    src={takeimageurl}     loading="lazy"    />

        <Button type="submit" variant="contained" onClick={() => manualtake(true)}>
          사진촬영
        </Button>
        <Button type="submit" variant="contained" onClick={() => manualtake(false)}>
          사진저장
        </Button>

      </Stack>
    );
  }

 
  //자동제어 일반
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="flex-end">
        <Typography>매일 </Typography>
        <AutoInputControl type="number" initvalue={copycfg.DTValue} unit="회" keyname="DTValue" onChange={props.inputallchangeHandler} />
        <Typography> 사진을 촬영합니다. </Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        <Typography> 활영시작시간: </Typography>
        <AutoInputControl type="time" initvalue={copycfg.STime} unit="" keyname="STime" onChange={props.inputallchangeHandler} />
      </Stack>

      
      
    </Stack>
  );
};
export default JukeboxCamera;
