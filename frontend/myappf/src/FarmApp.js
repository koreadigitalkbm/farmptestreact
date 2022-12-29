import "./App.css";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { actionSetlogin, actionSetSysteminfo } from "./mainAction";
import IndoorFarmAPI from "./indoorfarmapi";
import Loginpage from "./pages/loginpage";
import FarmMainpage from "./pages/farmmainpage";
import myAppGlobal from "./myAppGlobal";

function FarmApp(props) {
  console.log("-------------------------FarmAPP start--------------------- LoginRole:" + props.LoginRole + " , init: " + myAppGlobal.isinitalizeApp);

  let islocal = window.sessionStorage.getItem("islocal");
  let loginrol = window.sessionStorage.getItem("login");

  if (islocal == null) {
    // 첫접속이면  로컬로인지 온라인인지 확인해서 세션에 저장
    console.log("Hostname : " + window.location.hostname + ",host : " + window.location.protocol);

    myAppGlobal.isinitalizeApp = true;
    if (window.location.hostname.indexOf("amazonaws.com") != -1 || window.location.hostname.indexOf("13.209.26.2") != -1) {
      //서버 IP이거나 도메인이 서버이면 서버접속임.
      myAppGlobal.islocal = false;
      window.sessionStorage.setItem("islocal", false);
      console.log("-------------------------connected aws server---------------------");
    } else {
      ///로컬로 접속하면
      myAppGlobal.islocal = true;
      window.sessionStorage.setItem("islocal", true);
      console.log("-------------------------connected local network---------------------");
    }
    //첫무조건 로그인페이지로
    loginrol = "logout";
    let ssid = Math.floor(Math.random() * 100000 + 100);
    window.sessionStorage.setItem("msessionid", ssid);
    window.sessionStorage.setItem("login", loginrol);
    window.sessionStorage.setItem("deviceid", "");

    props.onSetlogin(loginrol);
  } else {
    if (myAppGlobal.isinitalizeApp == false) {
      if (islocal == true || islocal == "true") {
        myAppGlobal.islocal = true;
      } else {
        myAppGlobal.islocal = false;
      }

      myAppGlobal.isinitalizeApp = true;
      /// 새로고침이면 세션에서 로그인정보를 다시가져오도록  pros 상태를 갱신하고 재 시작
      props.onSetlogin(loginrol);
    } else {
      myAppGlobal.farmapi = new IndoorFarmAPI(myAppGlobal.islocal);
      myAppGlobal.sessionid = window.sessionStorage.getItem("msessionid");
      myAppGlobal.logindeviceid = window.sessionStorage.getItem("deviceid");

      if (loginrol != "logout") {
        myAppGlobal.farmapi.getSysteminformations().then((ret) => {
          myAppGlobal.systeminformations = ret.retParam;
          console.log("----------------------------systeminformations : " + myAppGlobal.systeminformations.Systemconfg.name);

          props.onSetSysteminfo("set info");
        });
      } else {
        //로그아웃이면 삭제 시스템정보를 다시가져오도록 onSetSysteminfo 초기화
        myAppGlobal.systeminformations = null;
        props.onSetSysteminfo(null);
      }
    }
  }

  function loginsetpage(props) {
    console.log("----------------------------loginsetuppage : " + props.LoginRole);

    if (props.LoginRole === "logout" || props.LoginRole === "loginfail") {
      console.log("----------------------------loginsetuppage logout: " + props.LoginRole);
      return Loginpage(props);
    } else if (props.LoginRole == "none") {
      return;
    } else {
      return FarmMainpage(props);
    }
  }

  return <div className="FarmApp">{loginsetpage(props)}</div>;
}

const mapStateToProps = function (state) {
  return {
    LoginRole: state.LoginRole,
    Systeminfo: state.Systeminfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onSetlogin: (value) => dispatch(actionSetlogin(value)),
    onSetSysteminfo: (value) => dispatch(actionSetSysteminfo(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FarmApp);
