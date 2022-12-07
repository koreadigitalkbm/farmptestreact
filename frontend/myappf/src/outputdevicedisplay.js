import React from "react";


function manualonoff(channel, onoff) {
  

  
}

function outputdevbox(mydata, isonlystatus) {
  let ismanual  ;
  let devicon = "./image/devicon_" + mydata.DevType + ".png";
  let onofficon = "./image/" + mydata.Status + ".png";

  if (mydata.Opm === "LM") {
    
    ismanual = (
      <div className="man_result">
        <span className="blinking">현장제어중</span>
      </div>
    );

  } else if (mydata.Opm == "MA") {
    if (isonlystatus == true) {
      ismanual = (<div className="out_result">수동제어</div>);
    } else {
      ismanual = (
        <div className="out_button">
          <button className="button_on" onClick={() => manualonoff(mydata.Channel, true)}>수동 On</button> <button className="button_off"  onClick={() => manualonoff(mydata.Channel, false)}>수동 Off</button>
        </div>
      );
    }
  }
  else{
    ismanual = (
      <div className="out_result">자동제어중
      </div>
    );
  }

  return (
    <div className="out_con">
      <div className="out_name"> <img src={devicon} className="icon" />   {mydata.Uid}    </div>
      <div className="out_value"> <img src={onofficon} className="onoff" />   </div>
      {ismanual}
    </div>
  );
}

function Outputdevicedisplay(moutdevarray, isonlystatus) {
  return (
        
       <div className="output">
        {moutdevarray.map((localState, index) => outputdevbox(localState, isonlystatus))}
       </div>
    
  );
}

export default Outputdevicedisplay;
