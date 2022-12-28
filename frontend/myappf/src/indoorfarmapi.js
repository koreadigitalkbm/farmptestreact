import myAppGlobal from "./myAppGlobal";
import reqMessage from "./reqMessage";
import KDDefine from "./commonjs/kddefine";

const API = "/api/";
const LOCALAPI = "http://localhost:8877";

export default class IndoorFarmAPI {
  constructor(islocal) {
    this.islocal = islocal;
  }

  async postData(reqURL = "", data = {}) {
    //    console.log(" postData islocal : " + this.islocal + ",myAppGlobal :" + myAppGlobal.islocal + "myAppGlobal islogin:" + myAppGlobal.islogin);
    let response = await fetch(reqURL, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
        "Session-ID": myAppGlobal.sessionid,
      },
      body: JSON.stringify(data), //
    });
    return response.json();
  }

  // 서버, 또는장비에 데이터 저장 요청
  async setRequest(mReqmsg) {
    let resdata;

    try {
      resdata = await this.postData(API + "farmrequest", mReqmsg);
      //      console.log(" setRequest rsp : " + resdata.IsOK);
    } catch (error) {
      console.log(" setRequest error : " + error);
    } finally {
      console.log(" setRequest finally  : ");
      return resdata;
    }
  }

  // 장비에 데이터 요청
  async setRequestdevice(mReqmsg) {
    let resdata;

    try {
      resdata = await this.postData(API + "devicerequest", mReqmsg);
      console.log(" setRequestdevice isok : " + resdata.IsOK);
    } catch (error) {
      console.log(" setRequestdevice error : " + error);
    } finally {
      console.log(" setRequestdevice finally  : ");
      return resdata;
    }
  }

  async setLoginDevice(lid, lpw, lssid) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_LOGIN);

    reqmsg.reqParam ={
      loginID:lid,
      loginPW:lpw,
      SessionID:lssid,
    };
    //reqmsg.loginID = id;
    //reqmsg.loginPW = pw;
    //reqmsg.SessionID = myAppGlobal.sessionid;
    return await this.setRequest(reqmsg);
  }

  async getSysteminformations() {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_SYSTEMINIFO);

    return await this.setRequestdevice(reqmsg);
  }

  async getdevicelog() {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_DEVICELOG);

    return await this.setRequestdevice(reqmsg);
  }

  async getdeviceversion(isserver) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_GETVERSION);

    if (isserver) {
      return await this.setRequest(reqmsg);
    } else {
      return await this.setRequestdevice(reqmsg);
    }
  }

  async setsoftwareupdate(islocal) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_SWUPDATE);

    if (islocal === true) {
      //장비 업데이트
      return await this.setRequestdevice(reqmsg);
    } else {
      //서버에 코드 업데이트
      return await this.setRequest(reqmsg);
    }
  }

  //장비에 대한 전체 상태를 읽어온다. 센서, 구동기, 자동제어, 기타 등등
  async getDeviceStatus() {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_SYSTEMSTATUS);

    return await this.setRequestdevice(reqmsg);
  }

  async setActuatorOperation(actopcmd) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_ACTUATOROP);
    reqmsg.reqParam = actopcmd;
    return await this.setRequestdevice(reqmsg);
  }

  async getActuatorState() {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_ACTUATORSTATUS);
    return await this.setRequestdevice(reqmsg);
  }

  async getsensors() {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_SENSORSTATUS);

    return await this.setRequestdevice(reqmsg);
  }

  async setMyInfo(newconf) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_SETMYINFO);
    reqmsg.reqParam = newconf;
    return await this.setRequestdevice(reqmsg);
  }
  
  async getAutocontrolconfig() {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_GETAUTOCONTROLCONFIG);
    return await this.setRequestdevice(reqmsg);
  }


  

  async saveAutocontrolconfig(autoccfg) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid, KDDefine.REQType.RT_SAVEAUTOCONTROLCONFIG);
    reqmsg.reqParam = autoccfg;
    return await this.setRequestdevice(reqmsg);
  }
}
