import { useState, useEffect, useMemo } from "react";
import { AppBar, Box, Button, CssBaseline, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Sensordisplay from "./sensordisplay";
import myAppGlobal from "../../myAppGlobal";
import ActuatorDisplay from "./actuatordisplay";
import Systemeventdisplay from "./systemeventdisplay";
import DashboardChart from "./dashboardchart";

let lasteventtime = 1;
let lastsensortime = 1;
let readtimemsec = 1000;
let readcallbacktimeout;
//화면 출력 빨리 되도록 기존데이터 저장하고 있음
let eventlist = [];
let eventlistTime = [];
let dailysensorlist = [];
let actuaotrslist = [];
let sensorlist = [];
let imagefilename = "image/noimage.png";
let isoffscreen = false;

//홈 메인 대시보드
const HDashboard = () => {
  const [msensorsarray, setSensors] = useState(sensorlist);
  const [mactuaotrs, setActuator] = useState(actuaotrslist);
  const [mevnetarray, setEvents] = useState(eventlistTime);
  const [mdailysensorarray, setDailysensor] = useState(dailysensorlist);
  const [mimgfileurl, setImgfileurl] = useState(imagefilename);
  
  const [msensorlasttime, setLasttime] = useState(1);

  console.log("-------------------------HDashboard  ---------------------");

  function loaddatas() {
    let nowdate = new Date();
    console.log("-------------------------loaddata date: " + nowdate + " readtimemsec: " + readtimemsec);

    myAppGlobal.farmapi.getDeviceStatus(true, true, false, lastsensortime, lasteventtime).then((ret) => {
      //console.log(ret);
      if (ret == null) {
      } else if (ret.IsOK == true) {
        let sensors = ret.Sensors;
        let actuators = ret.Outputs;

        if (sensors != null) {
          console.log("sensors length:" + sensors.length);
          if (sensors.length > 0) {
            sensorlist = [];
            sensorlist.push(...sensors);
            setSensors(sensorlist);
          }
        }

        if (actuators != null) {
          console.log("actuators : " + actuators.length);
          if (actuators.length > 0) {
            actuaotrslist = [];
            actuaotrslist.push(...actuators);
            setActuator(actuaotrslist);
          }
        }

        if (ret.retParam != null) {
          let sysevents = ret.retParam.DEvents;
          let dsensors = ret.retParam.DSensors;

          

          if(ret.retParam.LastimageFilename !=null)
          {
            if(imagefilename !=ret.retParam.LastimageFilename)
            {

              imagefilename = ret.retParam.LastimageFilename;
              let fileurl= "/cameraimage/" + myAppGlobal.logindeviceid + "/" +imagefilename;
              console.log("capture fileurl : " + fileurl );    
              setImgfileurl(fileurl);
            }

            
          }
          


          if (sysevents != null) {

            

            if (sysevents.length > 0) {
              let revlasttime;
              let isupdateevent = false;

              console.log("sysevents : " + sysevents.length + "  ,lasevttime : " + Date(lasteventtime));

              for (let i = 0; i < sysevents.length; i++) {
                revlasttime = sysevents[i].EDate;
                if (revlasttime > lasteventtime) {
                  eventlist.push(sysevents[i]);
                  isupdateevent = true;
                  //   console.log("r i : " + i + " eventtime : " + revlasttime + " lasteventtime: " + lasteventtime);
                }
              }

              if (isupdateevent === true) {
                lasteventtime = revlasttime;
                console.log("update event : " + Date(lasteventtime) + " lenth : " + eventlist.length);
                eventlistTime = [];
                for (let i = 0; i < eventlist.length; i++) {
                  eventlistTime.push(eventlist[eventlist.length - i - 1]);
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
                if (recivelasttime > lastsensortime) {
                  dailysensorlist.push(dsensors[i]);
                  isupdate = true;
                }
              }
              if (isupdate === true) {
                lastsensortime = recivelasttime;
                setDailysensor(dailysensorlist);
                setLasttime(recivelasttime);
                console.log("update sensor : " + Date(lastsensortime) + " lenth : " + dailysensorlist.length);
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
    console.log("-------------------------HDashboard  useEffect---------------------issetreq:");
    //aws 접속이면 5초에 한번만 읽자 머니 나가니까.
    if (myAppGlobal.islocal === false || myAppGlobal.islocal === "false") {
      readtimemsec = 3000;
    }

    clearTimeout(readcallbacktimeout);
    isoffscreen = false;
    readcallbacktimeout = setTimeout(loaddatas, readtimemsec);

    return () => {
      console.log("컴포넌트가 화면에서 사라짐 isoffscreen: " + isoffscreen);
      isoffscreen = true;
      clearTimeout(readcallbacktimeout);
    };

    /*
    const interval = setInterval(() => {
     
      loaddatas();

    }, readtimemsec);

    console.log("-------------------------HDashboard  finish--------------------- out:" + interval);
    return () => clearInterval(interval);

*/
  }, []);

  //이벤트가 변경될때만 렌더링되도록
  const eventbox = useMemo(() => {
    return <Systemeventdisplay mevtlist={mevnetarray} />;
  }, [mevnetarray]);

  const chartbox = useMemo(() => {
    return <DashboardChart chartdatas={mdailysensorarray} lasttime={msensorlasttime} imgfileurl ={mimgfileurl} />;
  }, [mdailysensorarray, msensorlasttime]);

  return (
    <Box sx={{ flexDirection: "row" }}>
      {chartbox}
      <Sensordisplay sensors={msensorsarray} />
      <ActuatorDisplay actuators={mactuaotrs} />
      {eventbox}
    </Box>
  );
};

export default HDashboard;
