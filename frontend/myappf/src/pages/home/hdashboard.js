import { useState, useEffect, useMemo } from "react";
import { Box, Stack,Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import AccessTimeIcon from '@mui/icons-material/AccessTime';


import Sensordisplay from "./sensordisplay";
import myAppGlobal from "../../myAppGlobal";
import ActuatorDisplay from "./actuatordisplay";
import DashboardChart from "./dashboardchart";
import EventListView from "../datas/eventlistview";
import KDUtil from "../../commonjs/kdutil";


//let lasteventtime = 1;
//let lastsensortime = 1;

//화면 출력 빨리 되도록 기존데이터 저장하고 있음
let eventlist = [];
let eventlistTime = [];
let dailysensorlist = [];
//let actuaotrslist = [];
//let sensorlist = [];


let readtimemsec = 1000;
let readcallbacktimeout=null;

//let imagefilename = "";
let lastfileurl = "image/noimage.png";
let isoffscreen = false;

let init_count=0;

//홈 메인 대시보드
const HDashboard = (props) => {
  const [msensorsarray, setSensors] = useState(myAppGlobal.gsensorlist);
  const [mactuaotrs, setActuator] = useState(myAppGlobal.gactuaotrslist);
  const [mevnetarray, setEvents] = useState(eventlistTime);
  const [mdailysensorarray, setDailysensor] = useState(dailysensorlist);
  const [mimgfileurl, setImgfileurl] = useState(lastfileurl);
  const [msensorlasttime, setLasttime] = useState(null);
  const [isdataloading, setDataloading] = useState(false);


  console.log("-------------------------HDashboard  --------------------- : ");
  
  function loaddatas() {
    let nowdate = new Date();

    init_count++;
    console.log("-------------------------loaddata date: " + nowdate + " readtimemsec: " + readtimemsec + " init_count = " +init_count);



      //aws 접속이면 5초에 한번만 읽자 머니 나가니까.
      if (myAppGlobal.islocal === false || myAppGlobal.islocal === "false") {
        readtimemsec = 30000;
      } else {
        readtimemsec = 3000;
      }
  
      if(init_count <20)
      {
        readtimemsec = 3000;
      }



    setDataloading(true);
    myAppGlobal.farmapi.getDeviceStatus(true, true, false, myAppGlobal.dashboardlastsensortime, myAppGlobal.dashboardlasteventtime).then((ret) => {
      //console.log(ret);
      setDataloading(false);
      if (ret == null) {
      } else if (ret.IsOK == true) {
        let sensors = ret.Sensors;
        let actuators = ret.Outputs;

        if( ret.retMessage!=null)
        {
          if(ret.retMessage ==="unotherslogin")
          {
            console.log("un other login:" + ret.retMessage );  
            props.otherlogin("otherlogin");

          }
        }
        if (sensors != null) {
          console.log("sensors length:" + sensors.length);
          if (sensors.length > 0) {
            myAppGlobal.gsensorlist = [];
            myAppGlobal.gsensorlist.push(...sensors);
            

            setSensors(myAppGlobal.gsensorlist);
          }
        }

        if (actuators != null) {
          console.log("actuators : " + actuators.length);
          if (actuators.length > 0) {
            myAppGlobal.gactuaotrslist = [];
            myAppGlobal.gactuaotrslist.push(...actuators);
            setActuator(myAppGlobal.gactuaotrslist);
          }
        }

        if (ret.retParam != null) {
          let sysevents = ret.retParam.DEvents;
          let dsensors = ret.retParam.DSensors;

         
          if (ret.retParam.LastimageFilename != null) {
            //myAppGlobal.dashboardimagefileurl = ret.retParam.LastimageFilename;
            myAppGlobal.dashboardimagefileurl = "/cameraimage/" + myAppGlobal.logindeviceid + "/" + ret.retParam.LastimageFilename;

            if (mimgfileurl != myAppGlobal.dashboardimagefileurl) {
              
            
              //console.log("capture fileurl : " + lastfileurl);
              //console.log("capture fileurl mimgfileurl: " + mimgfileurl);
              setImgfileurl(myAppGlobal.dashboardimagefileurl);
            }
          }

          if (sysevents != null) {
            if (sysevents.length > 0) {
              let revlasttime;
              let isupdateevent = false;

              console.log("sysevents : " + sysevents.length + "  ,lasevttime : " + Date(myAppGlobal.dashboardlasteventtime));

              for (let i = 0; i < sysevents.length; i++) {
                revlasttime = sysevents[i].EDate;
                if (revlasttime > myAppGlobal.dashboardlasteventtime) {
                  eventlist.push(sysevents[i]);
                  isupdateevent = true;
                  //   console.log("r i : " + i + " eventtime : " + revlasttime + " lasteventtime: " + myAppGlobal.dashboardlasteventtime);
                }
              }

              function createData(date, type, content) {
                return {
                  date,
                  type,
                  content,
                };
              }

              if (isupdateevent === true) {
                myAppGlobal.dashboardlasteventtime = revlasttime;
                console.log("update event : " + Date(myAppGlobal.dashboardlasteventtime) + " lenth : " + eventlist.length);
                eventlistTime = [];
                for (let i = 0; i < eventlist.length; i++) {
                  let newobj = eventlist[eventlist.length - i - 1];
                  const etime = new Date(newobj.EDate);
                  eventlistTime.push(createData(etime.toLocaleString(myAppGlobal.language), newobj.EType, KDUtil.EventToString(newobj, myAppGlobal, true)));
                  //    eventlistTime.push(eventlist[eventlist.length - i - 1]);
                  //  console.log(eventlist[eventlist.length - i - 1]);
                }

                setEvents(eventlistTime);
              }
            }
          }

          if (dsensors != null) {
            console.log("dsensors : " + dsensors.length);
            if (dsensors.length > 0) {
              let recivelasttime;
              let isupdate = false;

              for (let i = 0; i < dsensors.length; i++) {
                recivelasttime = dsensors[i].SDate;
                if (recivelasttime > myAppGlobal.dashboardlastsensortime) {
                  dailysensorlist.push(dsensors[i]);
                  isupdate = true;
                }
              }
              if (isupdate === true) {
                myAppGlobal.dashboardlastsensortime = recivelasttime;
                setDailysensor(dailysensorlist);
                setLasttime(recivelasttime);
                

                console.log("update sensor : " + Date(myAppGlobal.dashboardlastsensortime) + " lenth : " + dailysensorlist.length);
                // console.log(dailysensorlist);
              }
            }
          }
        }
      }
      clearTimeout(readcallbacktimeout);
      if (isoffscreen == false) {
        readcallbacktimeout = setTimeout(loaddatas, readtimemsec);
      }
    });
  }

  useEffect(() => {
    console.log("-------------------------HDashboard  useEffect---------------------readtimemsec:" +readtimemsec);
    
    init_count=0;    
    readtimemsec = 1000;
    setImgfileurl(myAppGlobal.dashboardimagefileurl);
    
    clearTimeout(readcallbacktimeout);
    isoffscreen = false;
    readcallbacktimeout = setTimeout(loaddatas, readtimemsec);

    return () => {
      console.log("컴포넌트가 화면에서 사라짐 isoffscreen: " + isoffscreen);
      isoffscreen = true;

      clearTimeout(readcallbacktimeout);
    };

    
  }, []);

  //이벤트가 변경될때만 렌더링되도록
  const eventbox = useMemo(() => {
    return <EventListView dataSet={mevnetarray} isdash={true} />;
  }, [mevnetarray]);

  const chartbox = useMemo(() => {
    return <DashboardChart chartdatas={mdailysensorarray} lasttime={msensorlasttime} />;
  }, [mdailysensorarray, msensorlasttime]);
  const ldate = new Date(msensorlasttime);
  let lastime ="...";

  if(ldate.getFullYear() >2000)
  {
  lastime = myAppGlobal.langT("LT_MAINPAGE_MAIN_LATESTUPDATE")+":   " + ldate.toLocaleString(myAppGlobal.language);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
      
      
      
        <Grid item xs={12} md={12}>
        <Stack direction="row" spacing={1}>

          

    
          <Typography component="div" size="1rem"  color="#0d47a1"  sx={{width:24, height:24 }}>
          {isdataloading === true ? <CircularProgress  size="1rem"  /> : <AccessTimeIcon  />}             
          </Typography>

          <Typography component="div" variant="body2" fontSize="32" color="#0d47a1"  style={{ verticalAlign: "middle" }}>
          
            {lastime}
          </Typography>
    
          </Stack>
        </Grid>

        <Grid item xs={8}>
          {chartbox}
        </Grid>
        <Grid item xs={4}>
          <Box component="img" src={mimgfileurl} sx={{ maxWidth: 400 }} />
        </Grid>
        <Grid item xs={12} md={12}>
          <Sensordisplay sensors={msensorsarray} />
        </Grid>
        <Grid item xs={12} md={12}>
          <ActuatorDisplay actuators={mactuaotrs} />
        </Grid>
        <Grid item xs={12} md={12}>
          {eventbox}
        </Grid>
      </Grid>
    </Box>
  );
};

export default HDashboard;
