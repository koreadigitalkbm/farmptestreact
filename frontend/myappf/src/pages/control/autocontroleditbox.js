import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";
import AutoControlconfig from "../../commonjs/autocontrolconfig";

import { switchClasses } from "@mui/material";
import KDUtil from "../../commonjs/kdutil";
import KDDefine from "../../commonjs/kddefine";

import AutoInputControl from "../uicomponent/autoinputcontrol";

import AutoInputTimeRange from "../uicomponent/autotimerangeinput";

import JukeboxTemperatureM1 from "./jukeboxtemperature";
import JukeboxWatersupplyM1 from "./jukeboxwatersupply";

export default function Autocontroleditbox(myeditcfg) {
  if (myeditcfg == null) {
    return null;
  } else {
    let copycfg = myeditcfg;

    function setupSave(mcfg) {
      console.log(mcfg);
      console.log("setupSave uid: " + mcfg.Uid + " name : " + mcfg.Name + " istimer : " + mcfg.istimer);
    }

    function inputallchangeHandler(e) {
      console.log("inputallchangeHandler name: " + e.target.name + " type : " + e.target.type);
      switch (e.target.type) {
        case "time":
          copycfg[e.target.name] = KDUtil.timeTosec(e.target.value);
          break;
        default:
          copycfg[e.target.name] = e.target.value;
          break;
      }
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

    const formAutoContent = () => {
      console.log("formAutoContent Cat: " + copycfg.Cat);
      switch (copycfg.Cat) {
        case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
          return (<JukeboxTemperatureM1 keyname="tempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} /> );
        case KDDefine.AUTOCategory.ATC_WATER:
          return (<JukeboxWatersupplyM1 keyname="watersuply" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} /> );
        default:
          return (<JukeboxTemperatureM1 keyname="tempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} /> );
      }
    };

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
          {formAutoContent()}

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
