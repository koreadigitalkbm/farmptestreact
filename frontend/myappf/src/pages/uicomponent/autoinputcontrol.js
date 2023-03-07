import { TextField, InputAdornment } from "@mui/material";
import KDUtil from "../../commonjs/kdutil";
import React from "react";

const AutoInputControl = (props) => {
  const controlkeyname = props.keyname;
  const inputtype = props.type;
  const unitstring = props.unit;
  let initvalue = props.initvalue;


  if (inputtype === "time") {
    initvalue = KDUtil.secToTime(initvalue);
  }

  return (
    <React.Fragment>
      <TextField type={inputtype} defaultValue={initvalue} name={controlkeyname} onChange={props.onChange} variant="standard" 
      inputProps={{min: 0, style: { textAlign: 'right' }}}
      InputProps={{  endAdornment: <InputAdornment position="end" > {unitstring} </InputAdornment> }} 
      sx={{ml:1, mt: 1, mr:1, border: 0, "& .MuiInputBase-input": { border: 0 , minWidth: '8ch'} }} />
    </React.Fragment>
  );
};
export default AutoInputControl;
