import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";
import AutoControlconfig from "../../commonjs/autocontrolconfig";
import Autocontroleditbox from  "./autocontroleditbox";

const Autocontrolpage =  (props) => {
  const [systestinfo, setTestinfo] = useState(null)
  const [mAutolist, setUpdateauto] = useState([]);
  const [mSelecteditem, setupselected] = useState(null);

  console.log("Autocontrolpage: ");

  useEffect(() => {

    console.log("Autocontrolpage useEffect : "+props.Systeminfo );

    if(props.Systeminfo !=null)
    {
      setTestinfo(props.Systeminfo);
      setUpdateauto(myAppGlobal.systeminformations.Autocontrolcfg);
    }
  }, [props.Systeminfo]);



  
  function autocontrolbox(mydata, mseldata) {
    let autostate = <label className="auto_result"> 정지됨</label>;

    if (mydata.Enb=== true) {
      let onofficon = "./image/" + (mydata.Enb ? "on" : "off") + ".png";

      ///<img src={onofficon} className="onoff" />
      autostate = <label className="auto_result"> 작동중</label>;
    }

    

    return (
      <div>
     
      <div className="auto_seln">
        <label className="auto_inname">{mydata.Name}</label>

        {autostate}
        <div className="auto_change">
          <button className="change_but" onClick={() => setupselected(AutoControlconfig.deepcopy(mydata))} id="editcheck">
            설정변경
          </button>
        </div>
      
        
      </div>
       
      <div>
       {(mseldata !=null && mseldata.Uid == mydata.Uid )? Autocontroleditbox(mseldata):"" }
       </div>


      </div>
       

    );
  }


  function onAdd() {
  
  }

  return (
    <div>
      <div className="autocontroltable">
        

        {mAutolist.map((localState, index) => autocontrolbox(localState,mSelecteditem))}
        

      </div>
      <div className="auto">
          <div className="select_add">
            <button className="add_button" onClick={() => onAdd()}>
              + 자동제어 추가
            </button>
          </div>
        
      </div>

    </div>
  );
};

export default Autocontrolpage;
