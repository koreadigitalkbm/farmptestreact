import React, { useState, useEffect } from 'react';
import myAppGlobal from "../myAppGlobal";


const About = (props) => {
  console.log("-------------------------about page ---------------------");


  


    return(
        <div>
            <h2>about Page </h2>
            {myAppGlobal.islocal? "로컬":<button className=""  onClick={updateTESTandler }> 업데이트 테스트 </button>}

            
        </div>
    );
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