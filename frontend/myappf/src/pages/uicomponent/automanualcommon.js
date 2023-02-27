
import { Button,Stack, Typography } from "@mui/material";
import AutoInputControl from "./autoinputcontrol";
import myAppGlobal from "../../myAppGlobal";
//자동제어의 수동제어 화면 공통으로 상용되는거
const AutoManualCommon = (props) => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="flex-end">
          <Typography>{myAppGlobal.langT("LT_GROWPLANTS_OPERATINGTIME")}</Typography>
          <AutoInputControl type="number" initvalue={props.initvalue} unit={myAppGlobal.langT("LT_GROWPLNATS_SECONDS")} keyname="ontimesec" onChange={props.inputchangeHandler} />
        </Stack>
        <Button type="submit" variant="contained" onClick={() => props.manualHandler(true)}>
          {myAppGlobal.langT("LT_GROWPLANTS_ON")}
        </Button>
        <Button type="submit" variant="contained" onClick={() => props.manualHandler(false)}>
          {myAppGlobal.langT("LT_GROWPLANTS_OFF")}
        </Button>
    </Stack>
  );
};
export default AutoManualCommon;
