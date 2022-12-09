//자동제어
const AutoControlStatus = require("../frontend/myappf/src/commonjs/autocontrolstatus");
const AutoControlconfig = require("../frontend/myappf/src/commonjs/autocontrolconfig");
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
      return true;
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
          return true;
        }
      } else {
        if (totalsec > this.PWMLasttoltalsec + this.mConfig.OnTime) {
          this.PWMLasttoltalsec = totalsec;
          this.PWMonoffstate = fasle;
          return false;
        } else {
          return true;
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
    let mstatus = false;

    if (this.isBasiccondition(timesecnow) == true) {
      if (this.mConfig.TEnb == true) {
        //타이머
        mstatus = this.isTimercondition();
      } else {
        //센서

        mstatus = this.isSensorcondtion();
      }

      return this.mState.ischangestatecheck(mstatus);
    }
    return false;
  }
};
