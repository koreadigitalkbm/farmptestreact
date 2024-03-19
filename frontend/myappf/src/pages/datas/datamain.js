import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { Buffer } from "buffer";

import DBQueryParam from "../../commonjs/dbqueryparam";

import SensorDataChart from "./sensordatachart";
import myAppGlobal from "../../myAppGlobal";
import KDUtil from "../../commonjs/kdutil";
import ChartDataUtil from "./datautil";

import { ThemeProvider } from "@mui/material";
import muiTheme from "../muiTheme";

import EventListView from "./eventlistview";
import ShowVerticalImages from "../pages/components/showVerticalImages";
import DatePickerBar from "./datepickerbar";

let sevents_period = [];
let cmeraimglist_period = [];
let sensordatas_period = [];

let sevents_daily = [];
let cmeraimglist_daily = [];
let sensordatas_daily = [];

let utcnow = new Date();
let startday = new Date(utcnow - 7 * 86400000);
let endday = utcnow; //
let daydate = utcnow; //
let isdailyglobal = true;
let isdailyfirst = true;
//홈 메인 대시보드
const DataMainPage = (props) => {
  const [isdaily, setisdaily] = useState(isdailyglobal);
  const [issearching, setissearching] = useState(false);
  const [camimages, setCamimages] = useState([]);
  const [mevnetarray, setEvents] = useState([]);
  const [sensorarray, setSensorarray] = useState([]);

  const [enbsensor, setenbsensor] = useState(true);
  const [enbimage, setenbimage] = useState(true);
  const [enbevent, setenbevent] = useState(true);

  console.log("-------------------DataMainPage  --------------------- :" +myAppGlobal.isdatamaininit);


  if(myAppGlobal.isdatamaininit === false)
  {

    
    sevents_period = [];
    cmeraimglist_period = [];
    sensordatas_period = [];

    sevents_daily = [];
    cmeraimglist_daily = [];
    sensordatas_daily = [];

    utcnow = new Date();
    startday = new Date(utcnow - 7 * 86400000);
    endday = utcnow; //
    daydate = utcnow; //
    isdailyglobal = true;
    isdailyfirst = true;

    myAppGlobal.isdatamaininit=true;
  }

  
  function onChangeEnable(ename) {
    
    if(ename ===  "keychs" )
    {
      setenbsensor(!enbsensor);
    }
    if(ename ===  "keychi" )
    {
      setenbimage(!enbimage);
    }

    if(ename ===  "keyche" )
    {
      setenbevent(!enbevent);
    }


  }



  function setupdata(isdailys) {
    if (isdailys === true) {
      setSensorarray(sensordatas_daily);
      setEvents(sevents_daily);
      setCamimages(cmeraimglist_daily);
    } else {
      setSensorarray(sensordatas_period);
      setEvents(sevents_period);
      setCamimages(cmeraimglist_period);
    }
  }

  useEffect(() => {
    console.log("DataMainPage  useEffect-----isdaily:" + isdaily + ", isdailyfirst:" + isdailyfirst);

    if (isdailyfirst == true && isdaily == true) {
      const nowdate = new Date();
      isdailyfirst = false;
      getdbsearch(nowdate, nowdate);
    } else {
      setupdata(isdaily);
    }
  }, [issearching]);





  function getdbsearch(stday, edday) {
    console.log("-------------------------getdbsearch  ---------------------");
    //console.log("stday : "+ stday);
    //console.log("edday : "+ edday);

    let sevents = [];
    let cmeraimglist = [];
    let sensordatas = [];

    setissearching(true);

    

    let stdayonly = new Date(stday.getFullYear(), stday.getMonth(), stday.getDate(), 0, 0, 0, 0);
    let eddayonly = new Date(edday.getFullYear(), edday.getMonth(), edday.getDate(), 0, 0, 0, 0);

    
    console.log("stdayonly : " + stdayonly);
    console.log("eddayonly : " + eddayonly);

    let sday =new Date(stdayonly.getTime() - stdayonly.getTimezoneOffset() * 60000);
    let eday =new Date(eddayonly.getTime() - eddayonly.getTimezoneOffset() * 60000 + 24*60*60000);//하루더함

       console.log("sday : "+ sday);
      console.log("eday : "+ eday);

    let dbq = new DBQueryParam(sday, eday, "sensor");

    myAppGlobal.farmapi.getDataformDB(dbq).then((ret) => {
      console.log("-------------------------getdb sensor: " + ret.IsOK);
      if (ret.IsOK == true) {
        //console.log(ret.retMessage);
        sensordatas = ret.retMessage;

        if (isdaily === true) {
          sensordatas_daily = ChartDataUtil.getchartdatafromsensor(sensordatas);
        } else {
          sensordatas_period = ChartDataUtil.getchartdatafromsensor(sensordatas);
        }
      }
    });

    let dbqcam = new DBQueryParam(sday, eday, "camera");
    myAppGlobal.farmapi.getDataformDB(dbqcam).then((ret) => {
      console.log("-------------------------getdb camera: " + ret.IsOK);
      //console.log(ret.retMessage);

      const imglist = ret.retMessage;
      cmeraimglist = [];
      if (imglist != null) {
        for (let i = 0; i < imglist.length; i++) {
          let fileurl = "/cameraimage/" + myAppGlobal.logindeviceid + "/" + imglist[i].filename;
          //  console.log("fileurl:" + fileurl);

          let newimg = {
            img: fileurl,
            title: imglist[i].dtime,
            author: imglist[i].ctype,
          };
          let timeimg = new Date(imglist[i].dtime);
          if (isdaily === true) {
            newimg.title = KDUtil.dateTostringshottime(timeimg);
          } else {
            newimg.title = timeimg.toLocaleString();
          }

          cmeraimglist.push(newimg);
        }
        //setCamimages(cmeraimglist);
        if (isdaily === true) {
          cmeraimglist_daily = cmeraimglist;
        } else {
          cmeraimglist_period = cmeraimglist;
        }
      }
    });

    let dbevt = new DBQueryParam(sday, eday, "event");
    myAppGlobal.farmapi.getDataformDB(dbevt).then((ret) => {
      console.log("-------------------------getdb event: " + ret.IsOK);
      //console.log(ret.retMessage);
      setissearching(false);
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

            const etime = new Date(newobj.EDate);
            sevents.push(createData(etime.toLocaleString(myAppGlobal.language), newobj.EType, KDUtil.EventToString(newobj, myAppGlobal, true)));
            //console.log(elist[i]);
            // console.log(newobj);
          }
        }
      }

      //setEvents(sevents);
      if (isdaily === true) {
        sevents_daily = sevents;
      } else {
        sevents_period = sevents;
      }
      setissearching(false);
      
    });
  }

  // 헤더에 맞춰서 표 내용을 Object로 만들어줌.
  function createData(date, type, content) {
    return {
      date,
      type,
      content,
    };
  }

  function onChangeDaily() {
    isdailyglobal = !isdaily;

    setupdata(isdailyglobal);

    setisdaily(isdailyglobal);
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <DatePickerBar getdb={getdbsearch} dayDate={daydate} startDate={startday} endDate={endday} isdaily={isdaily} issearching={issearching} onchangedaliy={onChangeDaily}  onChenb={onChangeEnable} enbs={enbsensor} enbi={enbimage} enbe={enbevent} />
          </Grid>
          <Grid item xs={12} md={12}>
            {enbsensor=== true? <SensorDataChart datas={sensorarray} isdaily={isdaily} />:null}
            
          </Grid>
          <Grid item xs={12} md={12}>
          {enbimage=== true? <ShowVerticalImages imageSet={camimages} />:null}
          </Grid>
          <Grid item xs={12} md={12}>
          {enbevent=== true? <EventListView dataSet={mevnetarray} isdash={false} />:null}
            
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default DataMainPage;
