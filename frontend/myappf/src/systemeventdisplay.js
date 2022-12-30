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
      <li key={index} role="option"> 
      {evetinfo.eventtostring()}
      </li>
  );
}

function systemeventdisplay(moutdevarray ) {

  let revlist=[];
  for(let i=moutdevarray.length-1;i>=0;i--)
  {
    revlist.push(moutdevarray[i]);
  }

  return(
    <div class="listbox-area">
<div>
    <span id="ss_elem" class="listbox-label">시스템 이벤트목록입니다.</span>
    <ul id="ss_elem_list" tabindex="0" role="listbox" aria-labelledby="ss_elem">
    {revlist.map((localState,index) => eventmsgbox(localState,index))}
    </ul>
    </div>
    </div>
    );
}

export default systemeventdisplay;
