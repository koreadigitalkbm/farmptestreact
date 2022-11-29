
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
      reqURL =LOCALAPI+ url;
    } else {
      
      reqURL=LOCALAPI+url;
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



  async setLogin(id, pw) {
    const reqmsg = new reqMessage("IF9987");

    reqmsg.loginID = id;
    reqmsg.loginPW = pw;

    return await this.setRequest(reqmsg);
  }




}
