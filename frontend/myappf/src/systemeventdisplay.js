import React from "react";

import myAppGlobal from "./myAppGlobal";
import KDUtil from "./commonjs/kdutil";
import KDDefine from "./commonjs/kddefine";
import SystemEvent from "./commonjs/systemevent";



function eventmsgbox(mydata,index) {
  let ismanual;

  //console.log("------------------------eventmsgbox--------------------index : " + index);

  let evetinfo = SystemEvent.Clonbyjsonobj(mydata);

  
  return (
    <div className="eventbox_dip" key={index}>
      {evetinfo.eventtostring()}
    </div>
  );
}

function systemeventdisplay(moutdevarray ) {
  return <div className="output">{moutdevarray.map((localState,index) => eventmsgbox(localState,index))}</div>;
}

export default systemeventdisplay;
