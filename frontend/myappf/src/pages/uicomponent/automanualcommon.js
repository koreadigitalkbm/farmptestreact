
import { Button,Box, Stack, Typography } from "@mui/material";
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import AutoInputControl from "./autoinputcontrol";
import myAppGlobal from "../../myAppGlobal";
//자동제어의 수동제어 화면 공통으로 상용되는거
const AutoManualCommon = (props) => {
  return (
    <Box sx={{bgcolor: '#c5e1a5', boxShadow: 1, borderRadius: 2, p: 2, }}>
    <Stack spacing={1} direction="column" alignItems="flex-end">
          <Stack direction="row" alignItems="flex-end">
          <Typography>{myAppGlobal.langT("LT_GROWPLANTS_OPERATINGTIME")}</Typography>
          <AutoInputControl type="number" initvalue={props.initvalue} unit={myAppGlobal.langT("LT_GROWPLNATS_SECONDS")} keyname="ontimesec" onChange={props.inputchangeHandler} />
          <Button type="submit" variant="contained" size="large" sx={{ minWidth:120}} onClick={() => props.manualHandler(true)} endIcon={<PowerIcon />}>
          {myAppGlobal.langT("LT_GROWPLANTS_ON")}
        </Button>
        </Stack>
        
        <Button type="submit" variant="contained" size="large" sx={{ minWidth:120}}   onClick={() => props.manualHandler(false)} endIcon={<PowerOffIcon />}>
          {myAppGlobal.langT("LT_GROWPLANTS_OFF")}
        </Button>
    </Stack>
    </Box>
  );
};
export default AutoManualCommon;
