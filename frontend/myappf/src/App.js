import "./App.css";

import { connect } from "react-redux";
import { actionSetlogin } from "./mainAction";
import IndoorFarmAPI from "./indoorfarmapi";
import Loginpage from "./pages/loginpage";
import Mainpage from "./pages/mainpage";
import myAppGlobal from "./myAppGlobal";

function App(props) {
  console.log("-------------------------react APP start--------------------- LoginRole:" + props.LoginRole);

  let islocal = window.sessionStorage.getItem("islocal");
  if (islocal == null) {
    // 첫접속이면  로컬로인지 온라인인지 확인해서 세션에 저장
    console.log("Hostname : " + window.location.hostname + ",host : " + window.location.protocol);
    if (window.location.hostname.indexOf("amazonaws.com") != -1 || window.location.hostname.indexOf("13.209.26.2") != -1) {
      //서버 IP이거나 도메인이 서버이면 서버접속임.
      window.sessionStorage.setItem("islocal", false);
      console.log("-------------------------connected aws server---------------------");
    } else {
      ///로컬로 접속하면
      window.sessionStorage.setItem("islocal", true);
      console.log("-------------------------connected local network---------------------");
    }
    //첫무조건 로그인페이지로
    let loginrol = "logout";
    let ssid=Math.floor(Math.random() * 100000 + 100);
    window.sessionStorage.setItem("msessionid", ssid);
    window.sessionStorage.setItem("login", loginrol);
    window.sessionStorage.setItem("deviceid", "");
    props.onSetlogin(loginrol);
  } else {
    if(islocal == "true" || islocal ==true)
    {
    myAppGlobal.islocal = true;
    }
    else{
      myAppGlobal.islocal = false;
    }
    myAppGlobal.farmapi = new IndoorFarmAPI(myAppGlobal.islocal);
    myAppGlobal.sessionid = window.sessionStorage.getItem("msessionid");
    let loginrol = window.sessionStorage.getItem("login");
    if (loginrol != null) {
      myAppGlobal.logindeviceid = window.sessionStorage.getItem("deviceid");
      console.log("-------------------------sessionStorage---------------------loginrol : " + loginrol + ",sessionid :" +myAppGlobal.sessionid);
      
      ///로그인 상태이면 장비 정보를 요청한다. 
      if(loginrol !="logout")
      {
        myAppGlobal.farmapi.getSysteminformations().then((ret) => {
          myAppGlobal.systeminformations= ret.retMessage;
          console.log("----------------------------systeminformations : " + myAppGlobal.systeminformations.Systemconfg.name);
          console.log("----------------------------systeminformations auto length: " + myAppGlobal.systeminformations.Autocontrolcfg);
        });
      }
      else{
        //로그아웃이면 삭제
        myAppGlobal.systeminformations=null;
      }
      


      props.onSetlogin(loginrol);
    }
  }

  function loginsetpage(props) {
    if (props.LoginRole === "logout" || props.LoginRole === "loginfail") {
      return Loginpage(props);
    } else {
      return Mainpage(props);
    }
  }

  return <div className="App">{loginsetpage(props)}</div>;
}

const mapStateToProps = function (state) {
  return {
    LoginRole: state.LoginRole,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onSetlogin: (value) => dispatch(actionSetlogin(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
