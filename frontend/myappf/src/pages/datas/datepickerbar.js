import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Button, IconButton, Stack, Typography, Box } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight, ReadMoreTwoTone } from "@mui/icons-material";
import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import Grid from "@mui/material/Grid";
import DatePicker from "react-datepicker";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

import { forwardRef } from "react";
import myAppGlobal from "../../myAppGlobal";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerBar(props) {
  const onGetdb = props.getdb;
  const issearching = props.issearching;
  const isdaily = props.isdaily;
  const onChange = props.onchangedaliy;
  const onChangeEnb = props.onChenb;

  const isenbsensor = props.enbs;
  const isenbimage = props.enbi;
  const isenbevent = props.enbe;

  const [curdate, setcurdate] = useState(props.dayDate);
  const [startdate, setStartdate] = useState(props.startDate);
  const [enddate, setEnddate] = useState(props.endDate);

  function onClickday(e) {
    let curday;

    //console.log(e.currentTarget);

    switch (e.currentTarget.name) {
      case "oneDayAgo":
        curday = new Date(curdate);
        curday = curday.setDate(curday.getDate() - 1);

        break;
      case "oneDayAhead":
        curday = new Date(curdate);
        curday = curday.setDate(curday.getDate() + 1);
        break;
      case "dayselect":
        curday = e.currentTarget.date;
        break;
      case "startday":
        setStartdate(e.currentTarget.date);
        return;
      case "endday":
        setEnddate(e.currentTarget.date);
        return;

      case "searchday":
        onGetdb(startdate, enddate);
        return;

      default:
        return;
    }
    let utcnow = new Date();
    utcnow = new Date(utcnow.getFullYear(), utcnow.getMonth(), utcnow.getDate(), 23, 59, 59);
    //현재날자보다는 작아야함.
    if (curday <= utcnow.getTime()) {
      setcurdate(curday);
      onGetdb(new Date(curday), new Date(curday));
    } else {
      console.log("time over");
      console.log(curday);
      console.log(curdate);
    }
  }

  function handleDatepicker(dtype, date) {
    console.log(date);
    const e = {
      currentTarget: {
        name: dtype,
        date: date,
      },
    };
    onClickday(e);
  }

  const handleChange = (event) => {
    console.log("------------------------handleChange--------------------event : " + event.target.name + ",ch:" + event.target.checked);

    onChangeEnb(event.target.name);
    //그냥 화면 갱신
    //setCheckeds(!bcheckeds);
  };

  function pickertype() {
    const MuiCustomInput = forwardRef(({ value, onClick }, ref) => (
      <Button onClick={onClick} ref={ref}>
        <Typography align="center" fontSize="large" color="primary">
          {value}
        </Typography>
      </Button>
    ));

    if (issearching === true) {
      return (
        <React.Fragment>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <CircularProgress color="secondary" />
            <Typography align="center" fontSize="small" color="secondary">
              {myAppGlobal.langT("LT_DATAPAGE_DATEPICKER_SEARCING")}
            </Typography>
          </Stack>
        </React.Fragment>
      );
    } else {
      if (isdaily === true) {
        return (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <IconButton name="oneDayAgo" onClick={onClickday}>
              <KeyboardArrowLeft fontSize="large" color="primary" />
            </IconButton>

            <Box align="center">
              <DatePicker disabled={issearching} value={curdate} selected={curdate} customInput={<MuiCustomInput />} onChange={(date) => handleDatepicker("dayselect", date)} />
              <FormHelperText>{myAppGlobal.langT("LT_DATAPAGE_DATEPICKER_DATEEXPLAIN")}</FormHelperText>
            </Box>

            <IconButton name="oneDayAhead" onClick={onClickday}>
              <KeyboardArrowRight fontSize="large" color="primary" />
            </IconButton>
          </Stack>
        );
      } else {
        return (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Box sx={{ marginBottom: 0, p: 0, flexDirection: "column" }}>
              <DatePicker value={startdate} selected={startdate} customInput={<MuiCustomInput />} onChange={(date) => handleDatepicker("startday", date)} />
              <FormHelperText sx={{ ml: 1, p: 0 }}>{myAppGlobal.langT("LT_DATAPAGE_DATEPICKER_PERIOD_START")}</FormHelperText>
            </Box>

            <IconButton name="searchday" onClick={onClickday}>
              <QueryStatsIcon fontSize="large" color="primary" />
              <Typography align="center" fontSize="small" color="primary">
                {myAppGlobal.langT("LT_DATAPAGE_DATEPICKER_PERIOD_CONFIRM")}
              </Typography>
            </IconButton>

            <Box sx={{ m: 0, p: 0 }}>
              <DatePicker sx={{ m: 0, p: 0 }} value={enddate} selected={enddate} customInput={<MuiCustomInput />} onChange={(date) => handleDatepicker("endday", date)} />
              <FormHelperText sx={{ ml: 1, p: 0 }}>{myAppGlobal.langT("LT_DATAPAGE_DATEPICKER_PERIOD_END")}</FormHelperText>
            </Box>
          </Stack>
        );
      }
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={1} sx={{ backgroundColor: "#eceff1" }} padding={0}>
        <Box sx={{ display: "flex", flexWrap: "wrap", m: 1 }}>
          <Box sx={{ backgroundColor: "#eceff1" }}>
            <RadioGroup row aria-labelledby={"rg-label"} name={"rg-name"} onChange={onChange}>
              <FormControlLabel checked={isdaily} value={"하루(1일)"} label={myAppGlobal.langT("LT_DATAPAGE_DATEPICKER_DATE")} control={<Radio />} />
              <FormControlLabel checked={!isdaily} value={"기간(60일)"} label={myAppGlobal.langT("LT_DATAPAGE_DATEPICKER_PERIOD")} control={<Radio />} />
            </RadioGroup>
          </Box>
        </Box>
        <Box sx={{ backgroundColor: "#ffffff" }}>{pickertype()}</Box>

        <Box sx={{ backgroundColor: "#eceff1", m: 1 }}>
          <FormControlLabel key={"keysensor"} control={<Checkbox name={"keychs"} checked={isenbsensor} onChange={handleChange} sx={{ color: "#1976d2", "&.Mui-checked": { color: "#1976d2" } }} />} label={myAppGlobal.langT("LT_DATAPAGE_SEL_SENSOR")} />
          <FormControlLabel key={"keyimage"} control={<Checkbox name={"keychi"} checked={isenbimage} onChange={handleChange} sx={{ color: "#1976d2", "&.Mui-checked": { color: "#1976d2" } }} />} label={myAppGlobal.langT("LT_DATAPAGE_SEL_IMAGE")} />
          <FormControlLabel key={"keyevent"} control={<Checkbox name={"keyche"} checked={isenbevent} onChange={handleChange} sx={{ color: "#1976d2", "&.Mui-checked": { color: "#1976d2" } }} />} label={myAppGlobal.langT("LT_DATAPAGE_SEL_EVENT")} />
        </Box>
      </Grid>
    </React.Fragment>
  );
}
