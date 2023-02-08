//자동제어
const ActuatorOperation = require("../../frontend/myappf/src/commonjs/actuatoroperation");
const AutoControlStatus = require("../../frontend/myappf/src/commonjs/autocontrolstatus");
const AutoControlconfig = require("../../frontend/myappf/src/commonjs/autocontrolconfig");
const AutoControlUtil = require("../../frontend/myappf/src/commonjs/autocontrolutil");
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("../kdcommon");
const SystemEvent = require("./systemevent");

module.exports = class AutoControl {
  constructor(mconfig) {
    this.mConfig = AutoControlconfig.deepcopy(mconfig); // 자동제어 설정을 복사해서 넣음
    this.mState = new AutoControlStatus(mconfig.UniqID);
    this.mLog = [];
    this.PWMonoffstate = false;
    this.PWMLasttoltalsec = 0; // 마지막 명령어 전송시점.
    this.OnSecTime = 0; //켜짐시간(초), 모드에 따라 변경됨으로
    this.NewEvent=null;//이벤트 발생하면 여기에 
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

    this.OnSecTime = Number(onsectime);

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
        if (daytotalsec > Number(this.PWMLasttoltalsec) + Number(offsectime)) {
          this.PWMLasttoltalsec = daytotalsec;
          this.PWMonoffstate = true;
          //on 시간일때만 켜기 명령어 보냄  off 는 장비에서 알아서 off됨 ( timed on 방식이므로)
          console.log("-isTimercondition on : " + daytotalsec + " ,OSecTime : " + this.OnSecTime);
          return KDDefine.AUTOStateType.AST_On;
        }
      } else {
        if (daytotalsec > Number(this.PWMLasttoltalsec) + Number(onsectime)) {
          this.PWMLasttoltalsec = daytotalsec;
          this.PWMonoffstate = false;
          console.log("-isTimercondition off : " + daytotalsec);
        }
      }
    }
    return KDDefine.AUTOStateType.AST_IDLE;
  }

  getStateBySensorcondition(msensors, daytotalsec) {

    let currentstate = KDDefine.AUTOStateType.AST_IDLE;
    let currsensor = null;


    //환기제어 별도로 왜냐면 센서가 여려개일수 있고 이레적으로  PWM 제어임
    if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX) 
    {
      let co2sensor=null;
      let humiditysensor=null;
      for (const ms of msensors) {
        //우선 센서 1개만 처리
        if (ms.UniqID == this.mConfig.Senlist[0]) {
          humiditysensor = ms;
          
        }
        if (ms.UniqID == this.mConfig.Senlist[1]) {
          co2sensor = ms;
          
        }
        if(humiditysensor !=null && co2sensor !=null)
        {
          break;
        }

      }

      if (humiditysensor == null && co2sensor ==null) {
        //해당센서 없음
        console.log("getStateBySensorcondtion no sensor all : " + msensors.length);
        return KDDefine.AUTOStateType.AST_ERROR;
      }


      let co2targetvalue = Number(this.mConfig.NTValue);
      let humiditytargetvalue= Number(this.mConfig.DTValue);
      let isonstate=false;

      currentstate = KDDefine.AUTOStateType.AST_Off;

      //습도값이 높아지면 환기
      if(humiditysensor !=null)
      {
        if (humiditysensor.value >= humiditytargetvalue )
        {
          isonstate = true;
        }

      }
      //co2 센서값이 낮아지면 환기
      if(co2sensor !=null)
      {
        if (co2sensor.value <= co2targetvalue )
        {
          isonstate = true;
        }

      }

      //센서 조건이  off 이면 무조건 off
      this.OnSecTime = this.mConfig.DOnTime;

      if(isonstate ==false)
      {
        this.PWMonoffstate = false;
        currentstate= KDDefine.AUTOStateType.AST_Off;
      }
      else{
        
        currentstate=  KDDefine.AUTOStateType.AST_IDLE;
          //환기 켜기 조건일 때만 PWM 방식으로 제어 
          if (this.PWMLasttoltalsec > daytotalsec) {
            this.PWMLasttoltalsec = Number(this.PWMLasttoltalsec) - 24 * 3600;
          }

          if (this.PWMonoffstate == false ) {
            if (daytotalsec > Number(this.PWMLasttoltalsec) + Number(this.mConfig.DOffTime)) {
              this.PWMLasttoltalsec = daytotalsec;
              this.PWMonoffstate = true;
              //on 시간일때만 켜기 명령어 보냄  off 는 장비에서 알아서 off됨 ( timed on 방식이므로)
              console.log("-is aircircuration on : " + daytotalsec + " ,OSecTime : " + this.OnSecTime);
              currentstate=  KDDefine.AUTOStateType.AST_On;

            }
          } else {
            if (daytotalsec > Number(this.PWMLasttoltalsec) + Number(this.mConfig.DOnTime)) {
              this.PWMLasttoltalsec = daytotalsec;
              this.PWMonoffstate = false;
              console.log("-is aircircuration off : " + daytotalsec);
            }
          }
      }


      
      return currentstate;
      
    }



    

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
      console.log("getStateBySensorcondtion no sensor : " + msensors.length);

      return KDDefine.AUTOStateType.AST_ERROR;
    } else {
      const daytotalsec = KDCommon.getCurrentTotalsec();


      let upvalue;
      let downvalue;
      let targetvalue;
      if (this.mConfig.AType == KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY || AutoControlUtil.IsIncludeTime(this.mConfig.STime, this.mConfig.ETime, daytotalsec) == true) {
        targetvalue = Number(this.mConfig.DTValue);
      } else {
        targetvalue = Number(this.mConfig.NTValue);
      }
      upvalue = targetvalue + Number(this.mConfig.BValue);
      downvalue = targetvalue - Number(this.mConfig.BValue);

      console.log("getStateBySensorcondtion currsensor:" + currsensor.value + " upvalue : " + upvalue + " ,downvalue: " + downvalue);

      //냉난방 동시제어일때
      if (KDDefine.SensorConditionType.SCT_DOWNBOTHIDLE == this.mConfig.Cdir) {
        if (currsensor.value <= downvalue) {
          //히터 켬
          currentstate = KDDefine.AUTOStateType.AST_On;
        } else if (currsensor.value > upvalue) {
          //냉방 켬
          currentstate = KDDefine.AUTOStateType.AST_Off;
        } else {
          if (currsensor.value <= targetvalue) {
            //냉방끔
            currentstate = KDDefine.AUTOStateType.AST_Down_Idle;
          } else if (currsensor.value > targetvalue) {
            //히터 끔
            currentstate = KDDefine.AUTOStateType.AST_Up_Idle;
          }
        }
      } else if (KDDefine.SensorConditionType.SCT_UP == this.mConfig.Cdir) {
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

  isOperationsBySpecify() {
    switch (this.mConfig.Cat) {
      case KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX:
      case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
      case KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX:
        return true;
      default:
        return false;
    }
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
            //console.log("-getOperationsBySpcify  ateType.AST_On : " + whiteleddev.UniqID + " Params:" + this.mConfig.Params[0]);
            // 디밍값을 켜짐시간에 합쳐서 전달
            whitedemming = ActuatorOperation.Gettimewithparam(this.OnSecTime, this.mConfig.Params[0]);
            reddemming = ActuatorOperation.Gettimewithparam(this.OnSecTime, this.mConfig.Params[1]);
            bluedemming = ActuatorOperation.Gettimewithparam(this.OnSecTime, this.mConfig.Params[2]);
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
            ledstate = false;
          }

          if (ledstate != null) {
            console.log("-getOperationsBySpcify  whiteleddev : " + whiteleddev.UniqID + " whitedemming:" + whitedemming);
            console.log("-getOperationsBySpcify  redleddev : " + redleddev.UniqID + " whitedemming:" + reddemming);
            console.log("-getOperationsBySpcify  blueleddev : " + blueleddev.UniqID + " whitedemming:" + bluedemming);

            let opcmdwhite = new ActuatorOperation(whiteleddev.UniqID, ledstate, whitedemming);
            let opcmdred = new ActuatorOperation(redleddev.UniqID, ledstate, reddemming);
            let opcmdblue = new ActuatorOperation(blueleddev.UniqID, ledstate, bluedemming);
            opcmdlist.push(opcmdwhite);
            opcmdlist.push(opcmdred);
            opcmdlist.push(opcmdblue);

            this.mState.State = currentstate;
          }
        }

        break;
      case KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX:

        for (const mactid of this.mConfig.Actlist) {
          let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
          let opcmd = new ActuatorOperation(actd.UniqID, currentstate, this.OnSecTime);
          opcmdlist.push(opcmd);
        }
        //현재상태 갱신
        this.mState.State = currentstate;


        

        break;

        case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
          let heaterdev = null;
          let coollerdev = null;
  
          console.log("-getOperationsBySpcify ACT_HEAT_COOL_FOR_FJBOX  currentstate: " + currentstate + " old State:" + this.mState.State);
  
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
            } else if (currentstate == KDDefine.AUTOStateType.AST_Up_Idle) {
              if (this.mState.State == KDDefine.AUTOStateType.AST_On) {
                heaterstate = false;
                coollerstate = false;
              }
            } else if (currentstate == KDDefine.AUTOStateType.AST_Down_Idle) {
              if (this.mState.State == KDDefine.AUTOStateType.AST_Off) {
                heaterstate = false;
                coollerstate = false;
              }
            }
  
            if (heaterstate != null && coollerstate != null) {
              console.log("-getOperationsBySpcify  heaterdev : " + heaterdev.UniqID + " coollerdev:" + coollerdev.UniqID + ",currentstate : " + currentstate + " , OTime : " + this.OnSecTime);
  
              let opcmdheater = new ActuatorOperation(heaterdev.UniqID, heaterstate, this.OnSecTime);
              let opcmdcooler = new ActuatorOperation(coollerdev.UniqID, coollerstate, this.OnSecTime);
              opcmdlist.push(opcmdheater);
              opcmdlist.push(opcmdcooler);
  
              //현재상태 갱신
              this.mState.State = currentstate;
            }
          }
  
          break;

    }

    return opcmdlist;
  }

  getOperationsforcamera() {
    let oplist = [];
    //카메라는  촬영확인
    if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_CAMERA_FJBOX) {
      let timeminnow = KDCommon.getCurrentTotalminute();
      let iscapture = false;

      let starttimemin = this.mConfig.STime / 60;

      let ncount = this.mConfig.DTValue;
      let intervalmin = 1440 / ncount;

      for (let i = 0; i <= 1440; i += intervalmin) {
        let timestep = starttimemin + i;

        timestep = timestep >= 1440 ? timestep - 1440 : timestep;

        if (timeminnow == timestep) {
          iscapture = true;
          break;
        }
      }

      if (iscapture === true) {
        console.log("getOperationsforcamera ---------------capture:  " + this.mConfig.Actlist[0]);
        oplist.push(this.mConfig.Actlist[0]);
      }
    }

    return oplist;
  }
  
  //자동제어 상태를 업데이트하고 상태변경이 되면 이벤트를 생성해서 리턴한다.
  setUpdatestateWithEvent(newautostate)
  {

    this.NewEvent=null;
    if(this.mState.State != newautostate)
    {
      //상태가 유지상태일경우 이벤트 발생안함
      if(newautostate== KDDefine.AUTOStateType.AST_Up_Idle || newautostate== KDDefine.AUTOStateType.AST_Down_Idle  || newautostate== KDDefine.AUTOStateType.AST_IDLE)
      {

      }
      else{

        this.NewEvent=SystemEvent.createAutoControlEvent(this.mConfig.Uid,newautostate);
      }
      this.mState.State=newautostate;
    }
    return this.NewEvent;
  }


  //자동제어 조건을 확인하고 변경이 되면 구동명령어 목록을 리턴한다.
  getOperationsByControl(msensors, mactuators) {
    let oplist = [];
    
    

    let currentstate = KDDefine.AUTOStateType.AST_IDLE;
    let timesecnow = KDCommon.getCurrentTotalsec();



    //카메라는 여기서 처리안함
    if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_CAMERA_FJBOX) {
      return oplist;
    }

    if (this.isBasiccondition(timesecnow) == true) {
      if (this.mConfig.AType == KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT || this.mConfig.AType == KDDefine.AUTOType.ACM_TIMER_ONLY_DAY) {
        //타이머
        currentstate = this.getStateByTimercondition(timesecnow);
      } else {
        //센서
        currentstate = this.getStateBySensorcondition(msensors,timesecnow);
      }
    } else {
      //기본조건 안맞음 모두  off
      currentstate = KDDefine.AUTOStateType.AST_Off_finish;
      //console.log("-getOperationsByControl ---------------AST_Off_finish  " );
    }
    //console.log("-this.Name : " + this.mConfig.Name+ ", ---------------timesecnow :   "+timesecnow +",currentstate :"+currentstate );

    // 먼가 상태가 변경되어 구동기에 명령어를 주어야함.
    if (this.mState.ischangestatecheck(currentstate) == true) {

      


      if (currentstate != KDDefine.AUTOStateType.AST_IDLE) {
        if (this.isOperationsBySpecify() == true) {
          oplist = this.getOperationsBySpecify(mactuators, currentstate);
          
        } else {
          //일반적인 자동제어 처리 처리
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

      this.setUpdatestateWithEvent(currentstate);
      
    }

    return oplist;
  }
};
