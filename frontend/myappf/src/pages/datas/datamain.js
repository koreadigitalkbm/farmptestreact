import { useState, useEffect, useMemo } from "react";

import DBQueryParam from "../../commonjs/dbqueryparam";

import SensorDataChart from "./sensordatachart";
import myAppGlobal from "../../myAppGlobal";
import KDUtil from "../../commonjs/kdutil";
import Systemeventdisplay from "../home/systemeventdisplay";
import { Buffer } from "buffer";
import TitlebarBelowImageList from "./Himagedisplay";
import { ThemeProvider } from "@mui/material";
import muiTheme from "../muiTheme";
import { AppBar, Box, Button, CssBaseline, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";


import TableEventSystem from "../pages/components/tableEventSystem";
import ShowVerticalImages from "../pages/components/showVerticalImages";
import DatePickerBar from "./datepickerbar";

let sevents = [];
let cmeraimglist = [];
let sensordatas = [];


let utcnow = new Date();
let startday = new Date(utcnow -7*86400000);
let endday = utcnow;//
let daydate = utcnow;//
let isdailyglobal=true;


//홈 메인 대시보드
const DataMainPage = (props) => {

  const [isdaily, setisdaily] = useState(isdailyglobal);
  const [issearching, setissearching] = useState(false);
  const [camimages, setCamimages] = useState(cmeraimglist);
  const [mevnetarray, setEvents] = useState(sevents);
  const [sensorarray, setSensorarray] = useState(sensordatas);
  

  console.log("-------------------------DataMainPage  --------------------- daydate: " + daydate);

  useEffect(() => {
    console.log("-------------------------DataMainPage  useEffect---------------------issetreq:");
  }, []);

  function getdbsearch(stday, edday) {


  console.log("-------------------------getdbsearch  ---------------------");
  console.log("stday : "+ stday);
  console.log("edday : "+ edday);
  if(isdaily ==true)
  {
    daydate=stday;
  }


  setissearching(true);
    
    
    //sday = new Date(sday.getTime() - sday.getTimezoneOffset() * 60 * 1000);
    
    let stdayonly= new Date(stday.getFullYear(), stday.getMonth(), stday.getDate(), 0, 0, 0, 0); 
    let eddayonly= new Date(edday.getFullYear(), edday.getMonth(), edday.getDate(), 23, 59, 59, 0);

    console.log("stdayonly : "+ stdayonly);
  console.log("eddayonly : "+ eddayonly);


    let sday = new Date(stdayonly.getTime() - stdayonly.getTimezoneOffset() * 60000);
    let eday = new Date(eddayonly.getTime() - eddayonly.getTimezoneOffset() * 60000);



    console.log("sday : "+ sday.toLocaleString());
  console.log("eday : "+ eday.toLocaleDateString());


  
    let dbq = new DBQueryParam(sday, eday, "sensor");

    myAppGlobal.farmapi.getDataformDB(dbq).then((ret) => {
      console.log("-------------------------getdb sensor: " + ret.IsOK);
      if (ret.IsOK == true) {
        console.log(ret.retMessage);
        sensordatas = ret.retMessage;
        setSensorarray(sensordatas);
      }
    });

    let dbqcam = new DBQueryParam(sday, eday, "camera");
    myAppGlobal.farmapi.getDataformDB(dbqcam).then((ret) => {
      console.log("-------------------------getdb camera: " + ret.IsOK);
      console.log(ret.retMessage);

      const imglist = ret.retMessage;
      cmeraimglist = [];
      if (imglist != null) {
        for (let i = 0; i < imglist.length; i++) {
          let fileurl = "/cameraimage/" + myAppGlobal.logindeviceid + "/" + imglist[i].filename;
          console.log("fileurl:" + fileurl);

          let newimg = {
            img: fileurl,
            title: imglist[i].dtime,
            author: imglist[i].ctype,
          };
          let timeimg=new Date(imglist[i].dtime);
          newimg.title = timeimg.toLocaleString();

          cmeraimglist.push(newimg);
        }
        setCamimages(cmeraimglist);
      }
    });

    let dbevt = new DBQueryParam(sday, eday, "event");
    myAppGlobal.farmapi.getDataformDB(dbevt).then((ret) => {
      console.log("-------------------------getdb event: " + ret.IsOK);
      //console.log(ret.retMessage);

      const elist = ret.retMessage;
      sevents = [];
      if (elist != null) {
        for (let i = 0; i < elist.length; i++) {
          const jsonString = Buffer.from(elist[i].edatas, "base64").toString();

          if (jsonString.length > 10) {
            const paramobj2 = JSON.parse(jsonString);

            let newobj = {
              EDate: elist[i].dtime,
              EType: elist[i].etype,
              EParam: paramobj2,
            };

            sevents.push(createData(newobj.EDate, newobj.EType, KDUtil.EventToString(newobj, myAppGlobal, true)));
            // console.log(elist[i]);
            // console.log(newobj);
          }
        }
      }

      setEvents(sevents);
      setissearching(false);
    });
  }

  // 표 헤더 정의. key값으로써 i18n으로 변환될 수 있어야 함.
  const tableHeader = ["date", "type", "content"];

  // 표에서 필터링할 행 정의. 아직 미구현
  const tableFilter = "type";

  // 헤더에 맞춰서 표 내용을 Object로 만들어줌.
  function createData(date, type, content) {
    return {
      date,
      type,
      content,
    };
  }
  

    function onChangeDaily()
    {

      isdailyglobal= !isdaily;
        setisdaily(isdailyglobal);
    }


  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <DatePickerBar   getdb={getdbsearch}  dayDate ={daydate} startDate ={startday} endDate = {endday}  isdaily ={isdaily} issearching={issearching} onchangedaliy={onChangeDaily} />
          </Grid>
          <Grid item xs={12} md={12}>
            <SensorDataChart datas={sensorarray}  isdaily={isdaily} />
          </Grid>
          <Grid item xs={12} md={12}>
            <ShowVerticalImages imageSet={camimages} />
          </Grid>
          <Grid item xs={12} md={12}>
            <TableEventSystem tableHeader={tableHeader} tableFilter={tableFilter} dataSet={mevnetarray} />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default DataMainPage;
