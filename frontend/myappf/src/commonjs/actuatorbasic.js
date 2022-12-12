


//구동기 기본 정보 
const ActuatorStatus = require("./actuatorstatus.js");
const KDDefine = require("./kddefine");
module.exports =  class ActuatorBasic{
    
    static Clonbyjsonobj(mobj) {
        return Object.assign(new ActuatorBasic("n0",0), mobj);
      }

        constructor(mname,mchannel) {
            this.Name =mname;           //구동장비 이름
            this.HWType=KDDefine.HardwareTypeEnum.HT_RELAY;              // 릴레이, 계폐기, 기타
            this.DevType=KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            this.Nodeid=1;              // 노드 주소 , 구동기구별을 위해
            this.Channel=mchannel;      // 물리적 채널번호    
            this.UniqID = ActuatorStatus.makeactuatoruniqid(this.Nodeid,this.Channel ,this.HWType);
        }

    


}




