var config = require("../common/private/dbcon");
const mariadb = require("mysql");

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
        //console.log(error);
        //console.log(result);
      });
    } catch (err) {
      console.log("setsensordata eror \n");

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
