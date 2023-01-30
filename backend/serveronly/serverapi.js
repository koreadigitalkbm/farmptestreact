// 백엔드 사용 클라우드 서버에서만 동작하는 API 대부분 DB 관련임.

const KDCommon = require("../kdcommon");
const DatabaseInterface = require("../dbinterface");

const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const Sensordevice = require("../../frontend/myappf/src/commonjs/sensordevice.js");
const responseMessage = require("../../frontend/myappf/src/commonjs/responseMessage");

module.exports = class ServerAPI {
  constructor(mMain) {
    this.servermain = mMain;
    this.fbdatabase = null;
    this.sessionmap = new Map();
    this.DBInterface = new DatabaseInterface(mMain);
  }

  postapifordatabase(req, rsp) {
    const reqmsg = JSON.parse(JSON.stringify(req.body));

    let responsemsg = new responseMessage();

    switch (reqmsg.reqType) {
      case KDDefine.REQType.RT_SETDB_SENSOR:
        console.log("---------------------------------postapifordatabase :  reqmsg :");
        console.log("  sensor devid:" + reqmsg.reqParam.devid);
        //console.log("  reqmsg datetime:" + reqmsg.reqParam.datetime);
        //console.log("  reqmsg sensorlist:" + reqmsg.reqParam.sensorlist);

        let msensors = [];
        for (const mscompact of reqmsg.reqParam.sensorlist) {
          let nsensor = new Sensordevice(mscompact);
          msensors.push(nsensor);
        }

        this.DBInterface.setsensordata(reqmsg.reqParam.devid, reqmsg.reqParam.datetime, msensors);
        responsemsg.IsOK = true;

        break;
      case KDDefine.REQType.RT_SETDB_CAMERA:
        console.log("  camera devid:" + reqmsg.reqParam.devid);
        console.log("  camera datetime:" + reqmsg.reqParam.datetime);
        //console.log("  camera imagedatas:" + reqmsg.reqParam.imagedatas);

        this.DBInterface.setimagefiledata(reqmsg.reqParam.devid, reqmsg.reqParam.datetime, reqmsg.reqParam.cameratype, reqmsg.reqParam.platname, reqmsg.reqParam.imagedatas);
        responsemsg.IsOK = true;

        break;
    }

    rsp.send(JSON.stringify(responsemsg));
  }

  postapi(req, rsp) {
    const reqmsg = JSON.parse(JSON.stringify(req.body));

    const rspmsg = this.messageprocessing(reqmsg);
    rsp.send(JSON.stringify(rspmsg));
  }

  // 서버로 요청하면 디바이스로 요청한다. 파이어베이스 리얼타임디비를 사용하여 메시지를 터널링한다.
  async postapifordevice(req, rsp) {
    let jsonstr = JSON.stringify(req.body);
    let reqmsg = JSON.parse(jsonstr);
    //기본 nak 메시지로 만듬.
    let responsemsg = new responseMessage();

    let reqkey;
    let repskey;
    let repsdata;

    //   for (const [key, value] of this.sessionmap) {
    //     console.log("map key:"+ key + ", vlaue :" +value);
    //  }

    let sid = this.sessionmap.get(reqmsg.uqid);
    let msgisd = req.header("Session-ID");
    console.log("---------------------------------sever sid :" + sid + ", msgisd:" + msgisd + ", reqtype: " + reqmsg.reqType);

    if (sid != msgisd) {
      console.log("session not same ....");
    } else {
      reqkey = this.fbdatabase.ref("IFDevices/" + reqmsg.uqid + "/request");
      repskey = this.fbdatabase.ref("IFDevices/" + reqmsg.uqid + "/response");

      let objJsonB64encode = Buffer.from(jsonstr).toString("base64");
      //응답메시지를 먼저지우고
      repskey.set("");
      reqkey.set(objJsonB64encode);

      //2초간 기다림
      for (var i = 0; i < 10; i++) {
        await KDCommon.delay(200);
        await repskey
          .get()
          .then((snapshot) => {
            if (snapshot.exists()) {
              repsdata = snapshot.val();

              // console.log("farebase i:"+i+", repsdatalenght :"+ repsdata.length  );

              if (repsdata.length > 10) {
                try {
                  let decodedStr = Buffer.from(repsdata, "base64");
                  responsemsg = JSON.parse(decodedStr);

                  i = 10000; //loop out
                } catch (e) {
                  console.log("No data base64 decode error: " + e);
                }
              }
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      //console.log("---------------------------------postapifordevice end : " + responsemsg.datetime);
    }

    rsp.send(JSON.stringify(responsemsg));
  }

  //////////////////////
  messageprocessing(reqmsg) {
    let rspmsg = new responseMessage();

    if (reqmsg.reqType == KDDefine.REQType.RT_LOGIN) {
      console.log("setlogin   pw:  " + reqmsg.reqParam.loginPW + ", SID:" + reqmsg.reqParam.SessionID);
      rspmsg.retMessage = "not";

      {
        // 서버 업데이트용 계정
        if (reqmsg.reqParam.loginID === "adminkd" && reqmsg.reqParam.loginPW === "kd8883") {
          rspmsg.retMessage = "admin";
          rspmsg.retParam = "IF0000";
        }

        if (reqmsg.reqParam.loginID === "kd1" && reqmsg.reqParam.loginPW === "1234") {
          rspmsg.retMessage = "user";
          rspmsg.retParam = "IF0001";
        } else if (reqmsg.reqParam.loginID === "kd2" && reqmsg.reqParam.loginPW === "1234") {
          rspmsg.retMessage = "user";
          rspmsg.retParam = "IF0002";
        } else if (reqmsg.reqParam.loginID === "kd3" && reqmsg.reqParam.loginPW === "1234") {
          rspmsg.retMessage = "user";
          rspmsg.retParam = "IF0003";
        } else if (reqmsg.reqParam.loginID === "kd4" && reqmsg.reqParam.loginPW === "1234") {
          rspmsg.retMessage = "user";
          rspmsg.retParam = "IF0004";
        }

        //로그인 성공이면 세션 ID 저장 해당 ID 가 맞는거만 응답
        if (rspmsg.retMessage != "not") {
          this.sessionmap.set(rspmsg.retParam, reqmsg.reqParam.SessionID);
        }
      }

      rspmsg.IsOK = true;
    }

    console.log("msgprocessing_serveronly   return :  " + rspmsg.IsOK);
    return rspmsg;
  }

  async firebasedbsetup(deviceidlocal) {
    var admin = require("firebase-admin");
    var serviceAccount = require("../../common/private/farmcube-push-firebase-adminsdk-z8u93-e5d8d4f325.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://farmcube-push.firebaseio.com",
    });

    this.fbdatabase = admin.database();
  }
};
