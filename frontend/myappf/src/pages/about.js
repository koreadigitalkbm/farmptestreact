import React, { useState, useEffect } from 'react';
import myAppGlobal from "../myAppGlobal";


const About = () => {
  

  const [devcieversion, setDevcieversion] = useState(0);
  const [serverversion, setServerversion] = useState(0);
  let isupdate=false;
  let loginrole = window.sessionStorage.getItem("login");

  
  console.log("-------------------------about page ---------------------");
  console.log("myAppGlobal.islocal:  " + myAppGlobal.islocal  +",devcieversion :"+ devcieversion + ",serverversion :" + serverversion  + " logindeviceid : "+myAppGlobal.logindeviceid + ", loginrole :"+ loginrole);


  useEffect(() => {

    if(myAppGlobal.islocal ==false)
    {
      myAppGlobal.farmapi.getdeviceinfo(false).then((ret) => {
      console.log( " get server version ret : " +ret.retMessage);
      setServerversion(ret.retMessage);
      
     });
    }
  
    myAppGlobal.farmapi.getdeviceinfo(true).then((ret) => {
      console.log( "getdevice version ret1 : " +ret.retMessage);
      setDevcieversion(ret.retMessage);
  
    });

   
  
    console.log( "About useEffect : " +isupdate);

  },[]);


  if(serverversion > devcieversion  && devcieversion >0 )
  {
    
    isupdate =true;
  }



  if(myAppGlobal.islocal ==true)
  {
    return(
      <div>
          <h2>about Page..2 {myAppGlobal.logindeviceid} </h2>
           장비버전 : {devcieversion}
      </div>
  );

  }
  else{

    if(loginrole === "admin")
    {
      return(
        <div>
            <h2>about Page..2 {myAppGlobal.logindeviceid} </h2>
            <div>
            서버버전 : {serverversion}
            </div>
            <div>
             <button className=""  onClick={updateServercode }> 서버 업데이트  </button>
            </div>
            
        </div>
    );


    }
    else
    {
    return(
      <div>
          <h2>about Page..3 {myAppGlobal.logindeviceid} </h2>
          <div>
          장비버전 : {devcieversion}
          </div>
          <div>
          업데이트버전 : {serverversion}
          </div>
          <div>
          {isupdate? <button className=""  onClick={updateLocalDevice}> 업데이트 테스트 </button>: "최신버전 입니다."}
          </div>
          
      </div>
  );
    }
  }
    
}

function updateServercode(e) {
  console.log("updateServercode : " + e.target.name );
  

  myAppGlobal.farmapi.setsoftwareupdate(false).then((ret) => {
    console.log( " setsoftwareupdate ret : " +ret.retMessage);
 
  });

  
}

    
function updateLocalDevice(e) {
  console.log("updateLocalDevice : " + e.target.name );
  

  myAppGlobal.farmapi.setsoftwareupdate(true).then((ret) => {
    console.log( " setsoftwareupdate ret : " +ret.retMessage);
 
  });

  
}



export default About;