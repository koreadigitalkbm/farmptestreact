import "./App.css";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { actionSetlogin, actionSetSysteminfo } from "./mainAction";
import IndoorFarmAPI from "./indoorfarmapi";

import FMainpage from "./pages/mainpage2"
import myAppGlobal from "./myAppGlobal";
import MSignIn from "./pages/mlogin";
import { useTranslation } from "react-i18next";
import { useCookies } from 'react-cookie';

import KDUtil from "./commonjs/kdutil";



function FarmApp(props) {
  const { t,i18n} = useTranslation();
  const [cookies, setCookie] = useCookies(['languageT']);
  const [loginrol, setloginrol] = useState(window.sessionStorage.getItem("login"));
  const [failmsg, setfailmsg] = useState("");

  let islocal = window.sessionStorage.getItem("islocal");
  let islogin = false;

  console.log("-------------------------FarmAPP start--------------------- loginrol:" + loginrol + " islocal:" + islocal  );

  console.log("-------------------------cookies languageT:"+cookies.languageT + " i18n:"+ i18n.language + " navigator.language:"+ navigator.language);
  
  if(cookies.languageT==null)
  {
    var nextyear = new Date();
    nextyear.setFullYear(nextyear.getFullYear()+2);
    setCookie('languageT', KDUtil.isSupportLanguage(navigator.language), { expires:  nextyear});
  }


  if(cookies.languageT  != i18n.language)
  {
    i18n.changeLanguage(cookies.languageT);
  }
  myAppGlobal.language=i18n.language;
  myAppGlobal.langT=t;
  

  function setlogout() {
    myAppGlobal.loginrole = "logout";
    //로그아웃이면 삭제 시스템정보를 다시가져오도록 onSetSysteminfo 초기화
    myAppGlobal.logindeviceid ="";
    myAppGlobal.systeminformations = null;
    myAppGlobal.dashboardimagefileurl="image/noimage.png";
    myAppGlobal.dashboardlasteventtime=1;
    myAppGlobal.dashboardlastsensortime=1;
    myAppGlobal.Autocontrolcfg=null;
    
    

    let ssid = Math.floor(Math.random() * 100000 + 100);
    window.sessionStorage.setItem("msessionid", ssid);
    window.sessionStorage.setItem("login", myAppGlobal.loginrole);
    window.sessionStorage.setItem("deviceid", "");

    setloginrol(myAppGlobal.loginrole);
    setfailmsg("");
    props.onSetSysteminfo(null);
    
  }

  function setlogin(mdevid, mloginrole) {
    myAppGlobal.logindeviceid = mdevid;
    myAppGlobal.loginrole = mloginrole;
    window.sessionStorage.setItem("login", myAppGlobal.loginrole);
    window.sessionStorage.setItem("deviceid", myAppGlobal.logindeviceid);

    //로그인 상태로 변경하고 화면갱신
    setloginrol(myAppGlobal.loginrole);
    
  }


  if (islocal == null) {
    // 첫접속이면  로컬로인지 온라인인지 확인해서 세션에 저장
    console.log("Hostname : " + window.location.hostname + ",host : " + window.location.protocol);

    myAppGlobal.isinitalizeApp = true;
    if (window.location.hostname.indexOf("amazonaws.com") != -1 || window.location.hostname.indexOf("15.164.60.217") != -1 || window.location.hostname.indexOf("koreadigital.com") != -1) {
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
    setlogout();

    //props.onSetlogin(loginrol);
  } else {
    /// 새로고침  세션에 저장된 데이터 읽어옴
    myAppGlobal.islocal = window.sessionStorage.getItem("islocal");
    myAppGlobal.sessionid = window.sessionStorage.getItem("msessionid");
    myAppGlobal.logindeviceid = window.sessionStorage.getItem("deviceid");
    myAppGlobal.loginrole = window.sessionStorage.getItem("login");
    myAppGlobal.farmapi = new IndoorFarmAPI(myAppGlobal.islocal);
    
    if(islocal ==="true")
    {
      islocal=true; 
    }
    if(loginrol !="logout")
    {
      
      islogin=true;
      // 로그아웃아니면 로그인상태임으로 기본정보를 읽어옴
      
    }


    console.log("----------------------------새로고침 islocal: " + myAppGlobal.islocal + " islogin : "+islogin);



  }




  function loginSMHandler(loginid, loginpw) {
    console.log("loginSMHandler :   id : " + loginid + " , pw : " + loginpw);

    //둘다 널이면 로그아웃임
    if (loginid == null && loginpw == null) {
      setlogout();
    } else {
      myAppGlobal.farmapi.setLoginDevice(loginid, loginpw, myAppGlobal.sessionid).then((ret) => {
        if (ret) {
          if (ret.IsOK == true) {
//            console.log(" login ret msg: " + ret.retMessage + " ,param:" + ret.retParam);
            if (ret.retMessage === undefined || ret.retMessage === "not" || ret.retMessage === "notid" || ret.retMessage === "notpw") {
              console.log("로그인 실패.. ");
              setfailmsg("LT_LOGINFAIL_NO");
              
            } else {
              // 로그인인 되면 가장 중요한 연결된 장치ID를 받아서 저장해놈. 이ID를 통해  통신
              //로그인 상태로 변경하고 화면갱신
              setlogin(ret.retParam, ret.retMessage);
            }
          }
        }
      });
    }
  }

  return (
    <div className="FarmApp">
      
      {(islogin==false)? <MSignIn islocal={islocal}  loginfailmsg ={failmsg}  mhandler={loginSMHandler} /> :<FMainpage {...props} loginrol={loginrol} mhandler={loginSMHandler}/> }
   </div>
  );
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
