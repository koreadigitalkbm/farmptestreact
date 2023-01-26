import { Box, Button, Card, CardHeader, FormControlLabel, FormGroup, Stack, Switch, TextField, Typography } from "@mui/material";
import KDUtil from "../../commonjs/kdutil";

const AutoInputControl = (props) => {
  const controlkeyname = props.keyname;
  const inputtype = props.type;
  let initvalue=props.initvalue[controlkeyname];

  console.log("AutoInputControl  controlkeyname: " + controlkeyname);
  console.log("AutoInputControl  initvalue: " + initvalue);


  if (inputtype == "time") {
    initvalue = KDUtil.secToTime(initvalue);
  }
  
  return (
    <div>
      {controlkeyname}

      <TextField type={inputtype} defaultValue={initvalue} name={controlkeyname} onChange={props.onChange} />
    </div>
  );
};
export default AutoInputControl;
