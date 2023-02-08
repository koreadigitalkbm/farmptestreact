import React from "react";

import myAppGlobal from "../../myAppGlobal";
import KDUtil from "../../commonjs/kdutil";


function eventmsgbox(mydata,index) {
  
  let evetinfo =mydata;

  
  return (
      <li key={index} role="option"> 
      {KDUtil.EventToString(evetinfo, myAppGlobal)}
      </li>
  );
}

function systemeventdisplay(moutdevarray ) {
  
  //console.log("------------------------systemeventdisplay-------------------length : " + moutdevarray.length);
  return(
    <div class="listbox-area">
<div>
    <span id="ss_elem" class="listbox-label">시스템 이벤트목록입니다.</span>
    <ul id="ss_elem_list" tabindex="0" role="listbox" aria-labelledby="ss_elem">
    {moutdevarray.map((localState,index) => eventmsgbox(localState,index))}
    </ul>
    </div>
    </div>
    );
}

export default systemeventdisplay;
