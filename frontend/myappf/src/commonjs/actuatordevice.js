

const ActuatorStatus = require("./actuatorstatus.js");
const ActuatorOperation = require("./actuatoroperation");
const ActuatorBasic = require("./actuatorbasic");

module.exports =  class Actuatordevice{
    
  

     
    static OutDeviceTypeEnum = Object.freeze({
        ODT_RELAY: 0,
        ODT_PUMP: 1, //
        ODT_FAN: 2,
        ODT_VALVE: 3,
        ODT_LED: 4,
        ODT_COOLER: 5,
        ODT_HEATER: 6,
        ODT_POWER: 7,
        ODT_NOZZLE: 8,
        ODT_ETC: 99,
        ODT_DELETE: 9999, //장치삭제
      });
      
        constructor(mBasicinfo) {
            this.Basicinfo =ActuatorBasic.Clonbyjsonobj(mBasicinfo);
            this.UniqID =this.Basicinfo.UniqID;
            this.AStatus= new ActuatorStatus(this.UniqID); // 구동기 상태 컨트롤러부터 읽어옴
            this.AOperation= new ActuatorOperation(this.UniqID); // 구동기 명령어 이변수를 통해 해당구동기 작동하자
            console.log("Actuatordevice  : " + this.UniqID );
    
        }

    


}




