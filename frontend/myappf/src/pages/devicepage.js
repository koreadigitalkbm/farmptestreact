import React, { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";

const Devicepage = () => {
  //const [moutdevarray, setUpdate] = useState([]);
  
  return (
    <div>
      <h2>device Page.. </h2>
      <div></div>
      <div>
        <button className="" name="on" onClick={actoperation}>
          {" "}
          구동기 on {" "}
        </button>
      </div>
      <div>
        <button className="" name="off" onClick={actoperation}>
          {" "}
          구동기 off {" "}
        </button>
      </div>
      
    </div>
  );
  

  
function actoperation(e) {
  console.log("actoperation : " + e.target.name);
  myAppGlobal.farmapi.setacutuatoroperation(e.target.name).then((ret) => {
    
   
  });
  
  
}


};

export default Devicepage;
