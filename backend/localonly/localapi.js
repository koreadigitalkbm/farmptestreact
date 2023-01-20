// 백엔드 사용 로컬 장비에서 구동되는  통신 API

const KDCommon = require("../kdcommon");
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const responseMessage = require("../../frontend/myappf/src/commonjs/responseMessage");
const reqMessage = require("../../frontend/myappf/src/commonjs/reqMessage");

var exec = require("child_process").exec;

const SERVERAPI_URL = "http://52.79.226.255/api/";

module.exports = class LocalAPI {
  constructor(fversion, mMain) {
    this.fbdatabase = null;
    this.localmain = mMain;
    this.platformversion = fversion;
    this.mylocaldeviceid = mMain.localsysteminformations.Systemconfg.deviceuniqid;
  }

  postapifordatabase(req, rsp) {
    let reqmsg = JSON.parse(JSON.stringify(req.body));
    console.log("---------------------------------postapifordatabase :  reqmsg :" + reqmsg);
    let responsemsg = new responseMessage();
    rsp.send(JSON.stringify(responsemsg));
  }

  postapi(req, rsp) {
    let reqmsg = JSON.parse(JSON.stringify(req.body));
    console.log("----------------------postapi :  uqid :" + reqmsg.uqid + ", type: " + reqmsg.reqType + ", did : " + this.mylocaldeviceid);
    let rspmsg = this.messageprocessing(reqmsg);
    rsp.send(JSON.stringify(rspmsg));
  }

  // 서버로 요청하면 디바이스로 요청한다. 파이어베이스 리얼타임디비를 사용하여 메시지를 터널링한다.
  async postapifordevice(req, rsp) {
    let jsonstr = JSON.stringify(req.body);
    let reqmsg = JSON.parse(jsonstr);
    //기본 nak 메시지로 만듬.
    let responsemsg = this.messageprocessing(reqmsg);

    rsp.send(JSON.stringify(responsemsg));
  }

  messageprocessing(reqmsg) {
    let rspmsg = new responseMessage();
    console.log("------------local messageprocessing :  req type :" + reqmsg.reqType);
    switch (reqmsg.reqType) {
      case KDDefine.REQType.RT_LOGIN:
        if (reqmsg.reqParam.loginPW === this.localmain.localsysteminformations.Systemconfg.password) {
          rspmsg.retMessage = "user";
          rspmsg.retParam = this.mylocaldeviceid;
        }
        ///장비 관리자로그인 장비공장설정이 가능한 상태임
        if (reqmsg.reqParam.loginPW === "kd8883") {
          rspmsg.retMessage = "factoryadmin";
          rspmsg.retParam = this.mylocaldeviceid;
        }
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_SWUPDATE:
        this.softwareupdatefromgit();
        rspmsg.retMessage = "ok";
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_GETVERSION:
        rspmsg.retMessage = this.platformversion;
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_DEVICELOG:
        rspmsg.retMessage = "devicelog";
        rspmsg.retParam = this.localmain.systemlog;
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_SYSTEMINIFO:
        if (this.localmain.localsysteminformations != null) {
          rspmsg.retParam = this.localmain.localsysteminformations;
          rspmsg.IsOK = true;
        }
        break;

      case KDDefine.REQType.RT_GETAUTOCONTROLCONFIG:
        if (this.localmain.autocontrolinterface != null) {
          rspmsg.retParam = this.localmain.autocontrolinterface.getautocontrolconfigall();
          rspmsg.IsOK = true;
        }
        break;

      case KDDefine.REQType.RT_SENSORSTATUS:
        if (this.localmain.sensorinterface != null) {
          rspmsg.Sensors = this.localmain.sensorinterface.getsensorssimple();
          rspmsg.IsOK = true;
        }
        break;
      case KDDefine.REQType.RT_ACTUATOROPERATION:
        if (reqmsg.reqParam != null) {
          this.localmain.actuatorinterface.setoperationmanual(reqmsg.reqParam);
        }
        rspmsg.retMessage = "ok";
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_SYSTEMSTATUS:
        if (this.localmain.sensorinterface != null && reqmsg.reqParam.isSEN === true) {
          rspmsg.Sensors = this.localmain.sensorinterface.getsensorssimple();
        }
        if (this.localmain.actuatorinterface != null && reqmsg.reqParam.isACT === true) {
          rspmsg.Outputs = this.localmain.actuatorinterface.getactuatorstatus();
        }
        // 시간이 0으로오면 요청없음
        if (this.localmain.dailydatas != null && reqmsg.reqParam.STime > 0) {
          rspmsg.retParam = this.localmain.dailydatas.getdatabytime(reqmsg.reqParam.STime, reqmsg.reqParam.ETime);
        }
        //      console.log("---------------------------------RT_SYSTEMSTATUS  lenisSENgth : " + reqmsg.reqParam.isSEN + " lastSensorTime:"+ reqmsg.reqParam.STime);

        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_SETMYINFO:
        KDCommon.Writefilejson(KDCommon.systemconfigfilename, reqmsg.reqParam);
        rspmsg.retMessage = "ok";
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_SAVEAUTOCONTROLCONFIG:
        this.localmain.autocontrolinterface.AutocontrolUpdate(reqmsg.reqParam);
        rspmsg.retMessage = "ok";
        rspmsg.IsOK = true;
        break;
    }

    //console.log("msgprocessing_common   return :  " + rspmsg.IsOK);
    return rspmsg;
  }

  async firebasedbsetup() {
    var admin = require("firebase-admin");
    var serviceAccount = require("../../common/private/farmcube-push-firebase-adminsdk-z8u93-e5d8d4f325.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://farmcube-push.firebaseio.com",
    });

    console.log("---------------------------------firebasedbsetup  mylocaldeviceid: " + this.mylocaldeviceid);

    this.fbdatabase = admin.database();

    const reqkeystr = "IFDevices/" + this.mylocaldeviceid + "/request";
    const reskeystr = "IFDevices/" + this.mylocaldeviceid + "/response";

    const fblocalrequst = this.fbdatabase.ref(reqkeystr);
    const fblocalresponse = this.fbdatabase.ref(reskeystr);

    fblocalrequst.on("value", (snapshot) => {
      const data = snapshot.val();
      //console.log("frebase frrequest local on event... data: " + data);

      try {
        let decodedStr = Buffer.from(data, "base64");
        var reqmsg = JSON.parse(decodedStr);
        let rspmsg = this.messageprocessing(reqmsg);
        let objJsonB64encode = Buffer.from(JSON.stringify(rspmsg)).toString("base64");
        fblocalresponse.set(objJsonB64encode);
        //console.log("frebase response set: " +objJsonB64encode);
      } catch (e) {
        console.log("firebasedbsetup error: " + e);

        return false;
      }
    });
  }

  softwareupdatefromgit() {
    console.log("softwareupdatefromgit  up1:");

    child = exec("git pull ", function (error, stdout, stderr) {
      console.log("stdout pull: " + stdout);
      console.log("stderr: " + stderr);
      if (error !== null) {
        console.log("exec error: " + error);
      }
    });
  }

  async setsensordatatoserver(did, dtime, slist) {
    const reqmsg = new reqMessage(did, KDDefine.REQType.RT_SETDB_SENSOR);
    reqmsg.reqParam = {
      devid: did,
      datetime: dtime,
      sensorlist: slist,
    };
    return await this.setRequestServer(reqmsg);
  }

  async setcameradatatoserver(did, dtime, ctype, pname, mimage) {
    const reqmsg = new reqMessage(did, KDDefine.REQType.RT_SETDB_CAMERA);
    reqmsg.reqParam = {
      devid: did,
      datetime: dtime,
      cameratype: ctype,
      platname: pname,
      imagedatas: mimage,
    };
    return await this.setRequestServer(reqmsg);
  }

  async postData(reqURL = "", data = {}) {
    console.log("postData  url:" + reqURL);

    let response = await fetch(reqURL, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
        "Session-ID": 877,
      },
      body: JSON.stringify(data), //
    });
    //return response.json();
  }

  // 서버, 또는장비에 데이터 저장 요청
  async setRequestServer(mReqmsg) {
    let resdata;

    try {
      resdata = await this.postData(SERVERAPI_URL + "dbrequest", mReqmsg);
      //      console.log(" setRequest rsp : " + resdata.IsOK);
    } catch (error) {
      console.log(" setRequestServer error : " + error);
    } finally {
      console.log(" setRequestServer finally  : ");
      return resdata;
    }
  }
};
