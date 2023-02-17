import { useState, useEffect, useMemo } from "react";

import DBQueryParam from "../../commonjs/dbqueryparam";

import SensorDataChart from "./sensordatachart";
import myAppGlobal from "../../myAppGlobal";
import KDUtil from "../../commonjs/kdutil";
import Systemeventdisplay from "../home/systemeventdisplay";
import {Buffer}  from "buffer";
import TitlebarBelowImageList from "./Himagedisplay";
import { ThemeProvider} from '@mui/material';
import muiTheme from '../muiTheme';


import DataVisualization from '../pages/components/dataVisualization';
import TableEventSystem from '../pages/components/tableEventSystem'
import ShowVerticalImages from '../pages/components/showVerticalImages';



let sevents = [];
let cmeraimglist = [];
let sensordatas = [];
//홈 메인 대시보드
const DataMainPage = (props) => {
  const [camimages, setCamimages] = useState(cmeraimglist);
  const [moutdevarray, setActuator] = useState([]);
  const [mevnetarray, setEvents] = useState(sevents);
  const [sensorarray, setSensorarray] = useState(sensordatas);
  const [msensorlasttime, setLasttime] = useState(1);

  console.log("-------------------------DataMainPage  ---------------------");

  useEffect(() => {
    console.log("-------------------------DataMainPage  useEffect---------------------issetreq:");
  }, []);



  function getdb() {
    let utcnow = new Date();

    let sday = new Date(utcnow.getFullYear(), utcnow.getMonth(), utcnow.getDate(), 0, 0, 0, 0);
    sday = new Date(sday.getTime() - sday.getTimezoneOffset() * 60 * 1000);

    let eday = new Date(utcnow.getFullYear(), utcnow.getMonth(), utcnow.getDate(), 23, 59, 59, 0);
    eday = new Date(eday.getTime() - eday.getTimezoneOffset() * 60 * 1000);

    let dbq = new DBQueryParam(sday, eday, "sensor");

    myAppGlobal.farmapi.getDataformDB(dbq).then((ret) => {

      console.log("-------------------------getdb sensor: " + ret.IsOK);
      if(ret.IsOK  ==true)
      {
        console.log(ret.retMessage);
        sensordatas=ret.retMessage;
        setSensorarray(sensordatas);

      }
      

    });

    let dbqcam = new DBQueryParam(sday, eday, "camera");
    myAppGlobal.farmapi.getDataformDB(dbqcam).then((ret) => {
      console.log("-------------------------getdb camera: " + ret.IsOK);
      console.log(ret.retMessage);

      const imglist = ret.retMessage;
      cmeraimglist=[];
      if (imglist != null) {
        for (let i = 0; i < imglist.length; i++) {
         
            let fileurl= "/cameraimage/" + myAppGlobal.logindeviceid + "/" + imglist[i].filename ;
            console.log("fileurl:"+ fileurl);

            let newimg= 
            {
                img: fileurl,
                title:imglist[i].dtime,
                author: imglist[i].ctype,
            }
            
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
            
            sevents.push(createData(newobj.EDate,newobj.EType,KDUtil.EventToString(newobj,myAppGlobal,true)));
            // console.log(elist[i]);
            // console.log(newobj);
          }
        }
      }

      setEvents(sevents);
    });
  }
  

  // 표 헤더 정의. key값으로써 i18n으로 변환될 수 있어야 함.
  const tableHeader = ['date', 'type', 'content'];

  // 표에서 필터링할 행 정의. 아직 미구현
  const tableFilter = 'type'

  // 헤더에 맞춰서 표 내용을 Object로 만들어줌.
  function createData(date, type, content) {
    return {
        date,
        type,
        content,
    };
}

  


  return (

    <ThemeProvider theme={muiTheme}>
      <div>
        데이터검색
        <button className="" onClick={getdb}>
          검색
        </button>
        
      </div>

      <SensorDataChart  datas={sensorarray} />
    <ShowVerticalImages imageSet={camimages}/>
    <TableEventSystem tableHeader={tableHeader} tableFilter={tableFilter} dataSet={mevnetarray}/>
    
      </ThemeProvider>


    
  );
};

export default DataMainPage;
