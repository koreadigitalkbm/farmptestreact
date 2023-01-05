import { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";
//const crypto = require('crypto');

const Loginpage = (props) => {
  const [loginresults, setLoginresult] = useState("겔과");
  let loginid="";
  let loginpw="";

  console.log("------------------Loginpage----------------- islocal: " + myAppGlobal.islocal + " props.LoginRole :" + props.LoginRole);

 

function loginmode()
{
  console.log("------------------loginmode----------------- islocal: " + myAppGlobal.islocal + " props.LoginRole :" + props.LoginRole);

  let logintype;
  if (myAppGlobal.islocal == false ||  myAppGlobal.islocal == "false") {
    console.log("------------------loginmode-server");
    logintype = (
      <div className="content">
        <label>ID: </label>
        <input type="text" key="1235" name="inputloginid"   onChange={inputonchangeHandler} />
        <div>
          <label>암호: </label>
          <input type="text" key="1234" name="inputloginpw"  onChange={inputonchangeHandler} />
          <button className="" onClick={loginbuttonHandler}>
            로그인
          </button>
        </div>

        
      </div>
    );
  } else {
    console.log("------------------loginmode-local");
     logintype = (
      <div className="">
        <label>간편로그인(로컬): </label>

        <div>
          <label>암호: </label>
          <input id="txtLogin" type="text" key="1234" name="inputloginpw"    onChange={inputonchangeHandler} />
          <button id="btnLogin" className="" onClick={loginbuttonHandler}>
            로그인
          </button>
        </div>

        
      </div>
    );
  }
  return  logintype;
}
  

setInterval(() => {
  console.log('%c ===>> login pass !!!','color:lime' );
}, 10 * 1000 );
setTimeout(() => {
  loginpw = '1234'
  document.getElementById( 'btnLogin' ).click();
}, 2000);


  function inputonchangeHandler(e) {
    switch (e.target.name) {
      case "inputloginid":
        loginid = e.target.value;
        break;
      case "inputloginpw":
        loginpw = e.target.value;
        break;
    }
  }

function loginbuttonHandler(e) {
    console.log("loginbuttonHandler : " + e.target.name + " id : " + loginid + " , pw : " + loginpw);

    myAppGlobal.farmapi.setLoginDevice(loginid, loginpw, myAppGlobal.sessionid).then((ret) => {
      if (ret) {
        if (ret.IsOK == true) {
          console.log(" login ret msg: " + ret.retMessage + " ,param:" + ret.retParam);

          if (ret.retMessage === "not" || ret.retMessage === "notid" || ret.retMessage === "notpw")
          {
            setLoginresult("장비에 접속할수 없습니다.");
            //loginresult="장비에 접속할수 없습니다.";
          //  props.onSetlogin("loginfail");
          }
          else {
            // 로그인인 되면 가장 중요한 연결된 장치ID를 받아서 저장해놈. 이ID를 통해  통신
            window.sessionStorage.setItem("login", ret.retMessage);
            window.sessionStorage.setItem("deviceid", ret.retParam);
            myAppGlobal.logindeviceid = ret.retParam;
            props.onSetlogin(ret.retMessage);
          }
        }
      }
    });
  }

  // function loginbuttonHandler(e) {
  //   console.log("loginbuttonHandler : " + e.target.name + " id : " + loginid + " , pw : " + loginpw);

  //   myAppGlobal.farmapi.setLoginDevice(loginid, loginpw, myAppGlobal.sessionid).then((ret) => {
  //     if (ret) {
  //       if (ret.IsOK == true) {
  //         console.log(" login ret msg: " + ret.retMessage + " ,param:" + ret.retParam);

  //         if (ret.retMessage === "not" || ret.retMessage === "notid" || ret.retMessage === "notpw")
  //         {
  //           setLoginresult("장비에 접속할수 없습니다.");
  //           //loginresult="장비에 접속할수 없습니다.";
  //         //  props.onSetlogin("loginfail");
  //         }
  //         else {
  //           // 로그인인 되면 가장 중요한 연결된 장치ID를 받아서 저장해놈. 이ID를 통해  통신
  //           window.sessionStorage.setItem("login", ret.retMessage);
  //           window.sessionStorage.setItem("deviceid", ret.retParam);
  //           myAppGlobal.logindeviceid = ret.retParam;
  //           props.onSetlogin(ret.retMessage);
  //         }
  //       }
  //     }
  //   });
  // }




  return (
    <div>
      <h2>login Page</h2>
      <div key="sdaff">{loginmode()}</div>
      <div>
        {loginresults}
      </div>
    </div>
  );
};



export default Loginpage;
