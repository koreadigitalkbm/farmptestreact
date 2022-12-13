const fs = require("fs");
const os = require("os");
const KDCommon = require("./kdcommon");
const KDDefine = require("../frontend/myappf/src/commonjs/kddefine");
const responseMessage = require("../frontend/myappf/src/commonjs/responseMessage");
var backGlobal = require("./backGlobal");
var exec = require("child_process").exec;

function postapifordatabase(req, rsp) {
  let reqmsg = JSON.parse(JSON.stringify(req.body));
  console.log("---------------------------------postapifordatabase :  reqmsg :" + reqmsg);

  let responsemsg = new responseMessage();
  rsp.send(JSON.stringify(responsemsg));
}

function postapi(req, rsp) {
  let reqmsg = JSON.parse(JSON.stringify(req.body));
  console.log("----------------------postapi :  puniqid :" + reqmsg.puniqid + ", type: " + reqmsg.reqType + ", did : " + backGlobal.mylocaldeviceid);
  let rspmsg = messageprocessing(true, reqmsg);
  rsp.send(JSON.stringify(rspmsg));
}

// 서버로 요청하면 디바이스로 요청한다. 파이어베이스 리얼타임디비를 사용하여 메시지를 터널링한다.
async function postapifordevice(req, rsp) {
  let jsonstr = JSON.stringify(req.body);
  let reqmsg = JSON.parse(jsonstr);
  //기본 nak 메시지로 만듬.
  let responsemsg = new responseMessage();

  //console.log("---------------------------------postapifordevice :   backGlobal.islocal :" + backGlobal.islocal + ", did: " + reqmsg.puniqid + ", SID:" + req.header("Session-ID"));

  if (backGlobal.islocal == true) {
    responsemsg = messageprocessing(false, reqmsg);
  } else {
    let reqkey;
    let repskey;
    let repsdata;

    //    for (const [key, value] of backGlobal.sessionmap) {
    //      console.log("map key:"+ key + ", vlaue :" +value);
    //    }

    let sid = backGlobal.sessionmap.get(reqmsg.puniqid);
    let msgisd = req.header("Session-ID");
    console.log("---------------------------------sever sid :" + sid + ", msgisd:" + msgisd + ", reqtype: "+ reqmsg.reqType);

    if (sid != msgisd) {
      console.log("session not same ....");
    } else {
      reqkey = backGlobal.fbdatabase.ref("IFDevices/" + reqmsg.puniqid + "/request");
      repskey = backGlobal.fbdatabase.ref("IFDevices/" + reqmsg.puniqid + "/response");

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
              
              if (repsdata.length > 10) {
                try {
                  let decodedStr = Buffer.from(repsdata, "base64");
                  responsemsg = JSON.parse(decodedStr);
                  console.log("farebase i:"+i+",responsemsg :" + responsemsg + " repsdatalenght :"+ repsdata.length  );

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
    }

    //console.log("---------------------------------postapifordevice end : " + responsemsg.datetime);
  }

  rsp.send(JSON.stringify(responsemsg));
}

function msgprocessing_common(reqmsg) {
  let rspmsg = new responseMessage();

  
  switch (reqmsg.reqType) {
    case KDDefine.REQType.RT_SWUPDATE:
      softwareupdatefromgit();
      rspmsg.retMessage = "ok";
      rspmsg.IsOK = true;
      break;

    case KDDefine.REQType.RT_GETVERSION:
      rspmsg.retMessage = backGlobal.platformversion;
      rspmsg.IsOK = true;
      break;

    case KDDefine.REQType.RT_DEVICELOG:
      rspmsg.retMessage = backGlobal.systemlog;
      rspmsg.IsOK = true;
      break;

    case KDDefine.REQType.RT_SYSTEMINIFO:
      if (backGlobal.localsysteminformations != null) {
        rspmsg.retMessage = backGlobal.localsysteminformations;
        rspmsg.IsOK = true;
      }
      break;

    case KDDefine.REQType.RT_SENSORSTATUS:
      if (backGlobal.actuatorinterface != null) {
        rspmsg.retMessage = backGlobal.actuatorinterface.getactuatorstatus();
        rspmsg.IsOK = true;
      }
      break;
    case KDDefine.REQType.RT_ACTUATOROP:
      if (reqmsg.OutputManual != null) {
        backGlobal.actuatorinterface.setoperationmanual(reqmsg.OutputManual);
      }
      rspmsg.retMessage = "ok";
      rspmsg.IsOK = true;
      break;

    case KDDefine.REQType.RT_SYSTEMSTATUS:
      if (backGlobal.sensorinterface != null) {
        rspmsg.Sensors = backGlobal.sensorinterface.getsensorssimple();
      }
      if (backGlobal.actuatorinterface != null) {
        rspmsg.Outputs = backGlobal.actuatorinterface.getactuatorstatus();
      }
      console.log("---------------------------------RT_SYSTEMSTATUS Sensors length : " + rspmsg.Sensors.length);


      rspmsg.IsOK = true;
      break;

    case KDDefine.REQType.RT_SETMYINFO:
      KDCommon.Writefilejson(KDCommon.systemconfigfilename, reqmsg.reqParam);
      rspmsg.retMessage = "ok";
      rspmsg.IsOK = true;
      break;
  }

  //console.log("msgprocessing_common   return :  " + rspmsg.IsOK);
  return rspmsg;
}

//////////////////////
function msgprocessing_serveronly(reqmsg, rspmsg) {
  if (reqmsg.reqType == KDDefine.REQType.RT_LOGIN) {
    console.log("setlogin   pw:  " + reqmsg.loginPW + ", SID:" + reqmsg.SessionID);
    rspmsg.retMessage = "not";

    if (backGlobal.islocal == true) {
      //일반사용자
      if (reqmsg.loginPW === backGlobal.localsysteminformations.Systemconfg.password) {
        rspmsg.retMessage = "user";
        rspmsg.retParam = backGlobal.mylocaldeviceid;
      }
      ///장비 관리자로그인 장비공장설정이 가능한 상태임
      if (reqmsg.loginPW === "kd8883") {
        rspmsg.retMessage = "factoryadmin";
        rspmsg.retParam = backGlobal.mylocaldeviceid;
      }
    } else {
      // 서버 업데이트용 계정
      if (reqmsg.loginID === "adminkd" && reqmsg.loginPW === "kd8883") {
        rspmsg.retMessage = "admin";
        rspmsg.retParam = "IF0000";
      }

      if (reqmsg.loginID === "kd1" && reqmsg.loginPW === "1234") {
        rspmsg.retMessage = "user";
        rspmsg.retParam = "IF0001";
      } else if (reqmsg.loginID === "kd2" && reqmsg.loginPW === "1234") {
        rspmsg.retMessage = "user";
        rspmsg.retParam = "IF0002";
      } else if (reqmsg.loginID === "kd3" && reqmsg.loginPW === "1234") {
        rspmsg.retMessage = "user";
        rspmsg.retParam = "IF0003";
      } else if (reqmsg.loginID === "kd4" && reqmsg.loginPW === "1234") {
        rspmsg.retMessage = "user";
        rspmsg.retParam = "IF0004";
      }

      //로그인 성공이면 세션 ID 저장 해당 ID 가 맞는거만 응답
      if (rspmsg.retMessage != "not") {
        backGlobal.sessionmap.set(rspmsg.retParam, reqmsg.SessionID);
      }
    }

    rspmsg.IsOK = true;
  }

  console.log("msgprocessing_serveronly   return :  " + rspmsg.IsOK);
}

function messageprocessing(isserver, reqmsg) {
  //공통처리부분
  let rspmsg = msgprocessing_common(reqmsg);
  if (isserver === true) {
    msgprocessing_serveronly(reqmsg, rspmsg);
  }
  return rspmsg;
}

function softwareupdatefromgit() {
  console.log("softwareupdatefromgit  up1:");

  child = exec("git pull ", function (error, stdout, stderr) {
    console.log("stdout pull: " + stdout);
    console.log("stderr: " + stderr);
    if (error !== null) {
      console.log("exec error: " + error);
    }
  });
}

function setMyInfo(reqmsg) {
  const newInfo = {
    name: reqmsg.deviceName,
    deviceuniqid: reqmsg.deviceID,
    comport: reqmsg.comport,
    password: reqmsg.password,
    productname: reqmsg.productname,
    productmodel: reqmsg.productmodel
  }

  const newInfoJSON = JSON.stringify(newInfo)
  fs.writeFileSync('./../common/local_files/systemconfig.json', reqmsg.reqParam)
}

async function firebasedbinit() {
  console.log("firebasedbinit : ");

  var admin = require("firebase-admin");
  var serviceAccount = require("../common/private/farmcube-push-firebase-adminsdk-z8u93-e5d8d4f325.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://farmcube-push.firebaseio.com",
  });

  backGlobal.fbdatabase = admin.database();
}

async function firebasedbsetup(deviceidlocal) {
  console.log("firebasedbtest  deviceidlocal: " + deviceidlocal);

  const reqkeystr = "IFDevices/" + deviceidlocal + "/request";
  const reskeystr = "IFDevices/" + deviceidlocal + "/response";

  backGlobal.fblocalrequst = backGlobal.fbdatabase.ref(reqkeystr);
  backGlobal.fblocalresponse = backGlobal.fbdatabase.ref(reskeystr);

  backGlobal.fblocalrequst.on("value", (snapshot) => {
    const data = snapshot.val();
    console.log("frebase frrequest local on event... data: " + data);

    try {
      let decodedStr = Buffer.from(data, "base64");
      var reqmsg = JSON.parse(decodedStr);
      let rspmsg = messageprocessing(false, reqmsg);
      let objJsonB64encode = Buffer.from(JSON.stringify(rspmsg)).toString("base64");
      backGlobal.fblocalresponse.set(objJsonB64encode);
      console.log("frebase response set: " +objJsonB64encode);

    } catch (e) {
      console.log("firebasedbsetup error: " + e);

      return false;
    }
  });
}


exports.postapi = postapi;
exports.postapifordatabase = postapifordatabase;
exports.postapifordevice = postapifordevice;
exports.firebasedbsetup = firebasedbsetup;
exports.firebasedbinit = firebasedbinit;
