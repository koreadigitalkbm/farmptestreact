//구동기노드로 부터 상태값을 읽어 간략히 저장
const KDDefine = require("./kddefine");
const KDUtil = require("./kdutil");
module.exports = class ActuatorOperation {
  constructor(mniqid, ison, ontime) {
    this.Opcmd = 0;
    this.Timesec = ontime;
    this.Param = 0;
    this.Opid = KDUtil.GetOPIDRandom();// 초기화 생성시 OPID 랜덤하게 생성 중복되지않게 중복되면 실행안될수도 있음, 같은값으로 초기화되면 시스템 리셋시 동일한값이므로 명령어 실행안될수 있음.
    this.Opmode = KDDefine.OPMode.OPM_Manual; //기본수동
    this.Uid = mniqid;
    if (ison == true) {
      this.Opcmd = KDDefine.ONOFFOperationTypeEnum.OPT_Timed_On;
    } else {
      this.Opcmd = KDDefine.ONOFFOperationTypeEnum.OPT_Off;
      this.Timesec = 0;
    }
  }

  // 명령어 전송시 시간에 파라메터 합해서 전송되는경우 : LED 디밍
  static Gettimewithparam(ontime,param)
  {
    let pint=Math.trunc(Number(param));
    let timeparam = Number(ontime) + (pint * 10000000);
    return Number(timeparam);
  }
  //구동기 동작시  opid를 갱신
  setoperation(mcmd, mtime, mparam, opmode) {
    this.Opcmd = mcmd;
    this.Timesec = mtime;
    this.Param = mparam;
    this.Opmode = opmode;
    this.Opid = (this.Opid + 1) & 0xffff; /// 새로 갱신할때마다 값을 증가시켜 다른값으로 변경함.
  }
};
