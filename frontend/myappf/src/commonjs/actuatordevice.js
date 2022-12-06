

const ActuatorStatus = require("./actuatorstatus.js");
const ActuatorOperation = require("../../../../backend/actuatoroperation");

module.exports =  class Actuatordevice{
    
    static HardwareTypeEnum = Object.freeze({
        HT_RELAY: 0, // 단순 on,off 제어 
        HT_SWITCH: 1, // 열기, 닫기 계페기
        HT_ETC: 2,   // 기타
      });

    
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
      
        constructor(nodeid,channel, hwtype) {
    
            
            this.Name = "actuator";
            this.channel=channel;
            this.hardwaretype=hwtype;
            this.Nodeid=nodeid;
            this.UniqID = ActuatorStatus.makeactuatoruniqid(nodeid,channel ,hwtype);
            this.AStatus= new ActuatorStatus(this.UniqID); // 구동기 상태 컨트롤러부터 읽어옴
            this.AOperation= new ActuatorOperation(); // 구동기 상태 컨트롤러부터 읽어옴

            console.log("Actuatordevice  : " + this.UniqID );
    
        }

    


}




