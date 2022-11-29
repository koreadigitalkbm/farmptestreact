import logo from './logo.svg';
import './App.css';


import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { actionSetlogin } from "./mainAction";
import IndoorFarmAPI from "./indoorfarmapi";
import Loginpage from "./pages/loginpage";
import Mainpage from "./pages/mainpage";
import myAppGlobal from "./myAppGlobal";



function App(props) {
  console.log("-------------------------react APP start---------------------");
  console.log("Hostname : " +window.location.hostname + ",host : " + window.location.protocol);
  
  myAppGlobal.farmapi = new IndoorFarmAPI(myAppGlobal.islocal);


  if (window.location.hostname.indexOf("amazonaws.com") != -1  || window.location.hostname.indexOf("13.209.26.2") != -1 ) {
//서버 IP이거나 도메인이 서버이면 서버접속임.
    myAppGlobal.islocal = false;
    myAppGlobal.isuseradmin = false;
    console.log("-------------------------connected aws server---------------------");
    
  } else {
    ///로컬로 접속하면 관리자 계정임
    myAppGlobal.islocal = true;
    myAppGlobal.isuseradmin = true;
    console.log("-------------------------connected local network---------------------");
  }

  
  useEffect(() => {
  

    let loginrole = window.sessionStorage.getItem("login");
  
      if(loginrole)
      {
      }
      else{
        loginrole ="logout";
      }
      props.onSetlogin(loginrole);
    
  
      console.log("App  LoginRole : " +props.LoginRole);
      
    }, []);
  
  
  
    return (<div className="App">{props.LoginRole == "logout" ?  Loginpage(props) : Mainpage(props)}</div>);

  
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

export default connect(mapStateToProps,mapDispatchToProps)(App);

