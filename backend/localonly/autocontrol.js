//자동제어
const ActuatorOperation = require("../../frontend/myappf/src/commonjs/actuatoroperation");
const AutoControlStatus = require("../../frontend/myappf/src/commonjs/autocontrolstatus");
const AutoControlconfig = require("../../frontend/myappf/src/commonjs/autocontrolconfig");
const AutoControlUtil = require("../../frontend/myappf/src/commonjs/autocontrolutil");
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("../kdcommon");
const SystemEvent = require("./systemevent");

module.exports = class AutoControl {
  constructor(mconfig , timezoneoffsetmsec) {
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

    //20240214 수출함으로 타임존 적용
    this.mTimezoneoffsetMillisec= Number(timezoneoffsetmsec);
    console.log("mTimezoneoffsetMillisec : " + this.mTimezoneoffsetMillisec);



    //pid control
    this.previousTime=KDCommon.getCurrentTotalsec(this.mTimezoneoffsetMillisec);
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


    this.waterchagestatus = 0; //물교체 상태 0:대기 1:배수 2:배수종료 3: 급수  4: 급수종료  5: 완료 대기 -> 0: 배수 대기 



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
  getStateByTimercondition(msensors, daytotalsec) {
    let offsectime;
    let onsectime;

    //console.log("-getStateByTimerconditon daytotalsec : " + daytotalsec  + " mConfig Name: "+this.mConfig.Name);

     //물공급시 수위감지센서 사용할경우 
     
     if (this.mConfig.Cat === KDDefine.AUTOCategory.ATC_WATER) {
      let watersensor = null;

      for (const ms of msensors) {
       
        if(ms.Sensortype == KDDefine.KDSensorTypeEnum.SUT_FIRE_DETECTOR)
        {
          watersensor = ms;
        }
      }
      if( this.mConfig.Params[0] == true && watersensor !=null)
        {
         // console.log("ATC_WATER rain:" + watersensor.value  );
          if(watersensor.value  >=1)
          {
            //1이면 물이 있는경우임.
            
          }
          else{

            //물이 없으면 무조건 off
            return KDDefine.AUTOStateType.AST_Off;
          }
        }

    }



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
      const daytotalsec = KDCommon.getCurrentTotalsec(this.mTimezoneoffsetMillisec);

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
      
        let currentTime = KDCommon.getCurrentTotalsec(this.mTimezoneoffsetMillisec);                //get current time
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






  getStateByTimerSensorconditionforwatertank(msensors, daytotalsec) {
    let currentstate = KDDefine.AUTOStateType.AST_IDLE;
    
 
 

    // 리무 챔버 물 공급 시 수위 감지 센서 사용할 경우
    if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_PARTIAL_WATER_CHANGE_FOR_WATERTANK) {
        let watersensor = null;
        let temperaturesensor = null;
        let tempwsensor = null;
        let temppesensor = null;
        let daytrycount = Number(this.mConfig.Params[0]); // 하루 배수/급수 횟수
        let starttime = Number(this.mConfig.Params[1]); // 첫 시작 시간 (초 단위)
        let drainTime = Number(this.mConfig.Params[2]); // 배수 지속 시간
        let supplyTime = Number(this.mConfig.Params[3]); // 급수 지속 시간
        let drainvalue = Number(this.mConfig.Params[4]); // 배수 수위
        let supplyvalue = Number(this.mConfig.Params[5]); // 급수 수위
        
     //   let shouldDrain = false;
    //    let shouldSupply = false;
        let iswaterchange = false; // 물 교체 여부

        // 수위 센서 찾기
        for (const ms of msensors) {
            if (ms.Sensortype === KDDefine.KDSensorTypeEnum.SUT_WATER_MM) {
                watersensor = ms;
            }
            if (ms.Sensortype === KDDefine.KDSensorTypeEnum.SUT_WTemperature) {
              tempwsensor = ms;
          }
          if (ms.Sensortype === KDDefine.KDSensorTypeEnum.SUT_PE300_TEMP) {
            temppesensor = ms;
        }
        }

        // 수온 센서가 있으면 수온 센서로 대체 (수온 센서가 우선) 다음 양액온도센서 
        if(tempwsensor != null)
        {
          temperaturesensor = tempwsensor;
        }
        else if(temppesensor != null)
        {
          temperaturesensor = temppesensor;
        }


        // 환수 회수가 0이면 환수 안함.
        if( daytrycount > 0)
        {

          // 24시간을 daytrycount 횟수만큼 나누어 배수 → 급수 스케줄 생성
          let interval = (24 * 60 * 60) / daytrycount; // 각 주기 간격 (초 단위)
       
          let isdrainsupplytime = false; // 배수 , 급수 시간인지 여부

          for (let i = 0; i < daytrycount; i++) {
              let cycleStart = starttime + i * interval;
              let drainEndTime = cycleStart + drainTime; // 배수 종료 시간
              let supplyStartTime = drainEndTime; // 급수 시작 시간
              let supplyEndTime = supplyStartTime + supplyTime; // 급수 종료 시간


              //급수 시간임
              if (daytotalsec >= cycleStart && daytotalsec < supplyEndTime  ) 
              {
                isdrainsupplytime = true;

                if(this.waterchagestatus == 0)
                {
                  if (daytotalsec >= cycleStart)
                  {
                  this.waterchagestatus = 1; //배수
                  }
                }
                else if(this.waterchagestatus == 1)
                {
                  //배수중이고 제한시간이 오버 됬으면 배수 종료
                  if(daytotalsec >  drainEndTime)
                  {
                    this.waterchagestatus = 2; //배수종료
                  }
                  else{
                    //배수중이고 수위에 제한범위아래로 내려가면 정지
                  if (watersensor !== null) {
                    if (watersensor.value <= drainvalue)
                    {
                      this.waterchagestatus = 2;
                    }
                  }
                }
                  
                }
                else if(this.waterchagestatus == 2)
                {
                  //배수 종료후 급수 바로 시작
                  
                   this.waterchagestatus = 3; //급수
                  
                }
                else if(this.waterchagestatus == 3)
                {
                  //급수중이고 제한시간이 오버 됬으면 급수 종료
                  if(daytotalsec >  supplyEndTime)
                  {
                    this.waterchagestatus = 4; //급수종료
                  }
                  else{
                    //급수중이고 수위에 제한범위 이상으로 올라가면 정지
                    if (watersensor !== null) {
                      if (watersensor.value >= supplyvalue)
                      {
                        this.waterchagestatus = 4;

                      }
                    }
                  }
                }
                else if(this.waterchagestatus == 4)
                {
                  //급수종료후 대기
                  this.waterchagestatus = 5; //완료 대기
                }
                


                break;
              }
            }

            //  급수가 완료됬고  급수시간범위가 아니면  다시 대기
            if(this.waterchagestatus == 5 && isdrainsupplytime == false)
              {
                this.waterchagestatus = 0;
              }



            if (this.waterchagestatus == 1) {
              currentstate = KDDefine.AUTOStateType.AST_Drain_water;
              iswaterchange=true;

            }
            else if (this.waterchagestatus == 3 ) {
              currentstate = KDDefine.AUTOStateType.AST_Pupmping_water;
              iswaterchange=true;
            }
            else if (this.waterchagestatus == 2 || this.waterchagestatus == 4 ) {
              currentstate = KDDefine.AUTOStateType.AST_Off;
              iswaterchange=true;
            }
        
        

      }

        //물 교체시간이 아니면 온도조절 구동
        if(iswaterchange  == false)
        {
          

          if (temperaturesensor !== null) {

            let targetvalue ;
            let upvalue;
            let downvalue;

            if (AutoControlUtil.IsIncludeTime(this.mConfig.STime, this.mConfig.ETime, daytotalsec) == true) {
              targetvalue = Number(this.mConfig.DTValue);
            } else {
              targetvalue = Number(this.mConfig.NTValue);
            }

            upvalue = targetvalue + Number(this.mConfig.BValue);
            downvalue = targetvalue - Number(this.mConfig.BValue);
    
            //온도가 낮아지면 닫기
            if (temperaturesensor.value >= upvalue) {
              currentstate = KDDefine.AUTOStateType.AST_On;
            }
    
            if (temperaturesensor.value <= downvalue) {
              currentstate = KDDefine.AUTOStateType.AST_Off;

          }

        }
      }

      if(currentstate === KDDefine.AUTOStateType.AST_Drain_water )
      {
        this.OnSecTime = drainTime;
      }
      else if(currentstate === KDDefine.AUTOStateType.AST_Pupmping_water )
      {
        this.OnSecTime = supplyTime;
      }
      else if(currentstate === KDDefine.AUTOStateType.AST_On )
      {
        this.OnSecTime = this.mConfig.DOnTime; 
      }
  





        console.log("ACT_WATER_change " +
            "supplyvalue:" + supplyvalue +
            " drainvalue: " + drainvalue +
            " drainTime: " + drainTime +
            " supplyTime: " + supplyTime +
            "waterchagestatus: " + this.waterchagestatus +
            " currentstate: " + currentstate);
    }

    return currentstate;
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

    
    //보온덥개 제어 미니온실용
    if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_WINDOW_FOR_MINIHOUSE) {
      let temperaturesensor = null;
      let rainsensor = null;

      for (const ms of msensors) {
        if (ms.UniqID == this.mConfig.Senlist[0]) {
          temperaturesensor = ms;
        }
        if(ms.Sensortype == KDDefine.KDSensorTypeEnum.SUT_RAINDETECTOR)
        {
          rainsensor = ms;
        }
      }

      //console.log("ACT_WINDOW_FOR_MINIHOUSE rain check:" + this.mConfig.Params[0]+ " rainsensor:"+rainsensor);

      if (temperaturesensor == null) {
        return KDDefine.AUTOStateType.AST_ERROR;
      } 

      let upvalue;
        let downvalue;
        let targetvalue;
        targetvalue = Number(this.mConfig.DTValue);

        
        upvalue = targetvalue + Number(this.mConfig.BValue);
        downvalue = targetvalue - Number(this.mConfig.BValue);

      
      

      //온도가 낮아지면 닫기
      
        if (temperaturesensor.value >= upvalue) {
          currentstate = KDDefine.AUTOStateType.AST_Open;
        }

        if (temperaturesensor.value <= downvalue) {
          currentstate = KDDefine.AUTOStateType.AST_Close;
        }

        

        if( this.mConfig.Params[0] == true && rainsensor !=null)
        {
          console.log("ACT_WINDOW_FOR_MINIHOUSE rain:" + rainsensor.value  );
          if(rainsensor.value  >=1)
          {
            currentstate = KDDefine.AUTOStateType.AST_Close;
          }
        }
      
      this.OnSecTime = Number(this.mConfig.DOnTime);
       
      console.log("ACT_WINDOW_FOR_MINIHOUSE currsensor:" + temperaturesensor.value + " targetvalue : " + targetvalue  + " currentstate: " + currentstate);


      // return currentstate;
    }

    //보온덥개 제어 미니온실용
     else if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_SCREEN_FOR_MINIHOUSE) {
      let temperaturesensor = null;
      for (const ms of msensors) {
        if (ms.UniqID == this.mConfig.Senlist[0]) {
          temperaturesensor = ms;
        }
      }

      if (temperaturesensor == null) {
        return KDDefine.AUTOStateType.AST_ERROR;
      } 

      let upvalue;
        let downvalue;
        let targetvalue;
        targetvalue = Number(this.mConfig.DTValue);

        
        upvalue = targetvalue + Number(this.mConfig.BValue);
        downvalue = targetvalue - Number(this.mConfig.BValue);

      
      

      //온도가 낮아지면 닫기
      
        if (temperaturesensor.value <= downvalue) {
          currentstate = KDDefine.AUTOStateType.AST_Close;
        }

        if (temperaturesensor.value >= upvalue) {
          currentstate = KDDefine.AUTOStateType.AST_Open;
        }

      
      this.OnSecTime = Number(this.mConfig.DOnTime);
       
      console.log("ACT_SCREEN_FOR_MINIHOSE currsensor:" + temperaturesensor.value + " targetvalue : " + targetvalue  + " currentstate: " + currentstate);


      // return currentstate;
    }

    //PID습도제어 
    else if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_PID_HEATER_HUMIDITY_FOR_FJBOX) {
    

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
      case KDDefine.AUTOCategory.ACT_CHILLER_TEMP_CONTROL_FOR_WATERTANK:
      case KDDefine.AUTOCategory.ACT_PARTIAL_WATER_CHANGE_FOR_WATERTANK:
      case KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX:
      case KDDefine.AUTOCategory.ACT_PID_TEMP_CONTROL_FOR_FJBOX:
      case KDDefine.AUTOCategory.ACT_PID_HEATER_HUMIDITY_FOR_FJBOX:

      case KDDefine.AUTOCategory.ACT_SCREEN_FOR_MINIHOUSE:
      case KDDefine.AUTOCategory.ACT_WINDOW_FOR_MINIHOUSE:
        
        return true;
      default:
        return false;
    }
  }

  ///장비고정이고 특별히 제어되는것은 여기서
  getOperationsBySpecify(mactlist, currentstate) {
    let opcmdlist = [];

    switch (this.mConfig.Cat) {

      
      case KDDefine.AUTOCategory.ACT_WINDOW_FOR_MINIHOUSE:
        {
        let windowdev = null;
        
        for (const mactid of this.mConfig.Actlist) {
          let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
          if (actd != null) {
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_WINDOW) {
              let opcmdwindow = new ActuatorOperation(actd.UniqID, true, this.OnSecTime,currentstate);
              opcmdlist.push(opcmdwindow);
            }
            
          }
        }
        this.setUpdatestateWithEvent(currentstate);

       
      }

        break;
      
      case KDDefine.AUTOCategory.ACT_SCREEN_FOR_MINIHOUSE:
        let screendev = null;
        
        for (const mactid of this.mConfig.Actlist) {
          let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
          if (actd != null) {
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_SCREEN) {
              screendev = actd;
            }
            
          }
        }
        if (screendev != null) {
         
          console.log("-getOperationsBySpcify  screen : " + screendev.UniqID + " currentstate:" + currentstate);
          let opcmdwindow = new ActuatorOperation(screendev.UniqID, true, this.OnSecTime,currentstate);
           
          opcmdlist.push(opcmdwindow);
          this.setUpdatestateWithEvent(currentstate);

        }

        break;


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

          //console.log("-ACT_HEATER_HUMIDITY_OR_FJBOX heaterd: " + heaterd + " pumpd:" + pumpd + " onoffstate:" + onoffstate);

          if (onoffstate != null ) {

            if(heaterd != null )
              {
                let opcmda = new ActuatorOperation(heaterd.UniqID, onoffstate, this.OnSecTime);
                opcmdlist.push(opcmda);

              }
            
            // 펌프는
            if(pumpd != null)
              {
                let opcmdb = new ActuatorOperation(pumpd.UniqID, onoffstate, 100);    
                opcmdlist.push(opcmdb);
              }
            
            

            
            
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
        let airfandev = null; //내부 유동팬이 있다면  냉난방기가 작동할때 같이 켬

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
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_TEMP_CIRCULARFAN) {
              airfandev = actd;
            }

            
          }
        }

        if (coollerdev != null && heaterdev != null) {
          let heaterstate = null;
          let coollerstate = null;
          let airfanstate = false;
          if (currentstate == KDDefine.AUTOStateType.AST_On) {
            heaterstate = true;
            coollerstate = false;
            airfanstate=true;
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off) {
            heaterstate = false;
            coollerstate = true;
            airfanstate=true;
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
            if(airfandev !=null)
            {
              let opcmdarifan = new ActuatorOperation(airfandev.UniqID, airfanstate, this.OnSecTime);
              opcmdlist.push(opcmdarifan);
            }

            //현재상태 갱신
            this.setUpdatestateWithEvent(currentstate);
            //this.mState.State = currentstate;
          }
        }
        
        break;

        case KDDefine.AUTOCategory.ACT_CHILLER_TEMP_CONTROL_FOR_WATERTANK:
        let chiller = null;
        let waterpump = null;
        let valve_in_inner = null;
        let valve_in_extern = null;
        
        let valve_out_inner = null;
        let valve_out_extern = null;
        
        //console.log("-getOperationsBySpcify ACT_HEAT_COL_FOR_FJBOX  currentstate: " + currentstate + " old State:" + this.mState.State);

        for (const mactid of this.mConfig.Actlist) {
          let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);
          if (actd != null) {
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_TEMP_CHILLER) {
              chiller = actd;
            }
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_PUMP) {
              waterpump = actd;
            }
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_VALVE_IN_INNER) {
              valve_in_inner = actd;
            }
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_VALVE_IN_EXTERN) {
              valve_in_extern = actd;
            }
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_VALVE_OUT_INNER) {
              valve_out_inner = actd;
            }
            if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_VALVE_OUT_EXTERN) {
              valve_out_extern = actd;
            }


            
          }
        }

        if (chiller != null && waterpump != null && valve_in_inner != null && valve_in_extern != null && valve_out_inner != null && valve_out_extern != null) {
          
          let coollerstate = null;
          
          if (currentstate == KDDefine.AUTOStateType.AST_On) {
            coollerstate = true;
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off) {
            coollerstate = false;
          } else if (currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
            coollerstate = false;
          } 


          if (coollerstate != null) {
            console.log("-getOperationsBySpcify  chiller:" + chiller.UniqID + ",currentstate : " + currentstate + " , OTime : " + this.OnSecTime);

            
            let opcmdcooler = new ActuatorOperation(chiller.UniqID, coollerstate, this.OnSecTime);
            let opcmdpump = new ActuatorOperation(waterpump.UniqID, coollerstate, this.OnSecTime);

            let opcmdvv1 = new ActuatorOperation(valve_in_inner.UniqID, coollerstate, this.OnSecTime);
            let opcmdvv2 = new ActuatorOperation(valve_in_extern.UniqID, coollerstate, this.OnSecTime);
            let opcmdvv3 = new ActuatorOperation(valve_out_inner.UniqID, coollerstate, this.OnSecTime);
            let opcmdvv4 = new ActuatorOperation(valve_out_extern.UniqID, coollerstate, this.OnSecTime);

            // 칠러가 켜지면 솔밸브 내부 순환방향으로 변경 
            if(coollerstate == true)
            {
              opcmdvv2 = new ActuatorOperation(valve_in_extern.UniqID, false, this.OnSecTime);
              opcmdvv4 = new ActuatorOperation(valve_out_extern.UniqID, false, this.OnSecTime);
            }

            
            opcmdlist.push(opcmdcooler);
            opcmdlist.push(opcmdpump);
            opcmdlist.push(opcmdvv1);
            opcmdlist.push(opcmdvv2);
            opcmdlist.push(opcmdvv3);
            opcmdlist.push(opcmdvv4);


            //현재상태 갱신
            this.setUpdatestateWithEvent(currentstate);
            //this.mState.State = currentstate;
          }
        }
        
        break;

        case KDDefine.AUTOCategory.ACT_PARTIAL_WATER_CHANGE_FOR_WATERTANK:
          {
          let chiller = null;
          let waterpump = null;
          let valve_in_inner = null;
          let valve_in_extern = null;
          
          let valve_out_inner = null;
          let valve_out_extern = null;
          
          //console.log("-getOperationsBySpcify ACT_HEAT_COL_FOR_FJBOX  currentstate: " + currentstate + " old State:" + this.mState.State);
  
          for (const mactid of this.mConfig.Actlist) {
            let actd = AutoControlUtil.GetActuatorbyUid(mactlist, mactid);

            if (actd != null) {
            
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_TEMP_CHILLER) {
                chiller = actd;
              }
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_PUMP) {
                waterpump = actd;
              }
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_VALVE_IN_INNER) {
                valve_in_inner = actd;
              }
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_VALVE_IN_EXTERN) {
                valve_in_extern = actd;
              }
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_VALVE_OUT_INNER) {
                valve_out_inner = actd;
              }
              if (actd.Basicinfo.DevType == KDDefine.OutDeviceTypeEnum.ODT_VALVE_OUT_EXTERN) {
                valve_out_extern = actd;
              }
  
  
              
            }
          }
  
          if (chiller != null && waterpump != null && valve_in_inner != null && valve_in_extern != null && valve_out_inner != null && valve_out_extern != null) {
            
            let coollerstate = null;
            
            if (currentstate == KDDefine.AUTOStateType.AST_On ||  currentstate == KDDefine.AUTOStateType.AST_Drain_water || currentstate == KDDefine.AUTOStateType.AST_Pupmping_water) {
              coollerstate = currentstate;
            } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_Off_finish || currentstate == KDDefine.AUTOStateType.AST_ERROR) {
              coollerstate = KDDefine.AUTOStateType.AST_Off;
            } 
  
  
            if (coollerstate != null) {
              console.log("-getOperationsBySpcify  chiller:" + chiller.UniqID + ",currentstate : " + currentstate + " , OTime : " + this.OnSecTime);
  
  
              //기본 모두 off
              let opcmdcooler = new ActuatorOperation(chiller.UniqID, false, 0);
              let opcmdpump = new ActuatorOperation(waterpump.UniqID, false, 0);
              let opcmdvv1 = new ActuatorOperation(valve_in_inner.UniqID, false, 0);
              let opcmdvv2 = new ActuatorOperation(valve_in_extern.UniqID, false, 0);
              let opcmdvv3 = new ActuatorOperation(valve_out_inner.UniqID, false, 0);
              let opcmdvv4 = new ActuatorOperation(valve_out_extern.UniqID, false, 0);
  
              
              // 온도제어 칠러동작  켜지면 솔밸브 내부 순환방향으로 변경 
              if(coollerstate == KDDefine.AUTOStateType.AST_On)
              {
                opcmdcooler = new ActuatorOperation(chiller.UniqID,true, this.OnSecTime);
                opcmdpump = new ActuatorOperation(waterpump.UniqID, true, this.OnSecTime);
                opcmdvv1 = new ActuatorOperation(valve_in_inner.UniqID, true, this.OnSecTime);
                opcmdvv3 = new ActuatorOperation(valve_out_inner.UniqID, true, this.OnSecTime);

             
               

              }
              else if(coollerstate == KDDefine.AUTOStateType.AST_Drain_water)
              {
                //배수 
                
                opcmdpump = new ActuatorOperation(waterpump.UniqID, true, this.OnSecTime);
                opcmdvv1 = new ActuatorOperation(valve_in_inner.UniqID, true, this.OnSecTime);
                opcmdvv4 = new ActuatorOperation(valve_out_extern.UniqID, true, this.OnSecTime);
              }
              else if(coollerstate == KDDefine.AUTOStateType.AST_Pupmping_water)
                {
                  //급수
                  
                  opcmdpump = new ActuatorOperation(waterpump.UniqID, true, this.OnSecTime);
                  opcmdvv2 = new ActuatorOperation(valve_in_extern.UniqID, true, this.OnSecTime);
                  opcmdvv3 = new ActuatorOperation(valve_out_inner.UniqID, true, this.OnSecTime);
                }


        
              
              opcmdlist.push(opcmdcooler);
              opcmdlist.push(opcmdpump);
              opcmdlist.push(opcmdvv1);
              opcmdlist.push(opcmdvv2);
              opcmdlist.push(opcmdvv3);
              opcmdlist.push(opcmdvv4);
  
  
              //현재상태 갱신
              this.setUpdatestateWithEvent(currentstate);
              //this.mState.State = currentstate;
            }
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
      let timeminnow = KDCommon.getCurrentTotalminute(this.mTimezoneoffsetMillisec);
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
      //console.log("setUpdatestateithEvent lid: " + this.mConfig.Lid + "  ---------------old:  " + this.mState.State + " new: " + newautostate);

      //상태가 유지상태일경우 이벤트 발생안함
      if (newautostate == KDDefine.AUTOStateType.AST_Up_Idle || newautostate == KDDefine.AUTOStateType.AST_Down_Idle || newautostate == KDDefine.AUTOStateType.AST_IDLE) {
      } else {
        if (this.IsPWMcontrol == true && this.mState.State == KDDefine.AUTOStateType.AST_IDLE && newautostate == KDDefine.AUTOStateType.AST_On) {
          //관수제어시 PWM 주기적 제어일경우 이벤트 계속발생되지 않도록
        } else {
          this.NewEvent = SystemEvent.createAutoControlEvent(KDCommon.getCurrentDate(this.mTimezoneoffsetMillisec,true), this.mConfig.Uid, newautostate);
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
    let timesecnow = KDCommon.getCurrentTotalsec(this.mTimezoneoffsetMillisec);

    //console.log("-this.Name : " + this.mConfig.Name+ ", ---------------timesecnow :   "+timesecnow +",currentstate :"+currentstate );

    // console.log("getOperationsByControl  Cat: " + this.mConfig.Cat);

    //카메라는 여기서 처리안함
    if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_CAMERA_FJBOX) {
      return oplist;
    }

    if (this.isBasiccondition(timesecnow) == true) {

      //물환수 제어일경우 타이머 센서 둘다사용 
      if (this.mConfig.Cat === KDDefine.AUTOCategory.ACT_PARTIAL_WATER_CHANGE_FOR_WATERTANK) {
        
        currentstate = this.getStateByTimerSensorconditionforwatertank(msensors,timesecnow);
        
      }
      else{

      


      if (this.mConfig.AType == KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT || this.mConfig.AType == KDDefine.AUTOType.ACM_TIMER_ONLY_DAY) {
        //타이머
        currentstate = this.getStateByTimercondition(msensors,timesecnow);
      } else {
        //센서
        currentstate = this.getStateBySensorcondition(msensors, timesecnow);
      }
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
