
import React, { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";
//const crypto = require('crypto');



const Loginpage=(props)=>{

    let loginid;
    let loginpw;

    
    let logintype;

    
    console.log("Loginpage  :" + props.Islogin)  ;
    
    console.log("Loginpage islocal :" + myAppGlobal.islocal)  ;
    
    if (myAppGlobal.islocal === false) {
        logintype = (
       
          <div className="content">
            <label>ID:  </label>
            <input type="text" key="1235" name="inputloginid" onChange={inputonchangeHandler} />
            <l></l>
            <label>암호:  </label>
            <input type="text" key="1234" name="inputloginpw" onChange={inputonchangeHandler} />
            <button className=""  onClick={loginbuttonHandler }> 로그인 </button> 
            <div id="statusText">kbm update test</div>
            <canvas id="waves"></canvas>
            <button className=""  onClick={updatebuttonHandler }> 업데이트1 </button> 
            

          </div>
       
      );
    } else {


      
    myAppGlobal.farmapi.getLocaldeviceid().then((ret) => {
        
      if(ret)
  {
      if(ret.IsOK == true)
      {
          
          console.log( " getLocaldeviceid ret : " +ret.retMessage);

      }

  }
    });
  




        logintype = (
        <div className="">
            <label>간편로그인(로컬):  </label>
            
            
            <div>
            <label>암호:  </label>
            <input type="text" key="1234" name="inputloginpw" onChange={inputonchangeHandler} />
            <button className=""  onClick={loginbuttonHandler }> 로그인 </button> 
            </div>
            
            <div id="container">
      <div id="statusText">kbm update test</div>
      <canvas id="waves"></canvas>
      <button className=""  onClick={updatebuttonHandler }> 업데이트1 </button> 
      </div>

          </div>
      );
    }


    

    
  function updatebuttonHandler(e) {
    console.log("updatebuttonHandler : " + e.target.name + " id : " + loginid + " , pw : " + loginpw);
  }


  function inputonchangeHandler(e) {
    console.log("inputonchangeHandler : " + e.target.name);
    switch (e.target.name) {
        case "inputloginid":
            loginid= e.target.value;
          break;
  
        case "inputloginpw":
            loginpw= e.target.value;
  
          break;
      }


    
  }
  
  


  
  function loginkakao(e) {
    console.log("loginkakao : " + e.target.name + " id : " + loginid + " , pw : " + loginpw);

    let retrole= "user";
    window.sessionStorage.setItem('login',retrole); 
    props.onSetlogin(retrole);
  }

  function loginbuttonHandler(e) {
    console.log("loginbuttonHandler : " + e.target.name + " id : " + loginid + " , pw : " + loginpw);


    myAppGlobal.farmapi.setLogin(loginid,loginpw).then((ret) => {
        
        if(ret)
    {
        if(ret.IsOK == true)
        {
            window.sessionStorage.setItem('login',ret.retMessage); 
            props.onSetlogin(ret.retMessage);
            
            console.log( " login ret : " +ret.retMessage);

        }

    }
      });
    


    
    
    

     //window.sessionStorage.setItem('login',"true");    

  }


  return(
    <div>
        <h2>login Page</h2>
        <div key="sdaff">
            {logintype}

        
            

        </div>
    </div>
);

};


//export default connect(mapStateToProps,mapDispatchToProps)(Loginpage);

export default Loginpage;
