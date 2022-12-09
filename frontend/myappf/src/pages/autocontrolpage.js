import React, { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";


const Autocontrolpage = () => {
  const [mSensors, setUpdatesensor] = useState([]);
  const [mAutolist, setUpdateauto] = useState([]);
  const [mDevices, setUpdatedevice] = useState([]);
  const [mSelecteditem, setupselected] = useState(null);

  console.log("Autocontrolpage: ");

  useEffect(() => {}, []);


  function Autocontroleditbox(myeditcfg, msensorlist, mdevlist) {
    //const [misTimershow, selectcontrol] = useState(myeditcfg !=null && myeditcfg.istimer);
    //console.log("Autocontroleditbox  misTimershow: " + misTimershow);

  }
  function autocontrolbox(mydata) {
 
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
