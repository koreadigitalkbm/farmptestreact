//시스템에 모드 정보를 여기에 모아서 한번에 프론트엔드로 보냄

module.exports = class SystemInformations {
  static Clonbyjsonobj(mobj) {
    return Object.assign(new SystemInformations(), mobj);
  }

  constructor() {
    this.Systemconfg = null; //시스템설정
    this.Actuators = null; //구동기 기본 정보를 가지는 목록 ActuatorBasic 클래스 어레이 
    this.Alias = []; //구동기, 센서 기타 별칭이 필요한 장비는 여기다 기록한다.
  }
};
