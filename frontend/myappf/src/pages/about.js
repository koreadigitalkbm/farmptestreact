import React, { useState, useEffect } from 'react';
import myAppGlobal from "../myAppGlobal";


const About = (props) => {
  console.log("-------------------------about page ---------------------");

  const [devcieversion, setDevcieversion] = useState([]);
  const [serverversion, setServerversion] = useState([]);

  
  let isupdate=false;

  if(myAppGlobal.islocal ==false)
  {
    myAppGlobal.farmapi.getdeviceinfo(false).then((ret) => {
    console.log( " get server version ret : " +ret.retMessage);
    setServerversion(ret.retMessage);
    
   });
  }

  myAppGlobal.farmapi.getdeviceinfo(true).then((ret) => {
    console.log( "getdevice version ret : " +ret.retMessage);
    setDevcieversion(ret.retMessage);
  });

/*
  useEffect(() => {
    if(serverversion > devcieversion  && devcieversion >0 )
    {
      isupdate=true;
    }
  
    console.log( "About useEffect : " +isupdate);

  });
*/



  if(myAppGlobal.islocal ==true)
  {
    return(
      <div>
          <h2>about Page </h2>
           장비버전 : {devcieversion}
      </div>
  );

  }
  else{
    return(
      <div>
          <h2>about Page </h2>
          장비버전 : {devcieversion}
          최신버전 : {serverversion}
          {isupdate? <button className=""  onClick={updateTESTandler }> 업데이트 테스트 </button>: "최신버전 입니다."}
      </div>
  );

  }
    
}


    
function updateTESTandler(e) {
  console.log("updateTESTandler : " + e.target.name );
  myAppGlobal.farmapi.getdeviceinfo(false).then((ret) => {
    console.log( " updateTESTandler false ret : " +ret.retMessage);
 
  });

  myAppGlobal.farmapi.getdeviceinfo(true).then((ret) => {
    console.log( " updateTESTandler true ret : " +ret.retMessage);
 
  });

  
}



export default About;