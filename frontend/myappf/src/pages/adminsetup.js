import React, { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";

const AdminSetup = () => {
  let loginrole = window.sessionStorage.getItem("login");
  console.log("-------------------------admin setup page ---------------------");
  

  useEffect(() => {
  
    console.log("AdminSetup useEffect : " );
  }, []);

    if (loginrole === "factoryadmin") {
      return (
        <div>
          <h2>Device Factory Setup Page... {myAppGlobal.logindeviceid} </h2>
          <div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h2>KD admin  setup. {myAppGlobal.logindeviceid} </h2>
          
        </div>
      );
    }
  
};


export default AdminSetup;
