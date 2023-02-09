import myAppGlobal from "../../myAppGlobal";
import KDUtil from "../../commonjs/kdutil";



function eventmsgbox(mydata,index) {
    //console.log("------------------------eventmsgbox------------------- : ");
  
  return (
      <li key={index} role="option"> 
      {KDUtil.EventToString(mydata, myAppGlobal)}
      </li>
  );
}

const  Systemeventdisplay= (props )=> {
  
  
  const evtlist = props.mevtlist;

  
  if(evtlist ==null)
  {
    return null;
  }
  console.log("------------------------systemeventdisplay-------------------length : "  +evtlist.length);

  return(
    <div class="listbox-area"  >
<div>
    <span id="ss_elem" class="listbox-label">시스템 이벤트목록입니다.</span>
    <ul id="ss_elem_list" tabindex="0" role="listbox" aria-labelledby="ss_elem">
    {evtlist.map((localState,index) => eventmsgbox(localState,index))}
    </ul>
    </div>
    </div>
    );
}


export default Systemeventdisplay;
