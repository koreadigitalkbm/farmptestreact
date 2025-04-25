// 백엔드 사용 클라우드 서버에서만 동작하는 API 대부분 DB 관련임.

const KDCommon = require("../kdcommon");
const DatabaseInterface = require("../dbinterface");

const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const Sensordevice = require("../../frontend/myappf/src/commonjs/sensordevice.js");
const responseMessage = require("../../frontend/myappf/src/commonjs/responseMessage");
const SystemEvent = require("../localonly/systemevent");

module.exports = class ServerAPI {
  constructor(fversion, mMain) {
    this.platformversion = fversion;
    this.servermain = mMain;
    this.fbdatabase = null;
    this.sessionmap = new Map();
    this.messagequeuemap = new Map();
    this.messagequeuemapviewer = new Map();
    this.messagequeuemapviewer_response = new Map(); // 뷰어 메시지는 저장후 동일한 요청이오면 여기에서 응답함.

    this.DBInterface = new DatabaseInterface(mMain);

    this.isneeduserinforead = true;

    this.userinfos = [];
    this.DBInterface.getusersinfo(this.userinfos);
  }

  //콜백함수에서 응답해야한다면 이함수를사용하자.
  callbackreturn(rsp, mparam) {
    let rspmsg = new responseMessage();
    rspmsg.retMessage = mparam;
    rspmsg.IsOK = true;
    console.log("callbackreturn mparam:" + mparam.length);
    return rsp.send(JSON.stringify(rspmsg));
  }

  postapiforfirebase(req, rsp) {
    try {
      //console.log("---------------------------------postapiforfirebase  ");
      const reqmsg = JSON.parse(JSON.stringify(req.body));
      let mapid = reqmsg.devID;
      if (reqmsg.reqType != null) {
        mapid = reqmsg.devID + reqmsg.reqType;
      //  console.log("-------------------postapiforfirebase :  reqmsg devid :" + reqmsg.devID + " reqType: " + reqmsg.reqType);
      } else {
        mapid = reqmsg.devID;
      }

      let respp = this.messagequeuemap.get(mapid);
      if (respp != null) {
        if (!respp.headersSent) {
          respp.send(JSON.stringify(reqmsg));
        }
      }

      if (!rsp.headersSent) {
        rsp.send("ok");
      }
    } catch (error) {
      console.log("---------------------------------postapiforfirebase  error : " + error.toString());
    }
  }

  postapiforfirebaseviewer(req, rsp) {
    try {
      //console.log("---------------------------------postapiforfirebase  ");
      const reqmsg = JSON.parse(JSON.stringify(req.body));
      let mapid = reqmsg.devID;
      if (reqmsg.reqType != null) {
        mapid = reqmsg.devID + reqmsg.reqType;
        //console.log("-------------------postapiforfirebaseviewer :  reqmsg devid :" + reqmsg.devID + " reqType: " + reqmsg.reqType);
      } else {
        mapid = reqmsg.devID;
      }

      this.messagequeuemapviewer_response.set(mapid, reqmsg);
      let respp = this.messagequeuemapviewer.get(mapid);
      if (respp != null) {
        if (!respp.headersSent) {
          respp.send(JSON.stringify(reqmsg));
        }
      }

      //console.log("---------------------------------postapiforfirebase  END : " + respp);
      if (!rsp.headersSent) {
        rsp.send("error");
      }
    } catch (error) {
      console.log("---------------------------------postapiforfirebaseviewer  error : " + error.toString());
    }
  }

  postapiforjbu(req, rsp) {
    try {
      return this.DBInterface.getDBdatasJBU(rsp, req, this.callbackreturn);

      // console.log("---------------------------------postapiforDB END:");
    } catch (error) {
      console.log("----------------------server---------postapiforjbu error : " + error.toString());
    }
  }

  postapifordatabase(req, rsp) {
    try {
      // console.log("---------------------------------postapifordatabase  ");
      const reqmsg = JSON.parse(JSON.stringify(req.body));
      let responsemsg = new responseMessage();
      let isvalid = false;

      // console.log("----postapiforDB :  DID :" + reqmsg.reqParam.devid + " type:" + reqmsg.reqType);

      if (reqmsg.reqParam != null) {
        isvalid = true;
      }

      if (isvalid === true) {
        switch (reqmsg.reqType) {
          //db 관련 쿼리실행후 결과 콜백이 오면 그때 리턴

          case KDDefine.REQType.RT_SETDB_LOGINPWVIEWER:
            this.DBInterface.setloginpwviewer(reqmsg.reqParam.devid, reqmsg.reqParam.userid, reqmsg.reqParam.userpw);
            this.isneeduserinforead = true;

            responsemsg.IsOK = true;

            break;

          case KDDefine.REQType.RT_SETDB_LOGINPW:
            //        console.log("  devid:" + reqmsg.reqParam.devid);

            this.DBInterface.setloginpw(reqmsg.reqParam.devid, reqmsg.reqParam.userid, reqmsg.reqParam.userpw);
            this.isneeduserinforead = true;

            responsemsg.IsOK = true;

            break;

          case KDDefine.REQType.RT_GETDB_DATAS:
            return this.DBInterface.getDBdatas(rsp, reqmsg, this.callbackreturn);

          case KDDefine.REQType.RT_SETDB_EVENT:
            //        console.log("  devid:" + reqmsg.reqParam.devid);

            let mevents = [];
            for (const mevt of reqmsg.reqParam.eventlist) {
              // console.log("  RT_SETDB_EVENT EDate :" + mevt.EDate);
              let newev = SystemEvent.Clonbyjsonobj(mevt);
              mevents.push(newev);
            }

            this.DBInterface.seteventdata(reqmsg.reqParam.devid, mevents);
            responsemsg.IsOK = true;

            break;

          case KDDefine.REQType.RT_SETDB_SENSOR:
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
            console.log("  camera issetdbase:" + reqmsg.reqParam.issetdbase);
            console.log("  camera file length:" + reqmsg.reqParam.imagedatas.length);

            this.DBInterface.setimagefiledata(reqmsg.reqParam.devid, reqmsg.reqParam.datetime, reqmsg.reqParam.cameratype, reqmsg.reqParam.cfilename, reqmsg.reqParam.imagedatas, reqmsg.reqParam.issetdbase);
            responsemsg.IsOK = true;

            break;
        }
      }

      rsp.send(JSON.stringify(responsemsg));

      // console.log("---------------------------------postapiforDB END:");
    } catch (error) {
      console.log("---------------------------------postapifordatabase error : " + error.toString());
    }
  }

  postapi(req, rsp) {
    try {
      //console.log("---------------------------------postapi--  ");
      const reqmsg = JSON.parse(JSON.stringify(req.body));
      const rspmsg = this.messageprocessing(reqmsg);
      rsp.send(JSON.stringify(rspmsg));
    } catch (error) {
      console.log("---------------------------------postapi error : " + error.toString());
    }
  }

  // 서버로 요청하면 디바이스로 요청한다. 파이어베이스 리얼타임디비를 사용하여 메시지를 터널링한다.
  async postapifordevice(req, rsp) {
    try {
      // console.log("---------------------------------postapifordevice--  ");

      const jsonstr = JSON.stringify(req.body);
      const reqmsg = JSON.parse(jsonstr);
      //기본 nak 메시지로 만듬.
      let responsemsg = new responseMessage();

      //   for (const [key, value] of this.sessionmap) {
      //     console.log("map key:"+ key + ", vlaue :" +value);
      //  }

      let sid = this.sessionmap.get(reqmsg.uqid);
      let msgisd = req.header("Session-ID");
      //console.log("-------------sever uqid:" + reqmsg.uqid + ", sid :" + sid + ", msgisd:" + msgisd + ", reqtype: " + reqmsg.reqType + " time:" + reqmsg.Time);

      if (sid != msgisd) {
        console.log("session not same ....");
        responsemsg.IsOK = true;
        responsemsg.retMessage = "unotherslogin";
        rsp.send(JSON.stringify(responsemsg));
      } else {
        const reqkey = this.fbdatabase.ref("IFDevices/" + reqmsg.uqid + "/request");

        let mapid = reqmsg.uqid;
        if (reqmsg.reqType != null) {
          mapid = reqmsg.uqid + reqmsg.reqType;
        }

        this.messagequeuemap.set(mapid, rsp);

        let objJsonB64encode = Buffer.from(jsonstr).toString("base64");
        reqkey.set(objJsonB64encode);

        // 이벤트 등록되어있음 파이어베이스에 데이터 갱신되면 mapid 찾아 응답함.

        // 이벤트 리스너 한번만

        /*
      repskey.once("value", (snapshot) => {
        const repsdata = snapshot.val();
        //        console.log(repsdata);

        if (repsdata != null) {
          if(repsdata.length>4)
          {
          const decodedStr = Buffer.from(repsdata, "base64");
          responsemsg = JSON.parse(decodedStr);
          console.log("responsemsg success................ :" + ", msgisd :" + msgisd + " reqtime:" + reqmsg.Time + " reptime:" + responsemsg.Time);

          let respp = this.messagequeuemap.get(reqmsg.uqid);
          respp.send(JSON.stringify(responsemsg));
          

          //rsp.send(JSON.stringify(responsemsg));
          //받은 데이터는 지운다. 다시응답하지 않게
          repskey.set("");
          }
        }
      });
      */

        /*
      //2초간 기다림
      for (var i = 0; i < 10; i++) {
        await KDCommon.delay(200);
        await repskey
          .get()
          .then((snapshot) => {
            if (snapshot.exists()) {
              repsdata = snapshot.val();

               console.log("farebase i:"+i+", msgisd :"+ msgisd  + " time:" + reqmsg.Time);

              if (repsdata.length > 30) {
                try {
                  let decodedStr = Buffer.from(repsdata, "base64");
                  responsemsg = JSON.parse(decodedStr);

                  console.log("out success................ i:"+i+", msgisd :"+ msgisd  +  " time:" + reqmsg.Time);

                  i = 10000; //loop out
                  
                  
                } catch (e) {
                  console.log("No data base64 decode error: " + e);
                }
              }
              else
              {
                
                if(repsdata!=ismyreqid)
                {
                  console.log("no ................ repsdata:"+repsdata+", ismyreqid :"+ ismyreqid  +  " time:" + reqmsg.Time);

                  i = 10000; //loop out
                }
              }

            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.log("fb error : ");
            console.error(error);
          });
      }
      */
      }
    } catch (error) {
      console.log("---------------------------------postapifordevice error : " + error.toString());
    }
  }

  // 서버로 요청하면 디바이스로 요청한다. 파이어베이스 리얼타임디비를 사용하여 메시지를 터널링한다.
  async postapifordeviceviewer(req, rsp) {
    try {
      //      console.log("---------------------------------postapifordeviceviewer--  ");

      const jsonstr = JSON.stringify(req.body);
      const reqmsg = JSON.parse(jsonstr);

      const reqkey = this.fbdatabase.ref("IFDevices/" + reqmsg.uqid + "/requestviewer");

      let mapid = reqmsg.uqid;
      if (reqmsg.reqType != null) {
        mapid = reqmsg.uqid + reqmsg.reqType;
      }

      // 마지막 요청이 있으면 응답함.
      let reqmsg_last = this.messagequeuemapviewer_response.get(mapid);

      if (reqmsg_last != null) {
        // 시간 문자열에서 분 데이터만 추출하여 비교
        const getMinuteFromTime = (timeStr) => {
          const [ampm, time] = timeStr.split(" ");
          const [hours, minutes] = time.split(":").map(Number);
          return minutes;
        };

        const reqMinute = getMinuteFromTime(reqmsg.Time);
        const lastMinute = getMinuteFromTime(reqmsg_last.Time);

        // 분이 같으면 같은 시간으로 간주
        const isSameMinute = reqMinute === lastMinute;

        //console.log("-------------severviewer last mapid:" + mapid + ", reqMinute:" + reqMinute + ", lastMinute:" + lastMinute + ", isSameMinute:" + isSameMinute);

        if (isSameMinute) {
          //console.log("-------------severviewer last send ok");
          return rsp.send(JSON.stringify(reqmsg_last));
        }
      }

      this.messagequeuemapviewer.set(mapid, rsp);

      let objJsonB64encode = Buffer.from(jsonstr).toString("base64");
      reqkey.set(objJsonB64encode);
    } catch (error) {
      console.log("---------------------------------postapifordeviceviewer error : " + error.toString());
      if (!rsp.headersSent) {
        rsp.send("error");
      }
    }
  }

  //////////////////////
  messageprocessing(reqmsg) {
    let rspmsg = new responseMessage();

    if (reqmsg.reqType == KDDefine.REQType.RT_LOGIN) {
       console.log("setlogin   pw:  " + reqmsg.reqParam.loginPW + ", SID:" + reqmsg.reqParam.SessionID);

      if (this.isneeduserinforead == true) {
        this.userinfos = [];
        this.DBInterface.getusersinfo(this.userinfos);
        console.log("setlogin   reload");
        this.isneeduserinforead = false;
      }

      rspmsg.retMessage = "not";

      {
        // 서버 업데이트용 계정
        if (reqmsg.reqParam.loginID === "adminkd" && reqmsg.reqParam.loginPW === "kd8883") {
          rspmsg.retMessage = "admin";
          rspmsg.retParam = "IF0000";
        }

        //DB 에서 검색해서 확인함.
        for (let i = 0; i < this.userinfos.length; i++) {
          //console.log("i :" +i);
          //console.log(this.userinfos[i]);
          if (this.userinfos[i].userid === reqmsg.reqParam.loginID && this.userinfos[i].usertype == 0) {
            if (this.userinfos[i].deviceid.length == 6 && this.userinfos[i].userpw === reqmsg.reqParam.loginPW) {
              rspmsg.retMessage = "user";
              rspmsg.retParam = this.userinfos[i].deviceid;
              break;
            }
            // info 필드에서 viewerpassword 체크
            console.log("info :" + this.userinfos[i].info);

            if (this.userinfos[i].info) {
              try {
                const infoJson = JSON.parse(this.userinfos[i].info);
                if (infoJson.viewerpassword === reqmsg.reqParam.loginPW) {
                  rspmsg.retMessage = "viewer";
                  rspmsg.retParam = this.userinfos[i].deviceid;
                  break;
                }
              } catch (e) {
                console.log("Error parsing info JSON:", e);
              }
            }
          }
        }

        //로그인 성공이면 세션 ID 저장 해당 ID 가 맞는거만 응답
        if (rspmsg.retMessage != "not") {
          if (rspmsg.retMessage == "viewer") {
            //뷰어는 세션저장안함.
          } else {
            this.sessionmap.set(rspmsg.retParam, reqmsg.reqParam.SessionID);
          }
        }
      }

      rspmsg.IsOK = true;
    } else if (reqmsg.reqType == KDDefine.REQType.RT_GETVERSION) {
      rspmsg.retMessage = this.platformversion;
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
