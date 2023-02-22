import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Box, Button, IconButton, Modal, Stack, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

import Grid from "@mui/material/Grid";
import DatePicker from "react-datepicker";
import { forwardRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import KDUtil from "../../commonjs/kdutil";

export default function DatePickerBar(props) {
  const oneDay = 86400000;
  const onGetdb = props.getdb;
  const issearching = props.issearching;
  const isdaily = props.isdaily;
  const onChange = props.onchangedaliy;

  const [curdate, setcurdate] = useState(props.dayDate);
  const [startdate, setStartdate] = useState(props.startDate);
  const [enddate, setEnddate] = useState(props.endDate);

  function onClickday(e) {
    let curday;
    console.log(e);

    switch (e.currentTarget.name) {
      case "oneDayAgo":
        curday = curdate - oneDay;

        break;
      case "oneDayAhead":
        curday = curdate + oneDay;
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
        {value}
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
            <DatePicker value={curdate} selected={curdate} customInput={<MuiCustomInput />} onChange={(date) => handleDatepicker("dayselect", date)} />
            <br />{" "}
            <Typography align="center" fontSize="small">
              하루 데이터를 조회합니다.
            </Typography>{" "}
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
              시작날자
            </Typography>{" "}
          </Typography>

          {issearching == true ? (
            <CircularProgress />
          ) : (
            <IconButton name="searchday" onClick={onClickday}>
              {issearching == true ? null : <QueryStatsIcon fontSize="large" color="secondary" />}
            </IconButton>
          )}
          <Typography align="center" fontSize="small">
            데이터를 조회합니다.
          </Typography>
          <Typography align="center">
            <DatePicker value={enddate} selected={enddate} customInput={<MuiCustomInput />} onChange={(date) => handleDatepicker("endday", date)} />
            <br />{" "}
            <Typography align="center" fontSize="small">
              종료날자
            </Typography>{" "}
          </Typography>
        </Stack>
      );
    }
  }

  return (
    <Grid container spacing={1} sx={{ backgroundColor: "#e3f2fd" }} padding={1}>
      <Grid item xs={3}>
        <FormControl>
          <FormLabel id={"f-label"}>
            <Typography align="left" fontSize="small">
              {"검색방식을 선택하세요."}
            </Typography>
          </FormLabel>
          <RadioGroup row aria-labelledby={"rg-label"} name={"rg-name"} onChange={onChange}>
            <FormControlLabel checked={isdaily} value={"하루(1일)"} label={"하루(1일)"} control={<Radio />} />
            <FormControlLabel checked={!isdaily} value={"기간(60일)"} label={"기간(60일)"} control={<Radio />} />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={8} sx={{ backgroundColor: "#ffffff" }}>
        {pickertype()}
      </Grid>
    </Grid>
  );
}
