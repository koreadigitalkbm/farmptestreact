import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import React,{ useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import Grid from "@mui/material/Grid";
import DatePicker from "react-datepicker";
import { forwardRef } from "react";
import myAppGlobal from "../../myAppGlobal";



export default function DatePickerBar(props) {
  
  const onGetdb = props.getdb;
  const issearching = props.issearching;
  const isdaily = props.isdaily;
  const onChange = props.onchangedaliy;

  const [curdate, setcurdate] = useState(props.dayDate);
  const [startdate, setStartdate] = useState(props.startDate);
  const [enddate, setEnddate] = useState(props.endDate);

  function onClickday(e) {
    let curday;

    //console.log(e.currentTarget);

    switch (e.currentTarget.name) {
      case "oneDayAgo":
        curday = new Date(curdate);
        curday=curday.setDate(curday.getDate()-1);


        break;
      case "oneDayAhead":
        curday = new Date(curdate);
        curday=curday.setDate(curday.getDate()+1);
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
    }
    else
    {
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

  function pickertype() {
    const MuiCustomInput = forwardRef(({ value, onClick }, ref) => (
      <Button onClick={onClick} ref={ref}>
        <Typography align="center" fontSize="large" color="primary">
        {value}
        </Typography>
      </Button>
    ));

    if (isdaily === true) {
      return (
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
          <IconButton name="oneDayAgo" onClick={onClickday}>
            {issearching == true ? null : <KeyboardArrowLeft fontSize="large" color="primary" />}
          </IconButton>
          {issearching == true ? <CircularProgress /> : null}

          <Typography align="center">
            <DatePicker disabled={issearching} value={curdate} selected={curdate} customInput={<MuiCustomInput />} onChange={(date) => handleDatepicker("dayselect", date)} />
            <Typography align="center" fontSize="small">
              {myAppGlobal.langT('LT_DATAPAGE_DATEPICKER_DATEEXPLAIN')}
            </Typography>
          </Typography>

          <IconButton name="oneDayAhead" onClick={onClickday}>
            {issearching == true ? null : <KeyboardArrowRight fontSize="large" color="primary" />}
          </IconButton>
        </Stack>
      );
    } else {
      return (
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
          <Typography align="center">
            <DatePicker value={startdate} selected={startdate} customInput={<MuiCustomInput />} onChange={(date) => handleDatepicker("startday", date)} />
            <br />{" "}
            <Typography align="center" fontSize="small">
            {myAppGlobal.langT('LT_DATAPAGE_DATEPICKER_PERIOD_START')}
            </Typography>{" "}
          </Typography>

          {issearching == true ? (
            <React.Fragment>
            <CircularProgress color="secondary" />
            <Typography align="center" fontSize="small" color="secondary" >
            {myAppGlobal.langT('LT_DATAPAGE_DATEPICKER_SEARCING')}
          </Typography>
          </React.Fragment>
          ) : (
            <IconButton name="searchday" onClick={onClickday}>
              {issearching == true ? null : <QueryStatsIcon fontSize="large" color="secondary" />}
              <Typography align="center" fontSize="small" color="secondary" >
              {myAppGlobal.langT('LT_DATAPAGE_DATEPICKER_PERIOD_CONFIRM')}
          </Typography>

            </IconButton>
          )}
          
          <Typography align="center">
            <DatePicker value={enddate} selected={enddate} customInput={<MuiCustomInput />} onChange={(date) => handleDatepicker("endday", date)} />
            <br />{" "}
            <Typography align="center" fontSize="small">
            {myAppGlobal.langT('LT_DATAPAGE_DATEPICKER_PERIOD_END')}
            </Typography>{" "}
          </Typography>
        </Stack>
      );
    }
  }

  return (
    <Grid container spacing={1} sx={{ backgroundColor: "#eceff1" }} padding={1}>
      <Grid item xs={3}>
        <FormControl>
          
          <RadioGroup row aria-labelledby={"rg-label"} name={"rg-name"} onChange={onChange}>
            <FormControlLabel checked={isdaily} value={"하루(1일)"} label={myAppGlobal.langT('LT_DATAPAGE_DATEPICKER_DATE')} control={<Radio />} />
            <FormControlLabel checked={!isdaily} value={"기간(60일)"} label={myAppGlobal.langT('LT_DATAPAGE_DATEPICKER_PERIOD')} control={<Radio />} />
          </RadioGroup>
          <FormLabel id={"f-label"}>
            <Typography align="left" fontSize="small">
              {myAppGlobal.langT('LT_DATAPAGE_DATEPICKER_EXPLAIN')}
            </Typography>
          </FormLabel>

        </FormControl>
      </Grid>
      <Grid item xs={6} sx={{ backgroundColor: "#ffffff" }}>
        {pickertype()}
      </Grid>
      <Grid item xs={3} sx={{ backgroundColor: "#ffffff" }}>
        ---
      </Grid>
    </Grid>
  );
}
