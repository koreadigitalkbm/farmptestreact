import React, { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";

const Dashboard = (props) => {

   //const [loginresults, setLoginresult] = useState("겔과");
  const [loginresult, setLoginresult] = useState("겔과");
  let loginid;
  let loginpw;
  let logintype;

  console.log("------------------Loginpage----------------- islocal :" + myAppGlobal.islocal + " props.Islogin :" + props.Islogin);



  if (myAppGlobal.islocal === false) {
    logintype = (
      <div className="content">
        <label>ID: </label>
        <input type="text" key="1235" name="inputloginid" onChange={inputonchangeHandler} />
        <div>
          <label>암호: </label>
          <input type="text" key="1234" name="inputloginpw" onChange={inputonchangeHandler} />
          <button className="" onClick={loginbuttonHandler}>
            로그인
          </button>
        </div>

        
      </div>
    );
  } else {
    logintype = (
      <div className="">
        <label>간편로그인(로컬): </label>

        <div>
          <label>암호: </label>
          <input type="text" key="1234" name="inputloginpw" onChange={inputonchangeHandler} />
          <button className="" onClick={loginbuttonHandler}>
            로그인
          </button>
        </div>

        
      </div>
    );
  }

  
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

    myAppGlobal.farmapi.setLogin(loginid, loginpw).then((ret) => {
      if (ret) {
        if (ret.IsOK == true) {
          console.log(" login ret msg: " + ret.retMessage + " ,param:" + ret.retParam);

          if (ret.retMessage === "not" || ret.retMessage === "notid" || ret.retMessage === "notpw")
          {
            console.log("실패");
            setLoginresult("장비에 접속할수 없습니다.")
          }
          else {
            console.log("성공");
            setLoginresult("로그인 성공")

            window.sessionStorage.setItem("login", ret.retMessage);
            window.sessionStorage.setItem("deviceid", ret.retParam);
            myAppGlobal.logindeviceid = ret.retParam;
          }
        }
      }
    });

  }

  return (
    <div>
      <h2>Dash Board</h2>
      <div key="sdaff">{logintype}</div>
      <div>
        <p></p>
        {loginresult}
      </div>
    </div>
  );
}

export default Dashboard;