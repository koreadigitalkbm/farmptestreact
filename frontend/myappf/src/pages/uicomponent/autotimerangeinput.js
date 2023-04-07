import { Stack, Typography } from "@mui/material";
import AutoInputControl from "./autoinputcontrol";
import myAppGlobal from "../../myAppGlobal";

const AutoInputTimeRange = (props) => {
  let dispstr=myAppGlobal.langT("LT_GROWPLANTS_SETTO_DAYTIME");

  if(props.dispstring != null )
  {
    dispstr=props.dispstring;
  }

  return (
    <div>
      <Stack  direction="row" spacing={0}>
        
        <AutoInputControl type="time" initvalue={props.initvalue.STime} keyname="STime" onChange={props.onChange} />
        <Typography sx={{ m: 2 }}>~</Typography>
        <AutoInputControl type="time" initvalue={props.initvalue.ETime} keyname="ETime" onChange={props.onChange} />
      </Stack>
    </div>
  );
};
export default AutoInputTimeRange;
