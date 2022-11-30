import React, { useState, useEffect } from "react";
import { BrowserRouter, Link ,Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionSetlogin } from '../mainAction';

//import Dashboard from "./dashboard";
import Sensorpage from "./sensorpage";
//import Devicepage from "./devicepage";
//import Autocontrolpage from "./autocontrolpage";
//import Settingpage from "./settingpage";
import About from "./about";
//import Factorysetup from "./rasberryonly/factorysetup";


import myAppGlobal from "../myAppGlobal";

const Mainpage = (props) => {
  
    let adminmenu;

  console.log("-------------------------main page ---------------------");

  

  function logoutbuttonHandler(e) {
    


    window.sessionStorage.setItem('login',"logout"); 
    props.onSetlogin("logout");


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

                <Link to="/about" className="linkmenu">
                    <div className="content">
                    <img src="./image/s_set.png" className="con_img" />{props.LoginRole}
                    </div>
                </Link>
                
      
              </div>
            </nav>
          </div>

          <div className="right">
            <div className="top">
              <div className="top_name"> NO. 1 &nbsp;&nbsp; SENSOR NODE</div>
              <div className="top_log">
              

                <div className="login">
                <div className="out_button">
                <button className="button_on"  onClick={logoutbuttonHandler }> 로그아웃 </button> 
                </div>
                <Routes>
                <Route path="/" element={<About />} />
                <Route path="/about" element={ About(props)} />
                <Route path="/setup" element={<About />} />
                </Routes>
          
                </div>
                <div className="join">{myAppGlobal.islocal? "로컬":"원격"}</div>
              </div>
            </div>

            <div className="board">
          
            </div>
          </div>
          
        </div>
      
        </BrowserRouter>
  );

};


  
  export default  Mainpage;

  