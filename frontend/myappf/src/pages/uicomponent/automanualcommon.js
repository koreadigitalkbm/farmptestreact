
import { Button,Stack, Typography } from "@mui/material";
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import AutoInputControl from "./autoinputcontrol";
import myAppGlobal from "../../myAppGlobal";
//자동제어의 수동제어 화면 공통으로 상용되는거
const AutoManualCommon = (props) => {
  return (
    <Stack spacing={1} alignItems="flex-start">
      <Stack direction="row" alignItems="flex-end">
          <Typography>{myAppGlobal.langT("LT_GROWPLANTS_OPERATINGTIME")}</Typography>
          <AutoInputControl type="number" initvalue={props.initvalue} unit={myAppGlobal.langT("LT_GROWPLNATS_SECONDS")} keyname="ontimesec" onChange={props.inputchangeHandler} />
        </Stack>
        <Button type="submit" variant="contained" size="large" onClick={() => props.manualHandler(true)} endIcon={<PowerIcon />}>
          {myAppGlobal.langT("LT_GROWPLANTS_ON")}
        </Button>
        <Button type="submit" variant="contained" size="large" onClick={() => props.manualHandler(false)} endIcon={<PowerOffIcon />}>
          {myAppGlobal.langT("LT_GROWPLANTS_OFF")}
        </Button>
    </Stack>
  );
};
export default AutoManualCommon;
