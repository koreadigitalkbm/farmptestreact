//자동제어
const AutoControlStatus = require("../frontend/myappf/src/commonjs/autocontrolstatus");
const AutoControlconfig = require("../frontend/myappf/src/commonjs/autocontrolconfig");
const ActuatorOperation = require("../frontend/myappf/src/commonjs/actuatoroperation");



const KDDefine = require("../frontend/myappf/src/commonjs/kddefine");

const KDCommon = require("./kdcommon");

module.exports = class AutoControl {
  constructor(mconfig) {
    this.mConfig = AutoControlconfig.deepcopy(mconfig); // 자동제어 설정을 복사해서 넣음
    this.mState = new AutoControlStatus(mconfig.UniqID);
    this.mLog = [];
    this.PWMonoffstate = false;
    this.PWMLasttoltalsec = 0; // 마지막 명령어 전송시점.
  }
  static Clonbyjsonobj(mobj) {
    return new AutoControl(mobj.mConfig);
  }
  //기본적인 사항을 확인함. enable, 시간
  isBasiccondition(timesecnow) {
    if (this.mConfig.Enb == true) {
      //시작시간과 종료시간 안에 들어와함.
      //시작시간이 더크면 자정포함임.
      if (this.mConfig.STime > this.mConfig.ETime) {
        if (timesecnow >= this.mConfig.STime || timesecnow <= this.mConfig.ETime) {
          return true;
        }
      } else {
        if (timesecnow >= this.mConfig.STime && timesecnow <= this.mConfig.ETime) {
          return true;
        }
      }
    }
    return false;
  }
  //타이머방식 채크 , 두가지 PWM 방식. 1회
  getStateByTimercondition() {
    if (this.mConfig.OffTime == 0) {
      if (this.PWMonoffstate == false) {
        this.PWMonoffstate = true;
        this.PWMLasttoltalsec = 0; // 1회성표시
        return KDDefine.AUTOStateType.AST_On;
      }
    } else {
      //PWM 제어
      const totalsec = KDCommon.getCurrentTotalsec();
      //자정이 넘어가면
      if (this.PWMLasttoltalsec > totalsec) {
        this.PWMLasttoltalsec = this.PWMLasttoltalsec - 24 * 3600;
      }

      if (this.PWMonoffstate == false) {
        if (totalsec > this.PWMLasttoltalsec + this.mConfig.OffTime) {
          this.PWMLasttoltalsec = totalsec;
          this.PWMonoffstate = true;
          //on 시간일때만 켜기 명령어 보냄  off 는 장비에서 알아서 off됨 ( timed on 방식이므로)
          console.log("-isTimercondition on : " + totalsec);
          return KDDefine.AUTOStateType.AST_On;
        }
      } else {
        if (totalsec > this.PWMLasttoltalsec + this.mConfig.OnTime) {
          this.PWMLasttoltalsec = totalsec;
          this.PWMonoffstate = false;
          console.log("-isTimercondition off : " + totalsec);
        }
      }
    }
    return KDDefine.AUTOStateType.AST_IDLE;
  }

  getStateBySensorcondition(msensors) {
    let currentstate = KDDefine.AUTOStateType.AST_IDLE;

    let currsensor=null;
    for (const ms of msensors ) {
      //우선 센서 1개만 처리
      if( ms.UniqID == this.mConfig.Senlist[0])
      {
        currsensor=ms;
        break;
      }
    }
    if(currsensor ==null){ //해당센서 없음
      return KDDefine.AUTOStateType.AST_ERROR
    }
    else{
           
        if(KDDefine.SensorConditionType.SCT_UP == this.mConfig.Cdir)
        {
          if( currsensor.value >=  (this.mConfig.TValue + this.mConfig.BValue))
          {
            currentstate = KDDefine.AUTOStateType.AST_On;
          }
          else if( currsensor.value <  (this.mConfig.TValue - this.mConfig.BValue))
          {
            currentstate = KDDefine.AUTOStateType.AST_Off;
          }

        }
        else{

          if( currsensor.value <=  (this.mConfig.TValue - this.mConfig.BValue))
          {
            currentstate = KDDefine.AUTOStateType.AST_On;
          }
          else if( currsensor.value >  (this.mConfig.TValue + this.mConfig.BValue))
          {
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

  getOperationsByControl(msensors, mactuators) {
    let oplist = [];

    let currentstate = KDDefine.AUTOStateType.AST_IDLE;

    let timesecnow = KDCommon.getCurrentTotalsec();
    if (this.isBasiccondition(timesecnow) == true) {
      if (this.mConfig.TEnb == true) {
        //타이머
        currentstate = this.getStateByTimercondition();
      } else {
        //센서
        currentstate = this.getStateBySensorcondition(msensors);
      }
    } else {
      //기본조건 안맞음 모두  off
      currentstate = KDDefine.AUTOStateType.AST_Off;
    }

    // 먼가 상태가 변경되어 구동기에 명령어를 주어야함.
    if (this.mState.ischangestatecheck(currentstate) == true) {
      for (const mactid of this.mConfig.Actlist) {
        let onoffstate = null;

        if (currentstate == KDDefine.AUTOStateType.AST_On) {
          onoffstate = true;
        } else if (currentstate == KDDefine.AUTOStateType.AST_Off || currentstate == KDDefine.AUTOStateType.AST_ERROR ) {
          //에러발생시 모두 off
          onoffstate = false;
        }

        if (onoffstate != null) {
          let opcmd = new ActuatorOperation(mactid, onoffstate, this.mConfig.OnTime);
          oplist.push(opcmd);
          console.log("-getOperationsByControl new---------------mactid : " + mactid + " cmd:" + opcmd.Opcmd);
        }
      
      }
    }

    return oplist;
  }
};
