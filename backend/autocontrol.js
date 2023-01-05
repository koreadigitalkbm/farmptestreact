//자동제어
const ActuatorOperation = require("../frontend/myappf/src/commonjs/actuatoroperation");
const AutoControlStatus = require("../frontend/myappf/src/commonjs/autocontrolstatus");
const AutoControlconfig = require("../frontend/myappf/src/commonjs/autocontrolconfig");
const AutoControlUtil = require("../frontend/myappf/src/commonjs/autocontrolutil");
const KDDefine = require("../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("./kdcommon");

module.exports = class AutoControl {
  constructor(mconfig) {
    this.mConfig = AutoControlconfig.deepcopy(mconfig); // 자동제어 설정을 복사해서 넣음
    this.mState = new AutoControlStatus(mconfig.UniqID);
    this.mLog = [];
    this.PWMonoffstate = false;
    this.PWMLasttoltalsec = 0; // 마지막 명령어 전송시점.
    this.OnSecTime = 0; //켜짐시간(초), 모드에 따라 변경됨으로
  }
  static Clonbyjsonobj(mobj) {
    return new AutoControl(mobj.mConfig);
  }
  //기본적인 사항을 확인함. enable, 시간
  isBasiccondition(timesecnow) {
    if (this.mConfig.Enb == true) {
      //주 야간 모드 이면 시간확인필요없음
      if (this.mConfig.AType == KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT || this.mConfig.AType == KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT) {
        return true;
      }

      //시작시간과 종료시간 안에 들어와함.
      return AutoControlUtil.IsIncludeTime(this.mConfig.STime, this.mConfig.ETime, timesecnow);
    }
    return false;
  }
  //타이머방식 채크 , 두가지 PWM 방식. 1회
  getStateByTimercondition(daytotalsec) {
    let offsectime;
    let onsectime;

    if (this.mConfig.AType == KDDefine.AUTOType.ACM_TIMER_ONLY_DAY || AutoControlUtil.IsIncludeTime(this.mConfig.STime, this.mConfig.ETime, daytotalsec) == true) {
      //주간
      offsectime = this.mConfig.DOffTime;
      onsectime = this.mConfig.DOnTime;
    } else {
      // 야간
      offsectime = this.mConfig.NOffTime;
      onsectime = this.mConfig.NOnTime;
    }

    this.OnSecTime = onsectime;

    if (offsectime == 0) {
      if (this.PWMonoffstate == false) {
        this.PWMonoffstate = true;
        this.PWMLasttoltalsec = 0; // 1회성표시
        return KDDefine.AUTOStateType.AST_On;
      }
    } else {
      //PWM 제어

      //자정이 넘어가면
      if (this.PWMLasttoltalsec > daytotalsec) {
        this.PWMLasttoltalsec = this.PWMLasttoltalsec - 24 * 3600;
      }

      if (this.PWMonoffstate == false) {
        if (daytotalsec > this.PWMLasttoltalsec + offsectime) {
          this.PWMLasttoltalsec = daytotalsec;
          this.PWMonoffstate = true;
          //on 시간일때만 켜기 명령어 보냄  off 는 장비에서 알아서 off됨 ( timed on 방식이므로)
          console.log("-isTimercondition on : " + daytotalsec + " ,OSecTime : " + this.OnSecTime);
          return KDDefine.AUTOStateType.AST_On;
        }
      } else {
        if (daytotalsec > this.PWMLasttoltalsec + onsectime) {
          this.PWMLasttoltalsec = daytotalsec;
          this.PWMonoffstate = false;
          console.log("-isTimercondition off : " + daytotalsec);
        }
      }
    }
    return KDDefine.AUTOStateType.AST_IDLE;
  }

  getStateBySensorcondition(msensors) {
    let currentstate = KDDefine.AUTOStateType.AST_IDLE;
    let currsensor = null;

    //센서에 의해서 작동함으로 켜짐시간 고정
    this.OnSecTime = this.mConfig.DOnTime;
    for (const ms of msensors) {
      //우선 센서 1개만 처리
      if (ms.UniqID == this.mConfig.Senlist[0]) {
        currsensor = ms;
        break;
      }
    }
    if (currsensor == null) {
      //해당센서 없음
      console.log("getStateBySensorcondition no sensor : " + msensors.length);

      return KDDefine.AUTOStateType.AST_ERROR;
    } else {
      const daytotalsec = KDCommon.getCurrentTotalsec();
      let upvalue;
      let downvalue;
      if (this.mConfig.AType == KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY || AutoControlUtil.IsIncludeTime(this.mConfig.STime, this.mConfig.ETime, daytotalsec) == true) {
        upvalue = this.mConfig.DTValue + this.mConfig.BValue;
        downvalue = this.mConfig.DTValue - this.mConfig.BValue;
      } else {
        upvalue = this.mConfig.NTValue + this.mConfig.BValue;
        downvalue = this.mConfig.NTValue - this.mConfig.BValue;
      }

      //console.log("getStateBySensorcondition  upvalue : " + upvalue + " ,downvalue: " + downvalue);

      if (KDDefine.SensorConditionType.SCT_UP == this.mConfig.Cdir) {
        if (currsensor.value >= upvalue) {
          currentstate = KDDefine.AUTOStateType.AST_On;
        } else if (currsensor.value < downvalue) {
          currentstate = KDDefine.AUTOStateType.AST_Off;
        }
      } else {
        if (currsensor.value <= downvalue) {
          currentstate = KDDefine.AUTOStateType.AST_On;
        } else if (currsensor.value > upvalue) {
          currentstate = KDDefine.AUTOStateType.AST_Off;
        }
      }
    }

    return currentstate;
  }

  //자동제어로 동작한후 상태가 변경되면  true  리턴
  ischangebycontrol(msensors, timesecnow) {
    return false;
  }

  ///장비고정이고 특별히 제어되는것은 여기서
  getOperationsBySpecify(mactlist, currentstate) {
    let opcmdlist = [];

    


    switch (this.mConfig.Cat) {
      case KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX:
        let whiteleddev = null;
        let redleddev = null;
        let blueleddev = null;

        for (const mactid of this.mConfig.Actlist) {
          let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
          if (actd != null) {
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE) {
              whiteleddev = actd;
            }
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_LED_RED) {
              redleddev = actd;
            }
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_LED_BLUE) {
              blueleddev = actd;
            }
          }
        }
        if (whiteleddev != null && redleddev != null && blueleddev != null) {
          let ledstate = null;
          let whitedemming = 0;
          let reddemming = 0;
          let bluedemming = 0;

          if (currentstate == KDDefine.AUTOStateType.AST_On) {
            ledstate = true;
            //console.log("-getOperationsBySpecify  ateType.AST_On : " + whiteleddev.UniqID + " Params:" + this.mConfig.Params[0]);
            // 디밍값을 켜짐시간에 합쳐서 전달
            whitedemming = this.OnSecTime + this.mConfig.Params[0] * 10000000;
            reddemming = this.OnSecTime + this.mConfig.Params[1] * 10000000;
            bluedemming = this.OnSecTime + this.mConfig.Params[2] * 10000000;
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
            ledstate = false;
          }

          if (ledstate != null) {
            console.log("-getOperationsBySpecify  whiteleddev : " + whiteleddev.UniqID + " whitedemming:" + whitedemming);
            console.log("-getOperationsBySpecify  redleddev : " + redleddev.UniqID + " whitedemming:" + reddemming);
            console.log("-getOperationsBySpecify  blueleddev : " + blueleddev.UniqID + " whitedemming:" + bluedemming);

            let opcmdwhite = new ActuatorOperation(whiteleddev.UniqID, ledstate, whitedemming);
            let opcmdred = new ActuatorOperation(redleddev.UniqID, ledstate, reddemming);
            let opcmdblue = new ActuatorOperation(blueleddev.UniqID, ledstate, bluedemming);
            opcmdlist.push(opcmdwhite);
            opcmdlist.push(opcmdred);
            opcmdlist.push(opcmdblue);
          }
        }

        break;
      case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
        let heaterdev = null;
        let coollerdev = null;

        for (const mactid of this.mConfig.Actlist) {
          let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
          if (actd != null) {
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_HEATER) {
              heaterdev = actd;
            }
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_COOLER) {
              coollerdev = actd;
            }
          }
        }

        if (coollerdev != null && heaterdev != null) {
          let heaterstate = null;
          let coollerstate = null;
          if (currentstate == KDDefine.AUTOStateType.AST_On) {
            heaterstate = true;
            coollerstate = false;
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off) {
            heaterstate = false;
            coollerstate = true;
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
            heaterstate = false;
            coollerstate = false;
          }

          if (heaterstate != null && coollerstate != null) {
            console.log("-getOperationsBySpecify  heaterdev : " + heaterdev.UniqID + " coollerdev:" + coollerdev.UniqID + ",currentstate : " + currentstate + " , OTime : " + this.OnSecTime);

            let opcmdheater = new ActuatorOperation(heaterdev.UniqID, heaterstate, this.OnSecTime);
            let opcmdcooler = new ActuatorOperation(coollerdev.UniqID, coollerstate, this.OnSecTime);
            opcmdlist.push(opcmdheater);
            opcmdlist.push(opcmdcooler);
          }
        }

        break;
    }

    return opcmdlist;
  }

  getOperationsByControl(msensors, mactuators) {
    let oplist = [];
    // console.log( '...' )

    let currentstate = KDDefine.AUTOStateType.AST_IDLE;

    let timesecnow = KDCommon.getCurrentTotalsec();
    if (this.isBasiccondition(timesecnow) == true) {
      if (this.mConfig.AType == KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT || this.mConfig.AType == KDDefine.AUTOType.ACM_TIMER_ONLY_DAY) {
        //타이머
        currentstate = this.getStateByTimercondition(timesecnow);
      } else {
        //센서
        currentstate = this.getStateBySensorcondition(msensors);
      }
    } else {
      //기본조건 안맞음 모두  off
      currentstate = KDDefine.AUTOStateType.AST_Off_finish;
      //console.log("-getOperationsByControl ---------------AST_Off_finish  " );
    }
    //console.log("-this.Name : " + this.mConfig.Name+ ", ---------------timesecnow :   "+timesecnow +",currentstate :"+currentstate );

    // 먼가 상태가 변경되어 구동기에 명령어를 주어야함.
    if (this.mState.ischangestatecheck(currentstate) == true) {
      oplist = this.getOperationsBySpecify(mactuators, currentstate);

      if (oplist.length > 0) {
        ///
      } else {
        //일반적인 처리
        for (const mactid of this.mConfig.Actlist) {
          let onoffstate = null;

          if (currentstate == KDDefine.AUTOStateType.AST_On) {
            onoffstate = true;
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
            //에러발생시 모두 off
            onoffstate = false;
          }





          if (onoffstate != null) {
            let opcmd = new ActuatorOperation(mactid, onoffstate, this.OnSecTime);
            oplist.push(opcmd);
            console.log("-getOperationsByControl new---------------mactid : " + mactid + " cmd:" + opcmd.Opcmd);
          }
        }
      }
    }

    return oplist;
  }
};
