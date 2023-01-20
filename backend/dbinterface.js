var config = require("../common/private/dbcon");
const mariadb = require("mysql");
const KDCommon = require("./kdcommon");
const KDUtil = require("../frontend/myappf/src/commonjs/kdutil");

module.exports = class DatabaseInterface {
  constructor() {
    this.conn = mariadb.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: 5,
    });

    this.conn.connect();
  }

  // 센서 데이트를 디비에 저장
  setsensordata(did, dtime, slist) {
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

  //카메라 촬영된 이미지 정보를 디비에 저장하고 이미지파일은 웹서비스 편하도록 리엑트 pulic 폴더에 이미지폴더에 저장
  setimagefiledata(did, dtime, cameratype, platname, filedatabase64) {
    try {
      var sql = "INSERT INTO fjbox.cameraimages (devid, dtime,ctype,filename) VALUES (?,?,?,?)";

      // 퍼플릭폴더에 있으므로 파일이름을 알면 이미지를 다운받을수 있기 때문에 뒤부분에 랜덤한 숫자로 10자리 표시 
      let filename = "cameara_" + platname + "_" + cameratype + "_" + dtime + "_" + KDUtil.GetRandom10() + ".jpg";

      filename = KDCommon.FilenameCheck(filename);

      let svalues = [did, dtime, cameratype, filename];

      //
      let filepath = "../frontend/myappf/public/cameraimage/" + did + "/";

      KDCommon.mkdirRecursive(filepath);
      filepath = filepath + filename;

      console.log("setimagefiledata --- filepath : " + filepath);

      KDCommon.WritefileBase64(filepath, filedatabase64);

      this.conn.query(sql, svalues, function (error, result) {
        console.log(error);
      });
    } catch (err) {
      console.log("setimagefiledata eror \n");

      console.log(err);
    } finally {
    }
  }

  // 그냥테스트 함수
  gettable() {
    try {
      this.conn.query("SELECT * FROM sensordatas", function (error, result) {
        console.log("get table dtata........ \n");
        console.log(result);
      });
    } catch (err) {
      console.log("get table eror \n");

      console.log(err);
    } finally {
    }
  }
};
