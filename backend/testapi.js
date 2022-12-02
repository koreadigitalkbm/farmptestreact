const fs = require("fs");
const os = require("os");
const KDCommon = require("../common/commonjs/kdcommon");

const responseMessage = require("../common/commonjs/responseMessage");
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
  console.log("---------------------------------postapi :  puniqid :" + reqmsg.puniqid);
  let rspmsg = msgprocessing(true, reqmsg);
  rsp.send(JSON.stringify(rspmsg));
}


// 서버로 요청하면 디바이스로 요청한다. 파이어베이스 리얼타임디비를 사용하여 메시지를 터널링한다.
async function postapifordevice(req, rsp) {
  let jsonstr = JSON.stringify(req.body);
  let reqmsg= JSON.parse(jsonstr);
  //기본 nak 메시지로 만듬.
  let responsemsg = new responseMessage();

  console.log("---------------------------------postapifordevice :   backGlobal.islocal :" + backGlobal.islocal + ", did: " + reqmsg.puniqid);

  if (backGlobal.islocal == true) {
    responsemsg = msgprocessing(false, reqmsg);
  } else {
    let reqkey;
    let repskey;
    let repsdata;
    

    reqkey = backGlobal.fbdatabase.ref("IFDevices/"+reqmsg.puniqid+"/request");
    repskey = backGlobal.fbdatabase.ref("IFDevices/"+reqmsg.puniqid+"/response");

    let objJsonB64encode = Buffer.from(jsonstr).toString("base64");
    repskey.set("");
    reqkey.set(objJsonB64encode);

    for (var i = 0; i < 10; i++) {
      await KDCommon.delay(200);
      await repskey
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            repsdata = snapshot.val();
            //        console.log("farebase i:"+i+",get :" + repsdata + " repsdatalenght :"+ repsdata.length);

            if (repsdata.length > 0) {
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

    console.log("---------------------------------postapifordevice end : " + responsemsg.datetime);
  }

  rsp.send(JSON.stringify(responsemsg));
}

function msgprocessing_common(reqmsg) {
  let rspmsg = new responseMessage();

  if (reqmsg.reqType == "setswupdate") {
    softwareupdatefromgit();
    rspmsg.retMessage = "ok";
    rspmsg.IsOK = true;
  } else if (reqmsg.reqType == "getdeviceinfo") {
    rspmsg.retMessage = backGlobal.platformversion;
    rspmsg.IsOK = true;
  } else if (reqmsg.reqType == "getlocaldeviceid") {
    rspmsg.retMessage = backGlobal.mylocaldeviceid;
    rspmsg.IsOK = true;
  }

  console.log("msgprocessing_common   return :  " + rspmsg.IsOK);
  return rspmsg;
}

function msgprocessing_deviceonly(reqmsg, rspmsg) {
  if (reqmsg.reqType == "deviceonly") {
    rspmsg.retMessage = backGlobal.mylocaldeviceid;
    rspmsg.IsOK = true;
  }
  console.log("msgprocessing_deviceonly   return :  " + rspmsg.IsOK);
}

//////////////////////
function msgprocessing_serveronly(reqmsg, rspmsg) {
  if (reqmsg.reqType == "login") {
    console.log("setlogin   pw:  " + reqmsg.loginPW);
    rspmsg.retMessage = "not";

    if (backGlobal.islocal == true) {
      if (reqmsg.loginPW === "1234") {
        rspmsg.retMessage = "user";
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
      }
    }

    rspmsg.IsOK = true;
  }

  console.log("msgprocessing_serveronly   return :  " + rspmsg.IsOK);
}

function msgprocessing(isserver, reqmsg) {
  //공통처리부분
  let rspmsg = msgprocessing_common(reqmsg);
  if (isserver === true) {
    msgprocessing_serveronly(reqmsg, rspmsg);
  } else {
    msgprocessing_deviceonly(reqmsg, rspmsg);
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
      let rspmsg = msgprocessing(false,reqmsg);
      let objJsonB64encode = Buffer.from(JSON.stringify(rspmsg)).toString("base64");
      backGlobal.fblocalresponse.set(objJsonB64encode);
    } catch (e) {
      return false;
    }
  });
}

/*
function postapi() {
  
    
  
    console.log("postapi  up1:"  );
    child = exec("git reset --hard HEAD ", function (error, stdout, stderr) {
        console.log('stdout reset: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    child = exec("git pull ", function (error, stdout, stderr) {
        console.log('stdout pull: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
  

  
  }
*/

exports.postapi = postapi;
exports.postapifordatabase = postapifordatabase;
exports.postapifordevice = postapifordevice;
exports.firebasedbsetup = firebasedbsetup;
exports.firebasedbinit = firebasedbinit;
