import { Box, Button, Card, CardHeader, FormControlLabel, FormGroup, Stack, Switch, TextField, Typography } from "@mui/material";

import AutoInputControl from "../uicomponent/autoinputcontrol";
import AutoInputTimeRange from "../uicomponent/autotimerangeinput";


const JukeboxWatersupplyM1 = (props) => {
  const copycfg = props.initvalue;

  return (
    <div className="auto_input">
            <div className="aut_in">
              이름 :
              <input type="text" key={"name" + copycfg.Uid} defaultValue={copycfg.Name} name="name" onChange={props.inputonchangeHandler} />
            </div>

            <div className="aut_in">
              관수 :
              <AutoInputControl  type="number"  initvalue={copycfg} keyname="DTValue" onChange={props.inputallchangeHandler} />
            </div>
            <div className="aut_in">
             관수 간격 :
              <AutoInputControl  type="number"  initvalue={copycfg} keyname="NTValue" onChange={props.inputallchangeHandler} />
            </div>
            <div className="aut_in">
              바운드온도 :
              <AutoInputControl  type="number"  initvalue={copycfg} keyname="BValue" onChange={props.inputallchangeHandler} />
            </div>

            <div className="aut_in">
              <AutoInputTimeRange initvalue={copycfg} onChange={props.inputallchangeHandler} />
            </div>
          </div>
  );
};
export default JukeboxWatersupplyM1;
