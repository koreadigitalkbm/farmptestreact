import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";
import AutoControlconfig from "../../commonjs/autocontrolconfig";


export default function  Autocontroleditbox(myeditcfg) {


  //const [misTimershow, selectcontrol] = useState(myeditcfg !=null && myeditcfg.istimer);
  //console.log("Autocontroleditbox  misTimershow: " + misTimershow);


  function secToTime(dayseconds) {
    if (dayseconds >= 24 * 3600) {
      return "23:59";
    }
    let hour = Math.floor(dayseconds / 3600);
    let min = Math.floor((dayseconds - hour * 3600) / 60);
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;
    console.log("secToTime : " + (hour + ":" + min));
    return hour + ":" + min;
  }

  function timeTosec(timestr) {
    const [hours, minutes] = timestr.split(":");
    return Number(hours * 3600 + minutes * 60);
  }

  if (myeditcfg == null) {
    return <div></div>;
  } else {
    let copycfg = myeditcfg; 

    //let starttime_sec =/3600)+":"+ ((mydata.mConfig.starttime/60)%60);
    //let endtime_sec = (mydata.mConfig.endtime/3600)+":"+ ((mydata.mConfig.endtime/60)%60);

    function setupSave(mcfg) {
      console.log("setupSave uid: " + mcfg.Uid + " name : " + mcfg.Name + " istimer : " + mcfg.istimer);

      console.log("setupSave uid: " + " copycfg istimer : " + copycfg.istimer);

      myAppGlobal.farmapi.saveAutocontrolconfig(mcfg).then((ret) => {
       console.log("setAutocontrolsetup  retMessage: " + ret.retMessage);
    });

    }

    function inputonchangeHandler(e) {
      console.log("inputonchangeHandler : " + e.target.name);

      switch (e.target.name) {
        case "name":
          copycfg.Name = e.target.value;
          break;

        case "onvalue":
          copycfg.onvalue = Number(e.target.value);
          break;
        case "offvalue":
          copycfg.offvalue = Number(e.target.value);
          break;

        case "STime":
          copycfg.STime = timeTosec(e.target.value);
          break;
        case "ETime":
          copycfg.ETime = timeTosec(e.target.value);
          break;

       
         //setupselected(AutoControlconfig.deepcopy(copycfg));
          break;
        case "autoenable":
          if (e.target.checked === true && e.target.id === "enable") {
            copycfg.Enb = true;
          } else {
            copycfg.Enb = false;
          }

        
      }

      if (e.target.name === "devcheck") {
        let isexist = false;
        for (let i = 0; i < copycfg.devids.length; i++) {
          if (copycfg.devids[i] === Number(e.target.id)) {
            if (e.target.checked === false) {
              copycfg.devids.splice(i, 1);
              return;
            } else {
              isexist = true;
              break;
            }
          }
        }
        //새로추가
        if (isexist === false) {
          copycfg.devids.push(Number(e.target.id));
        }
        //console.log({copycfg});
      }
    }

    function sensorselectbox(mitem) {
      return (
        <ui>
          <input type="radio" key={copycfg.Uid} name="sensorsel" defaultChecked={mitem.seleted} id={mitem.uniqkey} />
          {mitem.title}
        </ui>
      );
    }

    function devicecheckbox(mitem) {
      return (
        <ui>
          <input type="checkbox" key={copycfg.Uid} name="devcheck" defaultChecked={mitem.seleted} id={mitem.uniqkey} /> {mitem.title}
        </ui>
      );
    }

    let slist = [];
   

   

    return (
      <div className="auto_control">
        <div className="auto_title" onChange={inputonchangeHandler}>
          <div className="auto_name">자동제어 운전변경 :{copycfg.Uid}</div>
          <div className="auto_stop">
            <input type="radio" key={"enable" + copycfg.Uid} name="autoenable" defaultChecked={copycfg.Enb} id="enable" /> 자동운전
            <input type="radio" key={"disable" + copycfg.Uid} name="autoenable" defaultChecked={copycfg.Enb === false} id="disable" /> 정지(수동제어)
          </div>
        </div>

        <div className="autosetupinnerbox">
          <div className="auto_input">
            <div className="aut_in">
              이름 :
              <input type="text" key={"name" + copycfg.Uid} defaultValue={copycfg.Name} name="name" onChange={inputonchangeHandler} />
            </div>
            <div className="aut_in">
              시작시간 :
              <input type="time" key={"STime" + copycfg.Uid} defaultValue={secToTime(copycfg.STime)} name="STime" onChange={inputonchangeHandler} />
            </div>
            <div className="aut_in">
              종료시간 :
              <input type="time" key={"ETime" + copycfg.Uid} defaultValue={secToTime(copycfg.ETime)} name="ETime" onChange={inputonchangeHandler} />
            </div>
          </div>

         

          <div>
            

            <div className="sensorconditionbox" style={copycfg.istimer === false ? {} : { display: "none" }}>
              <div className="con_sen" onChange={inputonchangeHandler}>
                <div className="cons_name">센서선택</div>
                <div className="cons_radio">{slist.map((localState, index) => sensorselectbox(localState))}</div>
              </div>

              <div className="conditionselectbox" onChange={inputonchangeHandler}>
                <input type="radio" key={"up" + copycfg.Uid} name="conditionsel" defaultChecked={copycfg.condition === "up"} id="up" /> 크면켜짐
                <input type="radio" key={"down" + copycfg.Uid} name="conditionsel" defaultChecked={copycfg.condition === "down"} id="down" />
                작으면켜짐
              </div>

              <label>켜짐조건: </label>
              <input type="number" key={"onvalue" + copycfg.Uid} defaultValue={copycfg.onvalue} name="onvalue" onChange={inputonchangeHandler} />
              <label>꺼짐조건: </label>
              <input type="number" key={"offvalue" + copycfg.Uid} defaultValue={copycfg.offvalue} name="offvalue" onChange={inputonchangeHandler} />
            </div>
            <p></p>
           
          </div>

          <div className="control_end">
            <button className="cont_save" onClick={() => setupSave(copycfg)} id="editcheck">
              저장{" "}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
