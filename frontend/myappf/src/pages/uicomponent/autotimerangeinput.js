import { Box, Button, Card, CardHeader, FormControlLabel, FormGroup, Stack, Switch, TextField, Typography } from "@mui/material";

import AutoInputControl from "./autoinputcontrol";

const AutoInputTimeRange = (props) => {
  return (
    <div>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Typography>주간시간설정:</Typography>
        <AutoInputControl type="time" initvalue={props.initvalue} keyname="STime" onChange={props.onChange} />

        <Typography>~</Typography>
        <AutoInputControl type="time" initvalue={props.initvalue} keyname="ETime" onChange={props.onChange} />
      </Stack>
    </div>
  );
};
export default AutoInputTimeRange;
