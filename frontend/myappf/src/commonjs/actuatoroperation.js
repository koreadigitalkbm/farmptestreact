//구동기노드로 부터 상태값을 읽어 간략히 저장
const KDDefine = require("./kddefine");
module.exports = class ActuatorOperation {
  constructor(mniqid, ison, ontime) {
    this.Opcmd = 0;
    this.Timesec = ontime;
    this.Param = 0;
    this.Opid = 0;
    this.Opmode = "MA"; //기본수동
    this.Uid = mniqid;
    if (ison == true) {
      this.Opcmd = KDDefine.ONOFFOperationTypeEnum.OPT_Timed_On;
    } else {
      this.Opcmd = KDDefine.ONOFFOperationTypeEnum.OPT_Off;
      this.Timesec = 0;
    }
  }

  //구동기 동작시  opid를 갱신
  setoperation(mcmd, mtime, mparam, opmode) {
    this.Opcmd = mcmd;
    this.Timesec = mtime;
    this.Param = mparam;
    this.Opmode = opmode;
    this.Opid = (this.Opid + 1) & 0xffff;
  }
};
