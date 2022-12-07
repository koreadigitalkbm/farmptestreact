


//구동기 기본 정보 
const ActuatorStatus = require("./actuatorstatus.js");
module.exports =  class ActuatorBasic{
    
    static Clonbyjsonobj(mobj) {
        return Object.assign(new ActuatorBasic("n0",0), mobj);
      }

        constructor(mname,mchannel) {
            this.Name =mname;           //구동장비 이름
            this.HWType=0;              // 릴레이, 계폐기, 기타
            this.Nodeid=1;              // 노드 주소 , 구동기구별을 위해
            this.Channel=mchannel;      // 물리적 채널번호    
            this.UniqID = ActuatorStatus.makeactuatoruniqid(this.Nodeid,this.Channel ,this.HWType);
        }

    


}




