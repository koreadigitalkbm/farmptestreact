const config = require("../common/private/dbcon");
const mariadb = require("mysql");
const moment = require("moment");

const KDCommon = require("./kdcommon");
const SystemEvent = require("./localonly/systemevent");

let ismydbconnected = false;
let diconnectcount = 0;


function myFunction(sqlquery, arg2) {
    
  console.log("myFunction sqlquery: \n" + sqlquery);

  console.log(arg2);  // "World"
}



module.exports = class DatabaseInterface {
  constructor(mmain) {
    this.mMain = mmain;

    ismydbconnected = false;
    diconnectcount = 0;

    this.conn = null;

    this.handleDisconnect();
  }

  handleDisconnect() {
    //함수 정의

    try {
      this.conn = mariadb.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        connectionLimit: 100,
      });

      this.conn.connect((err) => {
        if (err) {
          console.log("not connected due to error: " + err);
          this.mMain.systemlog.memlog("DB 초기화 에러...: " + err);
          ismydbconnected = false;
          //this.handleDisconnectthreow(); //연결 오류시 호출하는 재귀함수
          // setTimeout(thisappthrow, 10000); //연결 실패시 100초 후 다시 연결
        } else {
          ismydbconnected = true;
          diconnectcount = 0;
          console.log("connected !  ");
          this.mMain.systemlog.memlog("DB 연결 성공...");
        }
      });

      this.conn.on("error", function (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          console.log("MySql_DBError) PROTOCOL_CONNECTION_LOST");
          ismydbconnected = false;
          diconnectcount = 0;
        } else {
          console.log("MySql_DBError)", err);
        }
      });
    } catch (error) {
      console.log("handleDisconnect error", error);
    }
  }

  dbconnectioncheck() {
    console.log("dbconnectioncheck ismydbconnected : " + ismydbconnected + " diconnectcount:" + diconnectcount);

    if (ismydbconnected == false) {
      diconnectcount++;
    }

    if (diconnectcount >= 10) {
      diconnectcount = 0;
      this.handleDisconnect();
    }

    return ismydbconnected;
  }

  // 센서 데이트를 디비에 저장
  setsensordata(did, dtime, slist) {
    if (this.dbconnectioncheck() == false) {
      return;
    }

    try {
      if (slist.length < 1) {
        return;
      }

      var sql = "INSERT INTO fjbox.sensordatas (devid, dtime,value,nodenum,channel,stype) VALUES ";
      let svalues = [];

      for (const msensor of slist) {
        if (svalues.length > 0) {
          sql += ",";
        }

        let newsv = [did, dtime, msensor.value, msensor.nodeID, msensor.channel, msensor.Sensortype];
        svalues.push(newsv);
        sql += "(?)";
      }

      this.conn.query(sql, svalues, function (error, result) {
        //console.log("setsensordata........------------------------------------- \n" + slist.length);
        //console.log(svalues);
        if (error) {
          console.log(error);
          diconnectcount++;
        } else {
          diconnectcount = 0;
        }

        //console.log(result);
      });
    } catch (err) {
      console.log("setsensordata eror \n");
      console.log(err);
    }
  }

  // 이벤트 데이트를 디비에 저장
  seteventdata(did, newevents) {
    if (this.dbconnectioncheck() == false) {
      return;
    }

    try {
      if (newevents.length < 1) {
        return;
      }

      var sql = "INSERT INTO fjbox.systemevent (devid, dtime,etype,edatas,emessage) VALUES ";
      let items = [];

      for (const mevt of newevents) {
        if (items.length > 0) {
          sql += ",";
        }

        let eparam = SystemEvent.eparamEcodeb64(mevt.EParam);

        //const curdatetime =moment.utc().add(mainclass.localsysteminformations.Systemconfg.timezoneoffsetminutes, 'minutes').format("YYYY-MM-DD HH:mm:ss");

        //이벤트 값을 UTC 값으로 옴 db 저장시 항상 로컬 시간으로 저장
        const curdatetime = mevt.EDate; //moment(mevt.EDate).local().format("YYYY-MM-DD HH:mm:ss");

        //console.log("seteventdata curdatetime :  " + curdatetime);

        let newsv = [did, curdatetime, mevt.EType, eparam, ""];
        items.push(newsv);
        sql += "(?)";
      }

      this.conn.query(sql, items, function (error, result) {
        if (error != null) {
          console.log(error);
        }
      });
    } catch (err) {
      console.log("seteventdata erorr \n");
      console.log(err);
    }
  }

  setimagetodb(did, dtime, cameratype, filename) {
    if (this.dbconnectioncheck() == false) {
      return;
    } else {
      console.log("setimagetodb start");

      var sql = "INSERT INTO fjbox.cameraimages (devid, dtime,ctype,filename) VALUES (?,?,?,?)";
      const svalues = [did, dtime, cameratype, filename];
      this.conn.query(sql, svalues, function (error, result) {
        console.log(error);
      });
    }
  }

  setloginpw(did, userid, userpassword) {
    if (this.dbconnectioncheck() == false) {
      return;
    } else {
      const sqlquery = "UPDATE  fjbox.users  SET  userpw='" + userpassword + "'" + "WHERE userid ='" + userid + "'" + "AND deviceid ='" + did + "'";

      //      console.log("setloginpw sqlquery:"+sqlquery);

      this.conn.query(sqlquery, function (error, result) {
        console.log(error);
      });
    }
  }

  //카메라 촬영된 이미지 정보를 디비에 저장하고 이미지파일은 웹서비스 편하도록 리엑트 pulic 폴더에 이미지폴더에 저장
  async setimagefiledata(did, dtime, cameratype, capturefilename, filedatabase64, isetdb) {
    try {
      let filepath = "../frontend/myappf/public/cameraimage/" + did + "/";

      let filename = capturefilename;
      //메뉴얼저장이면
      if (isetdb == false) {
        filepath = "../frontend/myappf/public/cameraimage/" + did + "/manual/";
        //수동촬영이면 프론트로 부터 파일이름 받아옴.
        //수동촬영은 한장만 있으면 됨으로 기존촬영파일 삭제
        KDCommon.removeallfiles(filepath);
      }

      // 디렉토리생성
      await KDCommon.mkdirRecursive(filepath);

      filepath = filepath + filename;

      console.log("setimagefildata --- filepath : " + filepath);
      KDCommon.WritefileBase64(filepath, filedatabase64);
      /// 썸네일 이미지도 만들자 나중에
      //filepath=filepath.replace(".jpg", "_thum.jpg");
      //KDCommon.WritefileBase64(filepath, filedatabase64);

      if (isetdb == true) {
        this.setimagetodb(did, dtime, cameratype, filename);
      }
    } catch (err) {
      console.log("setimagefildata eror \n");
      console.log(err);
    } finally {
    }
  }

 
    

  


  //  db 검색해서 결과 리턴
  getDBdatas(rsp, reqmsg, returncallback) {
    if (this.dbconnectioncheck() == false) {
      returncallback(rsp, "");
      return;
    }

    try {
      const qparam = reqmsg.reqParam;
      const devid = reqmsg.uqid;
      let sqlquery;
      let sday = qparam.StartDay.replace("T00:00:00.000Z", "");
      let eday = qparam.EndDay.replace("T00:00:00.000Z", "");

      if (qparam.TableName == "sensor") {
        let sqlquerycount = "SELECT   channel  FROM sensordatas  WHERE devid ='" + devid + "'" + "  AND dtime>='" + sday + "'" + "  AND  dtime <'" + eday + "'";

        this.conn.query(sqlquerycount, function (error, result) {
          //console.log(result);
          if (error) {
            console.log("getDBdatas sqlquerycounterror........ \n");
            console.log(error);
          } else {
            console.log("getDBdatas sqlquerycount query end: \n" + result.length);

            if (result.length < 100000) {
              sqlquery = "SELECT  dtime as T,value as V,stype as P, nodenum as N, channel as C FROM sensordatas  WHERE devid ='" + devid + "'" + "  AND dtime>='" + sday + "'" + "  AND  dtime <'" + eday + "'" + "  LIMIT 100000";
            } else if (result.length < 200000) {
              sqlquery = "SELECT  dtime as T,value as V,stype as P, nodenum as N, channel as C FROM sensordatas  WHERE devid ='" + devid + "'" + "  AND dtime>='" + sday + "'" + "  AND  dtime <'" + eday + "'" + " AND   MINUTE(dtime)%2 ='0' " + "  LIMIT 100000";
            } else if (result.length < 500000) {
              sqlquery = "SELECT  dtime as T,value as V,stype as P, nodenum as N, channel as C FROM sensordatas  WHERE devid ='" + devid + "'" + "  AND dtime>='" + sday + "'" + "  AND  dtime <'" + eday + "'" + " AND   MINUTE(dtime)%5 ='0' " + "  LIMIT 100000";
            } else {
              sqlquery = "SELECT  dtime as T,value as V,stype as P, nodenum as N, channel as C FROM sensordatas  WHERE devid ='" + devid + "'" + "  AND dtime>='" + sday + "'" + "  AND  dtime <'" + eday + "'" + " AND   MINUTE(dtime)%10 ='0' " + "  LIMIT 100000";
            }

            setTimeout(myFunction, 1000, "sqlquery", "World");

            
        
          }
        });
      } else {
        if (qparam.TableName == "camera") {
          sqlquery = "SELECT  dtime,ctype,filename FROM cameraimages  WHERE devid ='" + devid + "'" + "  AND dtime>='" + sday + "'" + "  AND  dtime <'" + eday + "'";
        } else if (qparam.TableName == "event") {
          sqlquery = "SELECT  dtime,etype,edatas FROM systemevent  WHERE devid ='" + devid + "'" + "  AND dtime>='" + sday + "'" + "  AND  dtime <'" + eday + "'";
        }

        console.log("getDBdatas query start: \n" + sqlquery);

        this.conn.query(sqlquery, function (error, result) {
          //console.log(result);
          if (error) {
            console.log("getDBdatas error........ \n");
            console.log(error);
            diconnectcount++;
            returncallback(rsp, "");
          } else {
            console.log("getDBdatas query end: \n" + sqlquery);
            diconnectcount = 0;
            returncallback(rsp, result);
          }
        });
      }
    } catch (err) {
      console.log("getDBatas eror");
      console.log(err);
    }
  }

  getusersinfo(callbackresult) {
    try {
      let sqlquery;
      sqlquery = "SELECT distinct userid,userpw,usertype,deviceid FROM  users ";

      this.conn.query(sqlquery, function (error, result) {
        console.log("getusersinfo........ \n");
        //callbackresult(result)
        callbackresult.push(...result);
      });
    } catch (err) {
      console.log("getusersinfo  eror \n");
      console.log(err);
    }
  }
};
