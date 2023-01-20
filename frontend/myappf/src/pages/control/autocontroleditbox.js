import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";
import AutoControlconfig from "../../commonjs/autocontrolconfig";
import AutoInputControl from "../uicomponent/autoinputcontrol";
import { switchClasses } from "@mui/material";
import KDUtil from "../../commonjs/kdutil";


export default function  Autocontroleditbox(myeditcfg) {


  //const [misTimershow, selectcontrol] = useState(myeditcfg !=null && myeditcfg.istimer);
  console.log("Autocontroleditbox  ETime: " +myeditcfg.ETime);// Object.entries(myeditcfg));

  let eee= "ETime";
  myeditcfg[eee]= 22363;
  console.log("Autocontroleditbox  ETimeff: " +myeditcfg.ETime);

  console.log(myeditcfg);

  console.log(Object.keys(myeditcfg.ETime));
  


  if (myeditcfg == null) {
    return <div></div>;
  } else {
    let copycfg = myeditcfg; 

    //let starttime_sec =/3600)+":"+ ((mydata.mConfig.starttime/60)%60);
    //let endtime_sec = (mydata.mConfig.endtime/3600)+":"+ ((mydata.mConfig.endtime/60)%60);

    function setupSave(mcfg) {
      console.log(mcfg)
      console.log("setupSave uid: " + mcfg.Uid + " name : " + mcfg.Name + " istimer : " + mcfg.istimer);

    }

    function inputnumberchangeHandler(e) {
     
      console.log(e.target);
      console.log(e.target.type);
      console.log("inputnumberchangeHandler : " + e.target.name );
      copycfg[e.target.name]=e.target.value;


//      console.log("inputnumberchangeHandler DTValue: " +copycfg.DTValue);
  //    console.log("inputnumberchangeHandler NTValue: " +copycfg.NTValue);
    //  console.log("inputnumberchangeHandler BValue: " +copycfg.BValue);


    }

    function inputtimechangeHandler(e) {
     
      console.log("inputtimechangeHandler : " + e.target.name );
      

    }
 function inputtextchangeHandler(e) {
      console.log("inputtextchangeHandler : " + e.target.name );
      copycfg[e.target.name]=e.target.value;
    }

    function inputallchangeHandler(e) {
      console.log("inputallchangeHandler name: " + e.target.name + " type : "+e.target.type );
      switch(e.target.type)
      {
        case "time":
          copycfg[e.target.name]=KDUtil.timeTosec(e.target.value);
          break;
          default:
                        copycfg[e.target.name]=e.target.value;
          break;
      }

    }


    function inputonchangeHandler(e) {
      console.log("inputonchangeHandler : " + e.target.name );

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
              온도 :
              <AutoInputControl  type="number"  initvalue={copycfg} keyname="DTValue" onChange={inputallchangeHandler} />
            </div>
            <div className="aut_in">
              낮온도 :
              <AutoInputControl  type="number"  initvalue={copycfg} keyname="NTValue" onChange={inputallchangeHandler} />
            </div>
            <div className="aut_in">
              바운드온도 :
              <AutoInputControl  type="number"  initvalue={copycfg} keyname="BValue" onChange={inputallchangeHandler} />
            </div>

            <div className="aut_in">
              시작시간 :
              <AutoInputControl  type="time"  initvalue={copycfg} keyname="STime" onChange={inputallchangeHandler} />
              
            </div>
            <div className="aut_in">
              종료시간 :
              <AutoInputControl  type="time"  initvalue={copycfg} keyname="ETime" onChange={inputallchangeHandler} />
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
