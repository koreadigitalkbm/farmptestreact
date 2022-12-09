import React, { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";
import AutoControlconfig from "../commonjs/autocontrolconfig";


const Autocontrolpage = () => {
  const [mSensors, setUpdatesensor] = useState([]);
  const [mAutolist, setUpdateauto] = useState([]);
  const [mDevices, setUpdatedevice] = useState([]);
  const [mSelecteditem, setupselected] = useState(null);

  console.log("Autocontrolpage: ");

  useEffect(() => {
    setUpdateauto(myAppGlobal.systeminformations.Autocontrolcfg);
  }, []);


  function Autocontroleditbox(myeditcfg, msensorlist, mdevlist) {
    //const [misTimershow, selectcontrol] = useState(myeditcfg !=null && myeditcfg.istimer);
    //console.log("Autocontroleditbox  misTimershow: " + misTimershow);

  }
  
  function autocontrolbox(mydata) {
    let autostate = <label className="auto_result"> 정지됨</label>;

    if (mydata.Enb=== true) {
      let onofficon = "./image/" + (mydata.Enb ? "on" : "off") + ".png";

      ///<img src={onofficon} className="onoff" />
      autostate = <label className="auto_result"> 작동중</label>;
    }

    return (
      <div className="auto_seln">
        <label className="auto_inname">{mydata.Name}</label>

        {autostate}
        <div className="auto_change">
          <button className="change_but" onClick={() => setupselected(AutoControlconfig.deepcopy(mydata))} id="editcheck">
            설정변경
          </button>
        </div>
      </div>
    );
  }


  function onAdd() {
  
  }

  return (
    <div>
      <div className="auto">
        <div className="select">
          <div className="select_name">정렬 :</div>
          <div className="select_sort">
            <select name="sort">
              <option value="1">시간순서</option>
              <option value="2">이름순서</option>
              <option value="3">카테고리</option>
            </select>
          </div>
          <div className="select_add">
            <button className="add_button" onClick={() => onAdd()}>
              + 추가
            </button>
          </div>
        </div>
      </div>
      <div className="autocontroltable">
        {Autocontroleditbox(mSelecteditem, mSensors, mDevices)}

        {mAutolist.map((localState, index) => autocontrolbox(localState))}
      </div>
    </div>
  );
};

export default Autocontrolpage;
