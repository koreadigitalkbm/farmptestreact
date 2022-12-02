import React, { useState, useEffect } from "react";
import { BrowserRouter, Link,  Routes, Route } from "react-router-dom";


import About from "./about";
import AdminSetup from "./adminsetup";
import Sensorpage from "./sensorpage";

import myAppGlobal from "../myAppGlobal";

const Mainpage = (props) => {
  let adminmenu;

  console.log("-------------------------main page ---------------------");

  function logoutbuttonHandler(e) {
    window.sessionStorage.setItem("login", "logout");
    window.sessionStorage.setItem("deviceid", "");
    props.onSetlogin("logout");
  }


  function adminpage(props) {


    if(props.LoginRole ==="user")
    {

      return ("");
    }
    else{
    return (
      <Link to="/admin" className="linkmenu">
      <div className="content">
        <img src="./image/s_set.png" className="con_img" /> 관리자:
        {props.LoginRole}
      </div>
    </Link>
    );
    }
  }



  return (
    <BrowserRouter>
      <div className="indoor">
        <div className="left">
          <nav>
            <div className="name">
              <img src="./image/kdgb.png" className="name_img" /> SFC-300
            </div>
            <div className="menu">
              <Link to="/dashboard" className="linkmenu">
                <div className="content">
                  <img src="./image/s_dash.png" className="con_img" /> DASH BOARD
                </div>
              </Link>
              <Link to="/sensor" className="linkmenu">
                <div className="content">
                  <img src="./image/s_sen.png" className="con_img" /> SENSOR
                </div>
              </Link>
              <Link to="/devices" className="linkmenu">
                <div className="content">
                  <img src="./image/s_dev.png" className="con_img" /> DEVICE
                </div>
              </Link>
              <Link to="/about" className="linkmenu">
                <div className="content">
                  <img src="./image/s_aut.png" className="con_img" /> About
                </div>
              </Link>
              <Link to="/setup" className="linkmenu">
                <div className="content">
                  <img src="./image/s_set.png" className="con_img" /> SETTING
                </div>
              </Link>
              {adminpage(props)}
            </div>
          </nav>
        </div>
 
        <div className="right">
          <div className="top">
            <div className="top_name"> NO. 1 &nbsp;&nbsp; SENSOR NODE</div>
            <div className="top_log">
              <div className="login">
                <div className="out_button">
                  <button className="button_on" onClick={logoutbuttonHandler}>
                    {" "}
                    로그아웃{" "}
                  </button>
                </div>
              </div>
              <div className="join">{myAppGlobal.islocal ? "로컬" : "원격"}</div>
            </div>
          </div>

          <div className="board">
            <Routes>
              <Route path="/" element={<Sensorpage />} />
              <Route path="/sensor" element={<Sensorpage />} />
              <Route path="/about" element={<About />} />
              <Route path="/setup" element={<About />} />
              <Route exact path="/admin" element={<AdminSetup />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Mainpage;
