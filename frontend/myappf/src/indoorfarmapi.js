
import myAppGlobal from "./myAppGlobal";
import reqMessage from "./reqMessage";


const API = "/api/";
const LOCALAPI = "http://localhost:8877";

export default class IndoorFarmAPI {
  constructor(islocal) {
    this.islocal = islocal;
   

  }

  async postData(url = "", data = {}) {
    let response;
    let reqURL;
    console.log(" postData islocal : " + this.islocal + ",myAppGlobal :" + myAppGlobal.islocal + "myAppGlobal islogin:"+myAppGlobal.islogin);
    if (this.islocal === false) {
      reqURL = url;
    } else {
      reqURL=url;
    }

    console.log(" postData reqURL : " + reqURL);

    response = await fetch(reqURL, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data), //
    });

    return response.json();
  }


  // 서버에 데이터 저장 요청
  async setRequest(mReqmsg) {
    let resdata ;

    try {
       resdata = await this.postData(API + "farmrequest", mReqmsg);

      console.log(" setRequest rsp : " + resdata.IsOK);
      
    } catch (error) {
      console.log(" setRequest error : " + error);
    } finally {
      console.log(" setRequest finally  : " );
      return resdata  ;
      
    }
  }


    // 장비에 데이터 요청
    async setRequestdevice(mReqmsg) {
      let resdata ;
  
      try {
         resdata = await this.postData(API + "devicerequest", mReqmsg);
  
        console.log(" setRequestdevice rsp : " + resdata.IsOK);
        
      } catch (error) {
        console.log(" setRequestdevice error : " + error);
      } finally {
        console.log(" setRequestdevice finally  : " );
        return resdata  ;
        
      }
    }


  async setLogin(id, pw) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid);

    reqmsg.reqType="login";
    reqmsg.loginID = id;
    reqmsg.loginPW = pw;

    return await this.setRequest(reqmsg);
  }


  async getLocaldeviceid() {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid);

    console.log( " getLocaldeviceid : " +reqmsg.datetime);

    reqmsg.reqType="getlocaldeviceid";
    

    return await this.setRequestdevice(reqmsg);
  }



  

  async getdevicelog(islocal) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid);

    console.log( "etdevicelog : " +reqmsg.datetime + ", devicdid: " + reqmsg.puniqid);
    reqmsg.reqType="getdevicelog";
     return await this.setRequestdevice(reqmsg);
     
  }


  async getdeviceinfo(islocal) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid);

    console.log( " getLocaldeviceinfo : " +reqmsg.datetime + ", devicdid: " + reqmsg.puniqid);

    reqmsg.reqType="getdeviceinfo";
    if(islocal == true)
    {
      return await this.setRequestdevice(reqmsg);
    }
    else{
      return await this.setRequest(reqmsg);
    }
    
  }
  

  async setsoftwareupdate(islocal) {
    const reqmsg = new reqMessage(myAppGlobal.logindeviceid);
    console.log( " setsoftwareupdate : " +reqmsg.datetime);

    reqmsg.reqType="setswupdate";
     
    if(islocal == true)
    {
      return await this.setRequestdevice(reqmsg);
    }
    else{
      return await this.setRequest(reqmsg);
    }

  }
  



}
