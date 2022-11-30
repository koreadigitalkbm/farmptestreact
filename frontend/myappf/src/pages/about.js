import React, { useState, useEffect } from 'react';
import myAppGlobal from "../myAppGlobal";


const About = () => {
  

  const [devcieversion, setDevcieversion] = useState(0);
  const [serverversion, setServerversion] = useState(0);
  let isupdate=false;
  
  console.log("-------------------------about page ---------------------devcieversion :" + devcieversion + ",serverversion :" + serverversion );


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
          <h2>about Page </h2>
           장비버전 : {devcieversion}
      </div>
  );

  }
  else{
    return(
      <div>
          <h2>about Page </h2>
          <div>
          장비버전 : {devcieversion}
          </div>
          <div>
          업데이트버전 : {serverversion}
          </div>
          <div>
          {isupdate? <button className=""  onClick={updateTESTandler }> 업데이트 테스트 </button>: "최신버전 입니다."}
          </div>
          
      </div>
  );

  }
    
}


    
function updateTESTandler(e) {
  console.log("updateTESTandler : " + e.target.name );
  

  myAppGlobal.farmapi.setsoftwareupdate().then((ret) => {
    console.log( " setsoftwareupdate ret : " +ret.retMessage);
 
  });

  
}



export default About;