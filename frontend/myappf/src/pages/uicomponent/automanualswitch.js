
import { Button,Box, Stack, Typography } from "@mui/material";


import RollerShadesIcon from '@mui/icons-material/RollerShades';
import RollerShadesClosedIcon from '@mui/icons-material/RollerShadesClosed';
import CurtainsClosedIcon from '@mui/icons-material/CurtainsClosed';
import AutoInputControl from "./autoinputcontrol";
import myAppGlobal from "../../myAppGlobal";
import React from "react";
import KDDefine from "../../commonjs/kddefine";


//자동제어의 수동제어 화면 공통으로 상용되는거
const AutoManualSwtich = (props) => {
  return (
    <Box sx={{bgcolor: '#c5e1a5', boxShadow: 1, borderRadius: 2, p: 2, }}>
    <Stack spacing={1} direction="column" alignItems="flex-end">
          <Stack direction="row" alignItems="flex-end">
          <Typography>{myAppGlobal.langT("LT_GROWPLANTS_OPERATINGTIME")}</Typography>
          <AutoInputControl type="number" initvalue={props.initvalue} unit={myAppGlobal.langT("LT_GROWPLNATS_SECONDS")} keyname="ontimesec" onChange={props.inputchangeHandler} />
          <Button type="submit" variant="contained" size="large" sx={{ minWidth:100}} onClick={() => props.manualHandler(KDDefine.AUTOStateType.AST_Open)} endIcon={<RollerShadesIcon />}>
          {myAppGlobal.langT("LT_GROWPLANTS_OPEN")}
        </Button>
        

        </Stack>
        <Button type="submit" variant="contained" size="large" sx={{ minWidth:100}} onClick={() => props.manualHandler(KDDefine.AUTOStateType.AST_Close)} endIcon={<RollerShadesClosedIcon />}>
          {myAppGlobal.langT("LT_GROWPLANTS_CLOSE")}
        </Button>

        
        <Button type="submit" variant="contained" size="large" sx={{ minWidth:100}}   onClick={() => props.manualHandler(KDDefine.AUTOStateType.AST_Off)} endIcon={<CurtainsClosedIcon />}>
          {myAppGlobal.langT("LT_GROWPLANTS_STOP")}
        </Button>
    </Stack>
    </Box>
  );
};
export default AutoManualSwtich;
