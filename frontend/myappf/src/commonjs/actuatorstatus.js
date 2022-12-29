//구동기노드로 부터 상태값을 읽어 간략히 저장
const KDDefine = require("./kddefine");
module.exports = class ActuatorStatus{
        constructor(muid) {
            this.Sat = 0;
            this.Rmt = 0;
            this.Opid = 0;
            this.Uid = muid;
            this.Opm = "MA";// 구동 모두  MA:수동 AT: 자동  LM:현장수동
              
        }
        static makeactuatoruniqid(nodeid, channel,hwtype)
        {
            let uid ="N"+nodeid.toString().padStart(2,'0') +"C"+channel.toString().padStart(2,'0') + "T"+hwtype.toString().padStart(2,'0') ; // 구둥기를 구별하는 고유ID  노드번호와 하드웨어 채널  타입정보로 생성한다. N11C1T23
            return uid;
        }
    
        updatestatus(mStatus,mOpid,mRemain)
        {
            this.Sat=mStatus;
            this.Rmt=mRemain; 
            this.Opid = mOpid;

        }

        statetonomalstring()
        {
            let strmsg;
            switch(this.Sat)
            {
                case KDDefine.ONOFFOperationTypeEnum.OPT_Off:
                    strmsg="꺼짐(Off)";
                break;
                case KDDefine.ONOFFOperationTypeEnum.OPT_Timed_On:
                case KDDefine.ONOFFOperationTypeEnum.OPT_On:
                    strmsg="켜짐(On)";
                break;

                default:
                    strmsg=this.Sat;
                    break;
            }

            return strmsg;
        }
      


}




