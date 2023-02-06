
import { Button,Stack, Typography } from "@mui/material";
import AutoInputControl from "./autoinputcontrol";
//자동제어의 수동제어 화면 공통으로 상용되는거
const AutoManualCommon = (props) => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="flex-end">
          <Typography> 켜짐시간 : </Typography>
          <AutoInputControl type="number" initvalue={props.initvalue} unit="초" keyname="ontimesec" onChange={props.inputchangeHandler} />
        </Stack>
        <Button type="submit" variant="contained" onClick={() => props.manualHandler(true)}>
          켜짐
        </Button>
        <Button type="submit" variant="contained" onClick={() => props.manualHandler(false)}>
          꺼짐
        </Button>
    </Stack>
  );
};
export default AutoManualCommon;
