//구동기 기본 정보

module.exports = class SystemInformations {
  static Clonbyjsonobj(mobj) {
    return Object.assign(new SystemInformations(), mobj);
  }

  constructor() {
    this.Systemconfg = null; //시스템설정
    this.Actuators = null; //구동기 설정 목록
    this.Autocontrolcfg = null; //자동제어 설정 목록
  }
};
