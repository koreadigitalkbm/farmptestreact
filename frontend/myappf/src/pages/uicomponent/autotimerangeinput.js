import { Stack, Typography } from "@mui/material";
import AutoInputControl from "./autoinputcontrol";

const AutoInputTimeRange = (props) => {
  let dispstr="주간시간설정:";

  if(props.dispstring != null )
  {
    dispstr=props.dispstring;
  }

  return (
    <div>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Typography>{dispstr}</Typography>
        <AutoInputControl type="time" initvalue={props.initvalue.STime} keyname="STime" onChange={props.onChange} />
        <Typography>~</Typography>
        <AutoInputControl type="time" initvalue={props.initvalue.ETime} keyname="ETime" onChange={props.onChange} />
      </Stack>
    </div>
  );
};
export default AutoInputTimeRange;
