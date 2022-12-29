const ActuatorStatus = require("./actuatorstatus.js");
const ActuatorOperation = require("./actuatoroperation");
const ActuatorBasic = require("./actuatorbasic");
//구동기 기본정적 정보와 상태정보, 마지막제어명령어등을 포함한다.
module.exports = class Actuatordevice {
  constructor(mBasicinfo) {
    this.Basicinfo = ActuatorBasic.Clonbyjsonobj(mBasicinfo);
    this.UniqID = this.Basicinfo.UniqID;
    this.AStatus = new ActuatorStatus(this.UniqID); // 구동기 상태 컨트롤러부터 읽어옴
    this.AOperation = new ActuatorOperation(this.UniqID, false,0); // 구동기 명령어 이변수를 통해 해당구동기 작동하자
    this.LastCompleteOPID=0;//명령어가 성공적으로 처리되었으면 여기에 남김. 이벤트기록시 사용 
    
    console.log("Actuatordevice  : " + this.UniqID);
  }
};
