const ActuatorStatus = require("./actuatorstatus.js");
const ActuatorOperation = require("./actuatoroperation");
const ActuatorBasic = require("./actuatorbasic");

module.exports = class Actuatordevice {
  constructor(mBasicinfo) {
    this.Basicinfo = ActuatorBasic.Clonbyjsonobj(mBasicinfo);
    this.UniqID = this.Basicinfo.UniqID;
    this.AStatus = new ActuatorStatus(this.UniqID); // 구동기 상태 컨트롤러부터 읽어옴
    this.AOperation = new ActuatorOperation(this.UniqID, false,0); // 구동기 명령어 이변수를 통해 해당구동기 작동하자
    console.log("Actuatordevice  : " + this.UniqID);
  }
};
