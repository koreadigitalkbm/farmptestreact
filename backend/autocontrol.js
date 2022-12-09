//자동제어
const AutoControlStatus = require("../frontend/myappf/src/commonjs/autocontrolstatus");
const AutoControlconfig = require("../frontend/myappf/src/commonjs/autocontrolconfig");

module.exports = class AutoControl {
  constructor(mconfig) {
    this.mConfig = AutoControlconfig.deepcopy(mconfig); // 자동제어 설정을 복사해서 넣음
    this.mState = new AutoControlStatus(mconfig.UniqID);
    this.mLog = [];
  }

  static Clonbyjsonobj(mobj) {
    return new AutoControl(mobj.mConfig);
  }

  //자동제어로 동작한후 상태가 변경되면  true  리턴
  ischangebycontrol(msensors, timesecnow) {
    let mstatus = false;

    return this.mState.ischangestatecheck(mstatus);
  }
};
