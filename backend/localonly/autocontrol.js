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
    this.isPHon = false;
    this.isECon = false;

    //pid control
    this.previousTime=KDCommon.getCurrentTotalsec();
    this.lastError=0;
    this.cumError=0;
    this.PIDPercent=50;
    this.PIDRunningsec=1800; //PID 구동시간 습도 펌프 구동하기 위해 10분마다 한번씩 구동
    this.ispidchange=false; //pid 제어 값이 변경되면 값을 전달되도록 


    
    this.kpv=AutoControl.checkpidparam (this.mConfig.Params[0]);
    this.kiv= AutoControl.checkpidparam(this.mConfig.Params[1]);
    this.kdv= AutoControl.checkpidparam(this.mConfig.Params[2]);


    this.cumerrormax =100;
    this.cumerrormin =-100;

    if(this.kiv >0 )
    {
      this.cumerrormax = (100.0/this.kiv);      
      this.cumerrormin = (-1.0*(100.0/this.kiv));
    }


      

      



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
    //console.log("-this.mConfig.Enb: "+this.mConfig.Enb + "UID: " + this.mConfig.Uid );

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
    if (isonstate == null) {
      curstate = KDDefine.AUTOStateType.AST_IDLE;
    } else if (this.IsPWMcontrol === false) {
      if (isonstate == true) {
        curstate = KDDefine.AUTOStateType.AST_On;
      } else {
        curstate = KDDefine.AUTOStateType.AST_Off;
      }
    } else {
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
          if (daytotalsec > Number(this.PWMLasttoltalsec) + Number(this.mConfig.DOffTime)) {
            this.PWMLasttoltalsec = daytotalsec;
            this.PWMonoffstate = true;
            //on 시간일때만 켜기 명령어 보냄  off 는 장비에서 알아서 off됨 ( timed on 방식이므로)
            console.log("-is pwmcontrolbysenor on : " + daytotalsec + " ,OSecTime : " + this.OnSecTime);
            curstate = KDDefine.AUTOStateType.AST_On;
          }
        } else {
          if (daytotalsec > Number(this.PWMLasttoltalsec) + Number(this.mConfig.DOnTime)) {
            this.PWMLasttoltalsec = daytotalsec;
            this.PWMonoffstate = false;
            console.log("-is pwcontrolbysensor off : " + daytotalsec);
          }
        }
      }
    }

    return curstate;
  }

  coputePIDTemperature(inputvalue, setvalue)
  {
      
        let currentTime = KDCommon.getCurrentTotalsec();                //get current time
        //console.log("coputePIDTemperature this.previousTime : " + this.previousTime +" currentTime:" +currentTime  + " kp:" + this.kpv + ",ki: "+ this.kiv+ ",kd: "+ this.kdv) ;


        let elapsedTime = (currentTime - this.previousTime);        //compute time elapsed from previous computation

        this.ispidchange=false;
        if(elapsedTime <=0)
        {
          this.previousTime = currentTime;                        //remember current time
          return 0;
        }
        
        this.PIDRunningsec+=elapsedTime;


        let error = setvalue - inputvalue;                                // determine error
        this.cumError += error * elapsedTime;                // compute integral
        let rateError = (error - this.lastError)/elapsedTime;   // compute derivative
 
        let out = this.kpv*error + this.kiv*this.cumError + this.kdv*rateError;                //PID output               

       // console.log("error : " + error +" cumerrormax:" +this.cumerrormax  + " this.cumError: " + this.cumError + ",this.lastError : "+this.lastError ) ;

        if(this.cumError <this.cumerrormin)
        {
          this.cumError=this.cumerrormin;
        }
        if(this.cumError >this.cumerrormax)
        {
          this.cumError=this.cumerrormax;
        }

 
        this.lastError = error;                                //remember current error
        this.previousTime = currentTime;                        //remember current time
 
        if(out >100)
        {
          out=100;
        }
        if(out <-100)
        {
          out=-100;
        }
        
        let outp = (out+100)/2;

        //습도 가습펌프 구동하기 위해 ispidchange true 만듬 
        if((this.PIDPercent != outp) ||  this.PIDRunningsec >1800)
        {
          this.PIDPercent = outp;
          this.ispidchange=true;

          //1보다 작으면 1로 설정  1로 지정되어있으면 펌웨어에서 히터 끄는 조건을 확인함
          //0은 off 조건임   1로 유지된다는 것은 온도를 계속낮추고 싶다는 상태인데  1시간가량 유지되면 히터끔.
          //100값이 계속 유지되는 경우는 온도를 계속 높이고 싶다는 상태인데 1시간가량 유지되면 컴프레셔 끔
          if(this.PIDPercent  <=1)
          {
            this.PIDPercent =1;
          }
          if(this.PIDPercent  >99)
          {
            this.PIDPercent =100;
          }


        }
        

      //  console.log("coputePIDTemperture percent : " + this.PIDPercent + " this.ispidchange:" +this.ispidchange);
        //console.log("coputePIDTemperture out : " + out +" elapsedTime:" +elapsedTime + " this.cumError : " + this.cumError + " this.lastError : "+ this.lastError );
        return this.PIDPercent;                         
  }

  static checkpidparam(pv)
  {
    let pvalue=Number(pv);
    if(pv <=0)
    {
      pvalue=0;
    }
    else if(pv >10)
    {
      pvalue=10;
    }

    return pvalue;

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

    //PID습도제어 
    if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_PID_HEATER_HUMIDITY_FOR_FJBOX) {
    

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
        console.log("getStateBySensorcondtion no sensor : " + this.mConfig.Senlist[0]);
        return KDDefine.AUTOStateType.AST_ERROR;
      } else {
        //const daytotalsec = KDCommon.getCurrentTotalsec();

        
        let targetvalue;
        if (this.mConfig.AType == KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY || AutoControlUtil.IsIncludeTime(this.mConfig.STime, this.mConfig.ETime, daytotalsec) == true) {
          targetvalue = Number(this.mConfig.DTValue);
        } else {
          targetvalue = Number(this.mConfig.NTValue);
        }
        
        //console.log("ACT_PID_HEATER_HUMIDIT_FOR_FJBOX currsensor:" + currsensor.value + " targetvalue : " + targetvalue );

        


        this.coputePIDTemperature(currsensor.value,targetvalue);
        return KDDefine.AUTOStateType.AST_On;

      }



    }

    //PID온도제어 
    else if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_PID_TEMP_CONTROL_FOR_FJBOX) {
    

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
        console.log("getStateBySensorcondtion no sensor : " + this.mConfig.Senlist[0]);
        return KDDefine.AUTOStateType.AST_ERROR;
      } else {
        //const daytotalsec = KDCommon.getCurrentTotalsec();

        
        let targetvalue;
        if (this.mConfig.AType == KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY || AutoControlUtil.IsIncludeTime(this.mConfig.STime, this.mConfig.ETime, daytotalsec) == true) {
          targetvalue = Number(this.mConfig.DTValue);
        } else {
          targetvalue = Number(this.mConfig.NTValue);
        }
        
        //console.log("ACT_PID_TEMP_CONTRO_FOR_FJBOX currsensor:" + currsensor.value + " targetvalue : " + targetvalue );

        


        this.coputePIDTemperature(currsensor.value,targetvalue);
        return KDDefine.AUTOStateType.AST_On;

      }



    }

    //환기제어 별도로 왜냐면 센서가 여려개일수 있고 이레적으로  PWM 제어임
    else if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX) {
      let co2sensor = null;
      let humiditysensor = null;

      //  console.log("ACT_AIRCIRC_CO2_HUMIDTY_FOR_FJBOX daytotalsec : " +daytotalsec);

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
        // console.log("ACT_AIRCIRC_CO2_HUMIDIY_FOR_FJBOX humiditysensor : " + humiditysensor);
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

     
      currentstate = this.pwmcontrolbysensor(isonstate);

      // return currentstate;
    } else if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_NUTRIENT_SOL3_FOR_FJBOX) {
      let phsensor = null;
      let ecsensor = null;

      //  console.log("ACT_NUTRIENT_SOL3_FOR_FJBX daytotalsec : " +daytotalsec);

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
        //console.log("getStateBySensorcondtion no sensor phsensor ecsensor: " + this.mConfig.Senlist[0]);
        return KDDefine.AUTOStateType.AST_ERROR;
      } else {
        // console.log("ACT_AIRCIRC_CO2_HUMIDIY_FOR_FJBOX humiditysensor : " + humiditysensor);
      }

      let phtargetvalue = Number(this.mConfig.DTValue);
      let ectargetvalue = Number(this.mConfig.NTValue);
      let isonstate = false;
      this.isPHon = false;
      this.isECon = false;
      //ph가이 높아지면 환기
      if (phsensor != null) {
        if (phsensor.value > phtargetvalue) {
          isonstate = true;
          this.isPHon = true;
        }
      }
      //ec 센서값이 낮아지면 환기
      if (ecsensor != null) {
        if (ecsensor.value < ectargetvalue) {
          isonstate = true;
          this.isECon = true;
        }
      }

      console.log("getStateBySensorcondtion phtargetvalue:" + phtargetvalue + " ectargetvalue : " + ectargetvalue);
      console.log("getStateBySensorcondtion phsensor.value:" + phsensor.value + " ecsensor.value : " + ecsensor.value);
      console.log("getStateBySensorcondtion this.isPHon:" + this.isPHon + " this.isECon : " + this.isECon);

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
        console.log("getStateBySensorcondtion no sensor : " + this.mConfig.Senlist[0]);
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
         // console.log("isonstate:" + isonstate + ",currentstate:" + currentstate);
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
      case KDDefine.AUTOCategory.ACT_HEATER_HUMIDITY_FOR_FJBOX:
      case KDDefine.AUTOCategory.ACT_NUTRIENT_SOL3_FOR_FJBOX:
      case KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX:
      case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
      case KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX:
      case KDDefine.AUTOCategory.ACT_PID_TEMP_CONTROL_FOR_FJBOX:
        case KDDefine.AUTOCategory.ACT_PID_HEATER_HUMIDITY_FOR_FJBOX:
        
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
              console.log("-getOperationsBySpcify ACT_AIRCIRC_CO2_HUMDITY_FOR_FJBOX  currentstate: " + currentstate + " OnSecTime:" + this.OnSecTime);
              opcmdlist.push(opcmd);
            }
          }
        }
        //현재상태 갱신
        this.setUpdatestateWithEvent(currentstate);
        //this.mState.State = currentstate;

        break;

      case KDDefine.AUTOCategory.ACT_HEATER_HUMIDITY_FOR_FJBOX:
        {
          let heaterd = null;
          let pumpd = null;

          for (const mactid of this.mConfig.Actlist) {
            let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
            if (actd != null) {
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_HUMIDIFLER) {
                heaterd = actd;
              }
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_PUMP) {
                pumpd = actd;
              }
            }
          }

          let onoffstate = null;
          if (currentstate == KDDefine.AUTOStateType.AST_On) {
            onoffstate = true;
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
            onoffstate = false;
          }

          //console.log("-ACT_HEATER_HUMIDITY_FOR_FJBOX heaterd: " + heaterd + " pumpd:" + pumpd + " onoffstate:" + onoffstate);

          if (onoffstate != null && heaterd != null && pumpd != null) {
            let opcmda = new ActuatorOperation(heaterd.UniqID, onoffstate, this.OnSecTime);
            // 펌프는
            let opcmdb = new ActuatorOperation(pumpd.UniqID, onoffstate, 100);

            opcmdlist.push(opcmda);
            opcmdlist.push(opcmdb);
          }

          this.setUpdatestateWithEvent(currentstate);
        }
        break;

      case KDDefine.AUTOCategory.ACT_NUTRIENT_SOL3_FOR_FJBOX:
        {
          let solA = null;
          let solB = null;
          let solC = null;
          let pumpN = null;

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
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_AG_PUMP) {
                pumpN = actd;
              }
              

            }
          }

          let onoffstate = null;
          if (currentstate == KDDefine.AUTOStateType.AST_On) {
            onoffstate = true;
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
            onoffstate = false;
          }

          // console.log("-getOperationsBySpcify solA: " + solA + " solB:" + solB + " solC:"+solC);

          if (onoffstate != null) {
            if (onoffstate === true) {

              if (this.isECon == true && solA != null && solB != null) {
                let opcmda = new ActuatorOperation(solA.UniqID, onoffstate, this.OnSecTime);
                let opcmdb = new ActuatorOperation(solB.UniqID, onoffstate, this.OnSecTime);
                opcmdlist.push(opcmda);
                opcmdlist.push(opcmdb);
              }
              if (this.isPHon == true && solC != null) {
                let opcmdc = new ActuatorOperation(solC.UniqID, onoffstate, this.OnSecTime);
                opcmdlist.push(opcmdc);
              }

              //양액공급이면 교반펌프를 60초가 돌림
              if(pumpN!=null)
              {
                let opcmdpump = new ActuatorOperation(pumpN.UniqID, onoffstate, 60);
                opcmdlist.push(opcmdpump);
              }

            } else if (solA != null && solB != null && solC != null) {
              let opcmda = new ActuatorOperation(solA.UniqID, onoffstate, this.OnSecTime);
              let opcmdb = new ActuatorOperation(solB.UniqID, onoffstate, this.OnSecTime);
              let opcmdc = new ActuatorOperation(solC.UniqID, onoffstate, this.OnSecTime);
              opcmdlist.push(opcmda);
              opcmdlist.push(opcmdb);
              opcmdlist.push(opcmdc);
            }

            //  console.log("-getOperationsBySpcify ACT_NUTRIENT_SOL3_FOR_FJBX  currentstate: " + currentstate + " OnSecTime:" + this.OnSecTime);
          }

          this.setUpdatestateWithEvent(currentstate);
        }
        break;

        case KDDefine.AUTOCategory.ACT_PID_HEATER_HUMIDITY_FOR_FJBOX:
          {
            let heaterd = null;
            let pumpd = null;

            for (const mactid of this.mConfig.Actlist) {
              let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
              if (actd != null) {
                if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_HUMIDIFLER) {
                  heaterd = actd;
                }
                if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_PUMP) {
                  pumpd = actd;
                }
              }
            }


            //console.log("-getOperationsBySpcify ACT_PID_TEMP_CONTRO_FOR_FJBOX  currentstate: " + currentstate + " OnSecTime:" + this.OnSecTime);


            if (heaterd != null) {
              let onoffdstate = null;
              let pwmdemming = 0;
              
              if (currentstate == KDDefine.AUTOStateType.AST_On) {
                onoffdstate = true;
                //console.log("-getOperationsBySpcify  this.PIDPercent : " +this.PIDPercent);
                // 켜짐시간값을 켜짐시간에 합쳐서 전달
                pwmdemming = ActuatorOperation.Gettimewithparam(this.OnSecTime, this.PIDPercent);
                
              } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
                onoffdstate = false;
              }
    
              if (onoffdstate != null) {
           //     console.log("-getOperationsBySpcify    pwmdemming:" + pwmdemming + "UID : "+heaterd.UniqID + " runsec:"+this.PIDRunningsec);
                let opcmd = new ActuatorOperation(heaterd.UniqID, onoffdstate, pwmdemming);

                 // 펌프는 1분마다 10초동작 물공급하면 히터가 식어서 습도맞추기 힘듬
                 // 20230717 1시간마다 5분씩 공급으로 변경
                 if(this.PIDRunningsec > 1800)
                 {
                  let opcmdb = new ActuatorOperation(pumpd.UniqID, true, 300);
                  this.PIDRunningsec =0;
                  opcmdlist.push(opcmdb);

                 }
                



                opcmdlist.push(opcmd);
                this.setUpdatestateWithEvent(currentstate);
                //this.mState.State = currentstate;
              }
            }


          }
          break;


        case KDDefine.AUTOCategory.ACT_PID_TEMP_CONTROL_FOR_FJBOX:
          {
            let tcontroldev = null;
            for (const mactid of this.mConfig.Actlist) {
              let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
              if (actd != null) {
                if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_TEMP_CONTOLLER) {
                  tcontroldev = actd;
                }
              
              }
            }


            //console.log("-getOperationsBySpcify ACT_PID_TEMP_CONTRO_FOR_FJBOX  currentstate: " + currentstate + " OnSecTime:" + this.OnSecTime);


            if (tcontroldev != null) {
              let ledstate = null;
              let pwmdemming = 0;
              
              if (currentstate == KDDefine.AUTOStateType.AST_On) {
                ledstate = true;
                //console.log("-getOperationsBySpcify  this.PIDPercent : " +this.PIDPercent);
                // 디밍값을 켜짐시간에 합쳐서 전달
                pwmdemming = ActuatorOperation.Gettimewithparam(this.OnSecTime, this.PIDPercent);
                
              } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
                ledstate = false;
              }
    
              if (ledstate != null) {
                console.log("-getOperationsBySpcify    pwmdemming:" + pwmdemming + "UID : "+tcontroldev.UniqID);
                let opcmd = new ActuatorOperation(tcontroldev.UniqID, ledstate, pwmdemming);
                opcmdlist.push(opcmd);
                this.setUpdatestateWithEvent(currentstate);
                //this.mState.State = currentstate;
              }
            }


          }
          break;

      case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
        let heaterdev = null;
        let coollerdev = null;

        //console.log("-getOperationsBySpcify ACT_HEAT_COL_FOR_FJBOX  currentstate: " + currentstate + " old State:" + this.mState.State);

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
      let takecount=Number(this.mConfig.DTValue);
      if(takecount <1 || takecount>8)
      {
        takecount=2;
      }

      let intervalmin = 1440 / Number(takecount);
      intervalmin = Number(intervalmin.toFixed());

      //      console.log("getOperationsforcamera ---------------intervalmin:  " + intervalmin +" starttimemin:" + starttimemin + " timeminnow:"+ timeminnow);

      for (let i = 0; i <= 1440; i += intervalmin) {
        let timestep = Number(starttimemin + i);
        let timestep_af_3min = Number(timestep+3);

        timestep = timestep >= 1440 ? timestep - 1440 : timestep;
        timestep_af_3min= timestep_af_3min >= 1440 ? timestep_af_3min - 1440 : timestep_af_3min;
        //      console.log("getOperationsforcamera i:"+ i +" -------timeminnow:  " + timeminnow + " timestep:" + timestep);

        if (timeminnow == timestep) {
          console.log("getOperationsforcamera ---------------timeminnow:  " + timeminnow + " timestep:" + timestep);
          oplist.push(this.mConfig.Actlist[0]);
          return oplist;
        }

        if (timeminnow == timestep_af_3min && this.mConfig.Actlist[1] !=null) {
          console.log("getOperationsforcamera ---------------timestep_af_3min:  " + timestep_af_3min + " actuator:" + this.mConfig.Actlist[1] );

          oplist.push(this.mConfig.Actlist[1]);
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

    //console.log("-this.Name : " + this.mConfig.Name+ ", ---------------timesecnow :   "+timesecnow +",currentstate :"+currentstate );

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
    //console.log("-11this.Name : " + this.mConfig.Name+ ", ---------------timesecnow :   "+timesecnow +",currentstate :"+currentstate );

    


    // 먼가 상태가 변경되어 구동기에 명령어를 주어야함.
    if (this.mState.ischangestatecheck(currentstate) == true  ||  this.ispidchange ==true) {
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
