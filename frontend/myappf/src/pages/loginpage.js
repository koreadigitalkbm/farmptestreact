import React, { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";
//const crypto = require('crypto');

const Loginpage = (props) => {
  let loginid;
  let loginpw;
  let logintype;

  console.log("Loginpage islocal :" + myAppGlobal.islocal + " props.Islogin :" + props.Islogin);

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

          if (ret.retMessage !== "not") {
            window.sessionStorage.setItem("login", ret.retMessage);
            window.sessionStorage.setItem("deviceid", ret.retParam);
            myAppGlobal.logindeviceid = ret.retParam;
            props.onSetlogin(ret.retMessage);
          }
        }
      }
    });

    
  }

  return (
    <div>
      <h2>login Page</h2>
      <div key="sdaff">{logintype}</div>
    </div>
  );
};



export default Loginpage;
