var config = require("../common/private/dbcon");
const mariadb = require("mysql");
const KDCommon = require("./kdcommon");
const KDUtil = require("../frontend/myappf/src/commonjs/kdutil");

module.exports = class DatabaseInterface {
  constructor(mmain) {
    this.mMain = mmain;
    this.isconnected = false;
    this.conn = mariadb.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: 5,
    });

    //this.conn.connect();

    this.conn.connect((err) => {
      if (err) {
        console.log("not connected due to error: " + err);
        this.mMain.systemlog.memlog("DB 초기화 에러...: " + err);
      } else {
        this.isconnected = true;
        console.log("connected !  ");
        this.mMain.systemlog.memlog("DB 연결 성공...");
      }
    });
  }

  // 센서 데이트를 디비에 저장
  setsensordata(did, dtime, slist) {
    if (this.isconnected == false) {
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
        console.log(error);
        //console.log(result);
      });
    } catch (err) {
      console.log("setsensordata eror \n");

      console.log(err);
    } finally {
    }
  }

  setimagetodb(did, dtime, cameratype, filename) {
    if (this.isconnected == false) {
      return;
    } else {

      

      var sql = "INSERT INTO fjbox.cameraimages (devid, dtime,ctype,filename) VALUES (?,?,?,?)";
      const svalues = [did, dtime, cameratype, filename];
      this.conn.query(sql, svalues, function (error, result) {
        console.log(error);
      });
    }
  }

  //카메라 촬영된 이미지 정보를 디비에 저장하고 이미지파일은 웹서비스 편하도록 리엑트 pulic 폴더에 이미지폴더에 저장
  setimagefiledata(did, dtime, cameratype, platname, filedatabase64, isetdb) {
    try {
      let filepath = "../frontend/myappf/public/cameraimage/" + did + "/";

      // 퍼플릭폴더에 있으므로 파일이름을 알면 이미지를 다운받을수 있기 때문에 뒤부분에 랜덤한 숫자로 10자리 표시
      let filename = "cameara_" + platname + "_" + cameratype + "_" + dtime + "_" + KDUtil.GetRandom10() + ".jpg";

      //메뉴얼저장이면
      if (isetdb == false) {
        filepath = "../frontend/myappf/public/cameraimage/" + did + "/manual/";
        //
        filename = platname;
      }

      // 디렉토리생성
      KDCommon.mkdirRecursive(filepath);
      filename = KDCommon.FilenameCheck(filename);

      filepath = filepath + filename;
      console.log("setimagefildata --- filepath : " + filepath);
      KDCommon.WritefileBase64(filepath, filedatabase64);
      /// 썸네일 이미지도 만들자 나중에
      filepath=filepath.replace(".jpg", "_thum.jpg");
      KDCommon.WritefileBase64(filepath, filedatabase64);


      if (isetdb == true) {
        this.setimagetodb(did, dtime, cameratype, filename);
      }
    } catch (err) {
      console.log("setimagefildata eror \n");
      console.log(err);
    } finally {
    }
  }

  // 그냥테스트 함수
   gettable(rsp, reqmsg, returncallback) {
    
    try {

      const qparam= reqmsg.reqParam;
      const devid = reqmsg.uqid;
      let sqlquery ;
      console.log(qparam);

      if(qparam.TableName =="sensor")
      {
       sqlquery = "SELECT distinct dtime,value,stype FROM sensordatas  WHERE devid ='"+devid+"'" + "  AND dtime>='"+qparam.StartDay+"'" + "  AND  dtime <='"+qparam.EndDay+"'";
      }
      else if(qparam.TableName =="camera")
      {
       sqlquery = "SELECT distinct dtime,ctype,filename FROM cameraimages  WHERE devid ='"+devid+"'" + "  AND dtime>='"+qparam.StartDay+"'" + "  AND  dtime <='"+qparam.EndDay+"'";
      }
      else if(qparam.TableName =="event")
      {
       sqlquery = "SELECT distinct dtime,value,stype FROM sensordatas  WHERE devid ='"+devid+"'" + "  AND dtime>='"+qparam.StartDay+"'" + "  AND  dtime <='"+qparam.EndDay+"'";
      }

       this.conn.query(sqlquery, function (error, result) {
        console.log("get table dtata........ \n");
        //console.log(result);
        returncallback(rsp,result);
  
        
      });
    } catch (err) {
      console.log("get table eror \n");

      console.log(err);
    } finally {
      
    }
  }
};
