import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import myAppGlobal from "../../myAppGlobal";

//자동제어의 수동제어 구동기 선택 라디오 그룹
const AutoManualActuator = (props) => {
  const itemlist = props.items;

  return (
    <FormControl  sx={{ m: 2 }}>
      <FormLabel id="demo-controlled-radio-buttons-group">{myAppGlobal.langT("LT_GROWPLANTS_SELECTHOC")}</FormLabel>
      <RadioGroup aria-labelledby="demo-controlled-radio-buttons-group" name="devselgroup" value={props.initvalue} onChange={props.changehandler}>
        {itemlist.map((item, index) => (
          <FormControlLabel value={"selitem" + index} control={<Radio />} label={item} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
export default AutoManualActuator;
