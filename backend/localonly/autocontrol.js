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
    this.mState = new AutoControlStatus(mconfig.Uid);
    this.mLog = [];
    this.PWMonoffstate = false;
    this.PWMLasttoltalsec = Number(0); // 마지막 명령어 전송시점.
    this.OnSecTime = 0; //켜짐시간(초), 모드에 따라 변경됨으로
    this.NewEvent = null; //이벤트 발생하면 여기에
    this.IsPWMcontrol = false;
    this.isPHon=false;
    this.isECon=false;
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

    //console.log("-getStateByTimercondition daytotalsec : " + daytotalsec  + " mConfig Name: "+this.mConfig.Name);

    if (this.mConfig.AType == KDDefine.AUTOType.ACM_TIMER_ONLY_DAY || AutoControlUtil.IsIncludeTime(this.mConfig.STime, this.mConfig.ETime, daytotalsec) == true) {
      //주간
      offsectime = Number(this.mConfig.DOffTime);
      onsectime = Number(this.mConfig.DOnTime);
    } else {
      // 야간
      offsectime = Number(this.mConfig.NOffTime);
      onsectime = Number(this.mConfig.NOnTime);
    }

    this.OnSecTime = Number(onsectime);

    //off 시간이 0이면 1회만 구동하는 방식임.
    if (offsectime == 0) {
      if (this.PWMonoffstate == false) {
        this.PWMonoffstate = true;
        this.PWMLasttoltalsec = 0; // 1회성표시
        return KDDefine.AUTOStateType.AST_On;
      }
    } else {
      //PWM 제어

      this.IsPWMcontrol = true;
      //현재시간보다 마지막 명령어 시작이 크다면 자정이 지났을경우임. 자정이 넘어가면
      if (this.PWMLasttoltalsec > daytotalsec) {
        this.PWMLasttoltalsec = this.PWMLasttoltalsec - 86400;
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

  //센서제어이면서 pwm 제어방식 off 휴지시간이 있는 경우 이곳에서 제어
  pwmcontrolbysensor(isonstate) {
    let curstate = KDDefine.AUTOStateType.AST_IDLE;

    if (this.IsPWMcontrol === true && isonstate != null) {
      const daytotalsec = KDCommon.getCurrentTotalsec();

      if (isonstate == false) {
        this.PWMonoffstate = false;
        curstate = KDDefine.AUTOStateType.AST_Off;
      } else {
        curstate = KDDefine.AUTOStateType.AST_IDLE;
        //환기 켜기 조건일 때만 PWM 방식으로 제어

         //현재시간보다 마지막 명령어 시작이 크다면 자정이 지났을경우임. 자정이 넘어가면
        if (this.PWMLasttoltalsec > daytotalsec) {
          this.PWMLasttoltalsec = Number(this.PWMLasttoltalsec) - 86400;
        }

        if (this.PWMonoffstate == false) {
          if (daytotalsec >( Number(this.PWMLasttoltalsec) + Number(this.mConfig.DOffTime))) {
            this.PWMLasttoltalsec = daytotalsec;
            this.PWMonoffstate = true;
            //on 시간일때만 켜기 명령어 보냄  off 는 장비에서 알아서 off됨 ( timed on 방식이므로)
            console.log("-is pwmcontrolbysensor on : " + daytotalsec + " ,OSecTime : " + this.OnSecTime);
            curstate = KDDefine.AUTOStateType.AST_On;
          }
        } else {
          if (daytotalsec >( Number(this.PWMLasttoltalsec) + Number(this.mConfig.DOnTime))) {
            this.PWMLasttoltalsec = daytotalsec;
            this.PWMonoffstate = false;
            console.log("-is pwmcontrolbysensor off : " + daytotalsec);
          }
        }
      }
    }
    return curstate;
  }

  getStateBySensorcondition(msensors, daytotalsec) {
    let currentstate = KDDefine.AUTOStateType.AST_IDLE;
    let currsensor = null;
    let offsectime = Number(this.mConfig.DOffTime);

    

    if (offsectime == 0) {
      this.IsPWMcontrol = false;
    } else {
      this.IsPWMcontrol = true;
    }

    //환기제어 별도로 왜냐면 센서가 여려개일수 있고 이레적으로  PWM 제어임
    if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX) {
      let co2sensor = null;
      let humiditysensor = null;

      //  console.log("ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX daytotalsec : " +daytotalsec);

      for (const ms of msensors) {
        //우선 센서 1개만 처리
        if (ms.UniqID == this.mConfig.Senlist[0]) {
          humiditysensor = ms;
        }
        if (ms.UniqID == this.mConfig.Senlist[1]) {
          co2sensor = ms;
        }
        if (humiditysensor != null && co2sensor != null) {
          break;
        }
      }

      if (humiditysensor == null && co2sensor == null) {
        //해당센서 없음
        //console.log("getStateBySensorcondtion no sensor all : " + msensors.length);
        return KDDefine.AUTOStateType.AST_ERROR;
      } else {
        // console.log("ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX humiditysensor : " + humiditysensor);
      }

      let co2targetvalue = Number(this.mConfig.NTValue);
      let humiditytargetvalue = Number(this.mConfig.DTValue);
      let isonstate = false;

      //습도값이 높아지면 환기
      if (humiditysensor != null) {
        if (humiditysensor.value >= humiditytargetvalue) {
          isonstate = true;
        }
      }
      //co2 센서값이 낮아지면 환기
      if (co2sensor != null) {
        if (co2sensor.value <= co2targetvalue) {
          isonstate = true;
        }
      }

      //센서 조건이  off 이면 무조건 off
      this.OnSecTime = Number(this.mConfig.DOnTime);

      /*
      currentstate = KDDefine.AUTOStateType.AST_Off;

      if (isonstate == false) {
        this.PWMonoffstate = false;
        currentstate = KDDefine.AUTOStateType.AST_Off;
      } else {
        currentstate = KDDefine.AUTOStateType.AST_IDLE;
        //환기 켜기 조건일 때만 PWM 방식으로 제어
        if (this.PWMLasttoltalsec > daytotalsec) {
          this.PWMLasttoltalsec = Number(this.PWMLasttoltalsec) - 86400;
        }

        if (this.PWMonoffstate == false) {
          if (daytotalsec > (Number(this.PWMLasttoltalsec) + Number(this.mConfig.DOffTime))) {
            this.PWMLasttoltalsec = daytotalsec;
            this.PWMonoffstate = true;
            //on 시간일때만 켜기 명령어 보냄  off 는 장비에서 알아서 off됨 ( timed on 방식이므로)
            console.log("-is aircircuration on : " + daytotalsec + " ,OSecTime : " + this.OnSecTime);
            currentstate = KDDefine.AUTOStateType.AST_On;
          }
        } else {
          if (daytotalsec > (Number(this.PWMLasttoltalsec) + Number(this.mConfig.DOnTime))) {
            this.PWMLasttoltalsec = daytotalsec;
            this.PWMonoffstate = false;
            console.log("-is aircircuration off : " + daytotalsec);
          }
        }
      }
      */
      currentstate = this.pwmcontrolbysensor(isonstate);

      // return currentstate;
    } else if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_NUTRIENT_SOL3_FOR_FJBOX) {
      let phsensor = null;
      let ecsensor = null;

      //  console.log("ACT_NUTRIENT_SOL3_FOR_FJBOX daytotalsec : " +daytotalsec);

      for (const ms of msensors) {
        //우선 센서 1개만 처리
        if (ms.UniqID == this.mConfig.Senlist[0]) {
          phsensor = ms;
        }
        if (ms.UniqID == this.mConfig.Senlist[1]) {
          ecsensor = ms;
        }
        if (phsensor != null && ecsensor != null) {
          break;
        }
      }

      if (phsensor == null && ecsensor == null) {
        //해당센서 없음
         console.log("getStateBySensorcondtion no sensor phsensor ecsensor: " + this.mConfig.Senlist[0]);
        return KDDefine.AUTOStateType.AST_ERROR;
      } else {
        // console.log("ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX humiditysensor : " + humiditysensor);
      }

      let phtargetvalue = Number(this.mConfig.DTValue);
      let ectargetvalue = Number(this.mConfig.NTValue);
      let isonstate = false;
      this.isPHon=false;
      this.isECon=false;
      //ph가이 높아지면 환기
      if (phsensor != null) {
        if (phsensor.value > phtargetvalue) {
          isonstate = true;
          this.isPHon=true;
        }
      }
      //ec 센서값이 낮아지면 환기
      if (ecsensor != null) {
        if (ecsensor.value < ectargetvalue) {
          isonstate = true;
          this.isECon=true;
        }
      }

      console.log("getStateBySensorcondtion phtargetvalue:" + phtargetvalue + " ectargetvalue : " +ectargetvalue);
      console.log("getStateBySensorcondtion phsensor.value:" + phsensor.value + " ecsensor.value : " +ecsensor.value);
      console.log("getStateBySensorcondtion this.isPHon:" + this.isPHon + " this.isECon : " +this.isECon);

      //센서 조건이  off 이면 무조건 off
      this.OnSecTime = Number(this.mConfig.DOnTime);

      currentstate = this.pwmcontrolbysensor(isonstate);
    } else {
      //센서에 의해서 작동함으로 켜짐시간 고정
      this.OnSecTime = Number(this.mConfig.DOnTime);
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
        //const daytotalsec = KDCommon.getCurrentTotalsec();

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

        //console.log("getStateBySensorcondtion currsensor:" + currsensor.value + " upvalue : " + upvalue + " ,downvalue: " + downvalue);

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

          //console.log("SCT_DOWNBOTHIDLE  currsensor:" + currsensor.value +",targetvalue: "+targetvalue+  ", upvalue : " + upvalue + " ,downvalue: " + downvalue + " currentstate :"+ currentstate);
        } else {
          let isonstate = null;
          if (KDDefine.SensorConditionType.SCT_UP == this.mConfig.Cdir) {
            if (currsensor.value >= upvalue) {
              isonstate = true;
            } else if (currsensor.value < downvalue) {
              isonstate = false;
            }
          } else {
            if (currsensor.value <= downvalue) {
              isonstate = true;
            } else if (currsensor.value > upvalue) {
              isonstate = false;
            }
          }

          currentstate = this.pwmcontrolbysensor(isonstate);
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
      case KDDefine.AUTOCategory.ACT_NUTRIENT_SOL3_FOR_FJBOX:
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

            this.setUpdatestateWithEvent(currentstate);
            //this.mState.State = currentstate;
          }
        }

        break;
      case KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX:
        for (const mactid of this.mConfig.Actlist) {
          let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);

          if (actd != null) {
            let onoffstate = null;
            if (currentstate == KDDefine.AUTOStateType.AST_On) {
              onoffstate = true;
            } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
              onoffstate = false;
            }

            if (onoffstate != null) {
              let opcmd = new ActuatorOperation(actd.UniqID, onoffstate, this.OnSecTime);
              console.log("-getOperationsBySpcify ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX  currentstate: " + currentstate + " OnSecTime:" + this.OnSecTime);
              opcmdlist.push(opcmd);
            }
          }
        }
        //현재상태 갱신
        this.setUpdatestateWithEvent(currentstate);
        //this.mState.State = currentstate;

        break;

      case KDDefine.AUTOCategory.ACT_NUTRIENT_SOL3_FOR_FJBOX:
        {
          let solA = null;
          let solB = null;
          let solC = null;

          for (const mactid of this.mConfig.Actlist) {
            let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
            if (actd != null) {
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_SOL_A) {
                solA = actd;
              }
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_SOL_B) {
                solB = actd;
              }
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_SOL_C) {
                solC = actd;
              }
            }
          }

          
            
              let onoffstate = null;
              if (currentstate == KDDefine.AUTOStateType.AST_On) {
                onoffstate = true;
              } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
                onoffstate = false;
              }

              if (onoffstate != null) {

                if(onoffstate ===true)
                {
                  if(this.isECon==true && solA !=null && solB !=null)
                  {
                    let opcmda = new ActuatorOperation(solA.UniqID, onoffstate, this.OnSecTime);
                    let opcmdb = new ActuatorOperation(solB.UniqID, onoffstate, this.OnSecTime);
                    opcmdlist.push(opcmda);
                    opcmdlist.push(opcmdb);
                  }
                  if(this.isPHon==true &&  solC !=null)
                  {
                    let opcmdc = new ActuatorOperation(solC.UniqID, onoffstate, this.OnSecTime);
                    opcmdlist.push(opcmdc);
                    

                  }

                  

                }
                else{

                  let opcmda = new ActuatorOperation(solA.UniqID, onoffstate, this.OnSecTime);
                  let opcmdb = new ActuatorOperation(solB.UniqID, onoffstate, this.OnSecTime);
                  let opcmdc = new ActuatorOperation(solC.UniqID, onoffstate, this.OnSecTime);
                  opcmdlist.push(opcmda);
                  opcmdlist.push(opcmdb);
                  opcmdlist.push(opcmdc);
                }
                

             //   console.log("-getOperationsBySpcify ACT_NUTRIENT_SOL3_FOR_FJBOX  currentstate: " + currentstate + " OnSecTime:" + this.OnSecTime);
                
              }
            
          

          this.setUpdatestateWithEvent(currentstate);
        }
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
            //히터가 켜진상태거나 온도가 점점 높아지고 있는 상태
            if (this.mState.State == KDDefine.AUTOStateType.AST_On || this.mState.State == KDDefine.AUTOStateType.AST_Down_Idle) {
              heaterstate = false;
              coollerstate = false;
            }
          } else if (currentstate == KDDefine.AUTOStateType.AST_Down_Idle) {
            if (this.mState.State == KDDefine.AUTOStateType.AST_Off || this.mState.State == KDDefine.AUTOStateType.AST_Up_Idle) {
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
            this.setUpdatestateWithEvent(currentstate);
            //this.mState.State = currentstate;
          }
        }

        break;
    }

    return opcmdlist;
  }

  getOperationsforcamera() {
    let oplist = [];
    //카메라는  촬영확인  1분 단위로 함수호출됨. 때문에 촬영해야할 시간(분) 이 되면 한장만 촬영
    if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_CAMERA_FJBOX) {
      let timeminnow = KDCommon.getCurrentTotalminute();
      let starttimemin = this.mConfig.STime / 60;
      let intervalmin = 1440 / Number(this.mConfig.DTValue);
      intervalmin = Number(intervalmin.toFixed());

      //      console.log("getOperationsforcamera ---------------intervalmin:  " + intervalmin +" starttimemin:" + starttimemin + " timeminnow:"+ timeminnow);

      for (let i = 0; i <= 1440; i += intervalmin) {
        let timestep = Number(starttimemin + i);
        timestep = timestep >= 1440 ? timestep - 1440 : timestep;

        //      console.log("getOperationsforcamera i:"+ i +" -------timeminnow:  " + timeminnow + " timestep:" + timestep);

        if (timeminnow == timestep) {
          console.log("getOperationsforcamera ---------------timeminnow:  " + timeminnow + " timestep:" + timestep);
          oplist.push(this.mConfig.Actlist[0]);
          return oplist;
        }
      }
    }

    return oplist;
  }

  //자동제어 상태를 업데이트하고 상태변경이 되면 이벤트를 생성해서 리턴한다.
  setUpdatestateWithEvent(newautostate) {
    this.NewEvent = null;
    if (this.mState.State != newautostate) {
      //console.log("setUpdatestateWithEvent lid: " + this.mConfig.Lid + "  ---------------old:  " + this.mState.State + " new: " + newautostate);

      //상태가 유지상태일경우 이벤트 발생안함
      if (newautostate == KDDefine.AUTOStateType.AST_Up_Idle || newautostate == KDDefine.AUTOStateType.AST_Down_Idle || newautostate == KDDefine.AUTOStateType.AST_IDLE) {
      } else {
        if (this.IsPWMcontrol == true && this.mState.State == KDDefine.AUTOStateType.AST_IDLE && newautostate == KDDefine.AUTOStateType.AST_On) {
          //관수제어시 PWM 주기적 제어일경우 이벤트 계속발생되지 않도록
        } else {
          this.NewEvent = SystemEvent.createAutoControlEvent(this.mConfig.Uid, newautostate);
        }
      }
      this.mState.State = newautostate;
    }
    return this.NewEvent;
  }

  //자동제어 시간이 끝날경우 필요한 설정
  setdaycontroltimeover() {
    //제어 변수들 초기화
    this.PWMonoffstate = false;
    this.PWMLasttoltalsec = 0;
    this.OnSecTime = 0;

    //console.log("-getOperationsByControl ---------------AST_Off_finish  " );
  }

  //자동제어 조건을 확인하고 변경이 되면 구동명령어 목록을 리턴한다.
  getOperationsByControl(msensors, mactuators) {
    let oplist = [];

    let currentstate = KDDefine.AUTOStateType.AST_IDLE;
    let timesecnow = KDCommon.getCurrentTotalsec();

    console.log("-this.Name : " + this.mConfig.Name+ ", ---------------timesecnow :   "+timesecnow +",currentstate :"+currentstate );

   // console.log("getOperationsByControl  Cat: " + this.mConfig.Cat);


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
        currentstate = this.getStateBySensorcondition(msensors, timesecnow);
      }
    } else {
      //기본조건 안맞음 모두  off
      this.setdaycontroltimeover();
      currentstate = KDDefine.AUTOStateType.AST_Off_finish;
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
