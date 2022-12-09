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
  //기본적인 사항을 확인함.
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
  //타이머방식 채크
  isTimercondition() {
    if (this.mConfig.OffTime == 0) {
      if (this.PWMonoffstate == false)
      {
        this.PWMonoffstate =true;
        return true;
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

          return true;
        }
      } else {
        if (totalsec > this.PWMLasttoltalsec + this.mConfig.OnTime) {
          this.PWMLasttoltalsec = totalsec;
          this.PWMonoffstate = false;
          console.log("-isTimercondition off : " + totalsec);
        } 
      }
    }
    return false;
  }

  isSensorcondtion(msensors) {
    return false;
  }

  //자동제어로 동작한후 상태가 변경되면  true  리턴
  ischangebycontrol(msensors, timesecnow) {

    return false;

  }

  getOperationsByControl(msensors, mactuators)
  {
    let oplist=[];
    let curstate = false;
    
    let ischangeevent=false; // 먼가 상태가 변경되어 구동기에 명령어를 주어야함.
    let currentonoffstate=false;

    let timesecnow = KDCommon.getCurrentTotalsec();
    if (this.isBasiccondition(timesecnow) == true) {
      if (this.mConfig.TEnb == true) {
        //타이머
        currentonoffstate = ischangeevent = this.isTimercondition();
      } else {
        //센서
        curstate = this.isSensorcondtion(msensors);
        ischangeevent = this.mState.ischangestatecheck(curstate);
      }
    }
    else{
      //기본조건 안맞음 모두  off
      currentonoffstate=false;
      ischangeevent=this.mState.ischangestatecheck(currentonoffstate);
    }
    
    if( ischangeevent ==true)
    {
      for (const mactid of this.mConfig.Actlist) {
        let opcmd = new ActuatorOperation(mactid, currentonoffstate, this.mConfig.OnTime);
        oplist.push(opcmd);
        console.log("-getOperationsByControl new---------------mactid : " + mactid + " cmd:"+opcmd.Opcmd);

/*
        for (const actd of mactuators) 
          {
            if(mactid ==actd.UniqID )
            {


              break;
            }

          }
          */
        
        
      }

    }

    return oplist;

  }



};
