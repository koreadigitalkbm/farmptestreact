// 백엔드 사용 로컬 장비에서 구동되는 API

const KDCommon = require("../kdcommon");
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const responseMessage = require("../../frontend/myappf/src/commonjs/responseMessage");


module.exports = class ServerAPI {
  constructor(mMain) {
    this.servermain=mMain;
    this.fbdatabase = null;
    this.sessionmap = new Map();
  }

  postapifordatabase(req, rsp) {
    let reqmsg = JSON.parse(JSON.stringify(req.body));
    console.log("---------------------------------postapifordatabase :  reqmsg :" + reqmsg);
    let responsemsg = new responseMessage();
    rsp.send(JSON.stringify(responsemsg));
  }

  postapi(req, rsp) {
    let reqmsg = JSON.parse(JSON.stringify(req.body));
    
    let rspmsg = this.messageprocessing(reqmsg);
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
