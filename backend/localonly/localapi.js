// 백엔드 사용 로컬 장비에서 구동되는  통신 API

const KDCommon = require("../kdcommon");
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const responseMessage = require("../../frontend/myappf/src/commonjs/responseMessage");
const reqMessage = require("../../frontend/myappf/src/commonjs/reqMessage");

var exec = require("child_process").exec;


const os = require("os");


// import fetch from "node-fetch"; 
const fetch = require("node-fetch");    // only work on Version2.xx, not working V3.x



const SERVERAPI_URL = "http://15.164.60.217/api/";












function softwarenpminstall(mMain, isbackend) {
  console.log("softwarenpminstal  isbackend: " + isbackend);

  let cmdString = 'npm install '; 
  let cmdpath="./";
  if(isbackend==false )
  {
    cmdpath="../frontend/myappf/";
  }
  else{
    cmdpath="../backend/";
  }
  
  
  if (process.platform !== "win32") {
    cmdString = 'sudo npm install';
  }
  
  console.log("softwarenpminstll  cmdString: " + cmdString);
  
  const child = exec( cmdString, {cwd: cmdpath},function (error, stdout, stderr) {
    console.log("stdout install: " + stdout);
    console.log("stderr: " + stderr);
    mMain.systemlog.memlog(" softwarenpminstll  stdout : " + stdout.toString());

    if (error !== null) {
      //console.log("exec error: " + error);
      mMain.systemlog.memlog(" softwarenpminstll  catch error : " + error.toString());

    }
  });
}



  function softwareupdatefromgit(mMain, mupdateversion, platformversion) {
    console.log("softwareupdatefromgt  mupdateversion: " + mupdateversion + " myversion:"+this.platformversion);
    let isbacknpminstall=null;;

    if(mupdateversion !=null)
    {
      let upversionnum = Number(mupdateversion);
      let myversionnum = Number(platformversion);
      let bnumup=Math.floor(upversionnum%10);
      let bnummy=Math.floor(myversionnum%10);


      let fnumup=Math.floor((upversionnum*10)%10);
      let fnummy=Math.floor((myversionnum*10)%10);

      console.log("bnumup: " + bnumup + " bnummy:"+bnummy);
      console.log("fnumup: " + fnumup + " fnummy:"+fnummy);

      if(bnumup > bnummy)
      {
        isbacknpminstall=true;
      }
      else{
        if(fnumup > fnummy)
        {
          isbacknpminstall=false;
        }
      }

        console.log("isbacknpminstall: " + isbacknpminstall);

    }

    let cmdString = 'git pull ';    // 2023.02.20
    if (process.platform !== "win32") {
      cmdString = 'sudo git fetch --all && sudo git reset --hard && sudo git pull';
    }
    

    const child = exec( cmdString, function (error, stdout, stderr) {
      console.log("stdout pull: " + stdout);
      console.log("stderr: " + stderr);
      mMain.systemlog.memlog(" softwareupdatefromgt  stdout : " + stdout.toString());

      if (error !== null) {
        //console.log("exec error: " + error);
        mMain.systemlog.memlog(" softwareupdatefromgt  catch error : " + error.toString());

      }
      else{
        if(isbacknpminstall !=null)
        {
          softwarenpminstall(mMain, isbacknpminstall);
        }
      }
    });
  }



module.exports = class LocalAPI {
  constructor(fversion, mmain) {
    this.mMain = mmain;

    this.fbdatabase = null;

    this.platformversion = fversion;
    this.mylocaldeviceid = this.mMain.mydeviceuniqid;
  }



  




  postapiforfirebase(req, rsp) {
  }

  postapifordatabase(req, rsp) {
    let reqmsg = JSON.parse(JSON.stringify(req.body));
    console.log("---------------------------------postapifordatabase :  reqmsg :" + reqmsg);

    //db 관련 쿼리실행후 결과 콜백이 오면 그때 리턴
    if(reqmsg.reqType ==KDDefine.REQType.RT_GETDB_DATAS)
    {
       return this.mMain.localDBinterface.gettable(rsp, reqmsg, this.callbackreturn);
    }


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


    
    
    let responsemsg =  this.messageprocessing(reqmsg);

    rsp.send(JSON.stringify(responsemsg));
  }


  //콜백함수에서 응답해야한다면 이함수를사용하자.
  callbackreturn(rsp, mparam)
  {
    let rspmsg = new responseMessage();
    rspmsg.retMessage = mparam;
    rspmsg.IsOK = true;
     console.log("callbackreturn mparam:"+ mparam.length );
     return rsp.send(JSON.stringify(rspmsg));

  }


   messageprocessing(reqmsg) {
    let rspmsg = new responseMessage();
    //console.log("------------local messageprocessing :  req type :" + reqmsg.reqType);
    switch (reqmsg.reqType) {

      

      case KDDefine.REQType.RT_LOGIN:
        if (reqmsg.reqParam.loginPW === this.mMain.localsysteminformations.Systemconfg.password) {
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
        console.log("softwareupdatefromgt  RT_SWUPDATE");

        softwareupdatefromgit(this.mMain, reqmsg.reqParam, this.platformversion);
        rspmsg.retMessage = "ok";
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_GETVERSION:
        rspmsg.retMessage = this.platformversion;
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_DEVICELOG:
        rspmsg.retMessage = "devicelog";
        rspmsg.retParam = this.mMain.systemlog;
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_SYSTEMINIFO:
        if (this.mMain.localsysteminformations != null) {
          rspmsg.retParam = this.mMain.localsysteminformations;
          rspmsg.IsOK = true;
        }
        break;

      case KDDefine.REQType.RT_GETAUTOCONTROLCONFIG:
        if (this.mMain.autocontrolinterface != null) {
          rspmsg.retParam = this.mMain.autocontrolinterface.getautocontrolconfigall();
          rspmsg.IsOK = true;
        }
        break;

      case KDDefine.REQType.RT_SENSORSTATUS:
        if (this.mMain.sensorinterface != null) {
          rspmsg.Sensors = this.mMain.sensorinterface.getsensorssimple();
          rspmsg.IsOK = true;
        }
        break;
      case KDDefine.REQType.RT_ACTUATOROPERATION:
        if (reqmsg.reqParam != null) {
          this.mMain.actuatorinterface.setoperationmanual(reqmsg.reqParam);
        }
        rspmsg.retMessage = "ok";
        rspmsg.IsOK = true;
        break;

      case KDDefine.REQType.RT_SYSTEMSTATUS:
        if (this.mMain.sensorinterface != null && reqmsg.reqParam.isSEN === true) {
          rspmsg.Sensors = this.mMain.sensorinterface.getsensorssimple();
        }
        if (this.mMain.actuatorinterface != null && reqmsg.reqParam.isACT === true) {
          rspmsg.Outputs = this.mMain.actuatorinterface.getactuatorstatus();
        }
        // 시간이 0으로오면 요청없음
        if (this.mMain.dailydatas != null && reqmsg.reqParam.STime > 0) {
          rspmsg.retParam = this.mMain.dailydatas.getdatabytime(reqmsg.reqParam.STime, reqmsg.reqParam.ETime);
        }
        //      console.log("---------------------------------RT_SYSTEMSTATUS  lenisSENgth : " + reqmsg.reqParam.isSEN + " lastSensorTime:"+ reqmsg.reqParam.STime);

        rspmsg.IsOK = true;
        break;

        case KDDefine.REQType.RT_SETMYINFO:
        
        this.mMain.savesystemconfig(reqmsg.reqParam);
        rspmsg.retMessage = "ok";
        rspmsg.IsOK = true;
        break;
      

      case KDDefine.REQType.RT_SETALIAS:
        this.mMain.savesystemaials(reqmsg.reqParam);
        rspmsg.retMessage = "ok";
        rspmsg.IsOK = true;
        break;


      case KDDefine.REQType.RT_SAVEAUTOCONTROLCONFIG:
        this.mMain.autocontrolinterface.AutocontrolUpdate(reqmsg.reqParam);
        rspmsg.retMessage = "ok";
        rspmsg.IsOK = true;
        break;
      
        case KDDefine.REQType.RT_RESETAUTOCONTROLCONFIG:
          this.mMain.autocontrolinterface.AutocontrolReset();
          rspmsg.retMessage = "ok";
          rspmsg.IsOK = true;
          break;
        
    }

    //console.log("msgprocessing_common   return :  " + rspmsg.IsOK);
    return rspmsg;
  }

  async firebasedbsetup() {
    const admin = require("firebase-admin");
    const serviceAccount = require("../../common/private/farmcube-push-firebase-adminsdk-z8u93-e5d8d4f325.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://farmcube-push.firebaseio.com",
    });

    console.log("---------------------------------firebasedbsetup  mylocaldeviceid: " + this.mylocaldeviceid);


    this.fbdatabase = admin.database();
    const reqkeystr = "IFDevices/" + this.mylocaldeviceid + "/request";
    const fblocalrequst = this.fbdatabase.ref(reqkeystr);
    //값 초기화  이전 데이터가 남아있을수 있음
    fblocalrequst.set("");

    fblocalrequst.on("value", (snapshot) => {
      const data = snapshot.val();

      try { 
        if(data.length >4)
        {
        const decodedStr = Buffer.from(data, "base64");
        const reqmsg = JSON.parse(decodedStr);
        const rspmsg = this.messageprocessing(reqmsg);

      //  console.log("fb ................ : reqtime:" + reqmsg.Time + " ressptime:" + rspmsg.Time);

            //동시에 다른 요청이 있을수 있으므로 reqType 별로 키값에 응답전송
  //      const objJsonB64encode = Buffer.from(JSON.stringify(rspmsg)).toString("base64");
  //      const responsekeystr = "IFDevices/" + this.mylocaldeviceid + "/response/" + reqmsg.reqType;
//        const fblocalresponse = this.fbdatabase.ref(responsekeystr);
//        fblocalresponse.set(objJsonB64encode);

        rspmsg.devID = this.mylocaldeviceid;
        rspmsg.reqType = reqmsg.reqType;
        this.setRequestServerforfirebase(rspmsg);


        }

        //console.log("frebase response set: " +objJsonB64encode);
      } catch (e) {
        console.log("firebasedbsetup error: " + e);

        return false;
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

  ///이벤트 데이터를 서버로 보냄
  async seteventdatatoserver(did, events) {
    const reqmsg = new reqMessage(did, KDDefine.REQType.RT_SETDB_EVENT);
    reqmsg.reqParam = {
      devid: did,
      eventlist: events,
    };
    return await this.setRequestServer(reqmsg);
  }

  /// issetdb 가 false 이면 db 저장안함 메뉴얼촬영 이미지 전송때  flase
  async setcameradatatoserver(did, dtime, ctype, fname, mimage, issetdb) {
    const reqmsg = new reqMessage(did, KDDefine.REQType.RT_SETDB_CAMERA);
    reqmsg.reqParam = {
      devid: did,
      datetime: dtime,
      cameratype: ctype,
      cfilename: fname,
      imagedatas: mimage,
      issetdbase: issetdb,
    };
    return await this.setRequestServer(reqmsg);
  }

  async postData(reqURL = "", data = {}) {
    //console.log("postData  url:" + reqURL);
    //console.log( JSON.stringify(data) );

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
      //console.log(" setRequestServer finally  : ");
      return resdata;
    }
  }

  // 서버 에 파이어베이스 응답
  async setRequestServerforfirebase(mReqmsg) {
    let resdata;

    try {
      resdata = await this.postData(SERVERAPI_URL + "firebasersp", mReqmsg);
      //      console.log(" setRequest rsp : " + resdata.IsOK);
    } catch (error) {
      console.log(" setRequestServer error : " + error);
    } finally {
      //console.log(" setRequestServer finally  : ");
      return resdata;
    }
  }




};
