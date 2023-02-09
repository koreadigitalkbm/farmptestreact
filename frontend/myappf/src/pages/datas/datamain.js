import { useState, useEffect, useMemo } from "react";

import DBQueryParam from "../../commonjs/dbqueryparam";
import DashboardChart from "../home/dashboardchart";
import myAppGlobal from "../../myAppGlobal";


//홈 메인 대시보드
const DataMainPage = () => {
  const [camimages, setCamimages] = useState([]);
  const [moutdevarray, setActuator] = useState([]);
  const [mevnetarray, setEvents] = useState([]);
  const [mdailysensorarray, setDailysensor] = useState([]);
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
      console.log(ret.retMessage);
    });

    let dbqcam = new DBQueryParam(sday, eday, "camera");
    myAppGlobal.farmapi.getDataformDB(dbqcam).then((ret) => {
      console.log("-------------------------getdb camera: " + ret.IsOK);
      console.log(ret.retMessage);
    });
  }

  return (
    <div>
      <div>
        데이터검색
        <button className="" onClick={getdb}>
          검색
        </button>
        <DashboardChart chartdatas={mdailysensorarray} lasttime={msensorlasttime} />
      </div>

      <div>이미지검색</div>
      <div>이벤트검색</div>
    </div>
  );
};

export default DataMainPage;
