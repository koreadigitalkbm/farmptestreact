//구동기노드로 부터 상태값을 읽어 간략히 저장
const KDDefine = require("./kddefine");
module.exports = class ActuatorStatus{
        constructor(muid) {
            this.Sat = 0;
            this.Rmt = 0;
            this.Opid = 0;
            this.Uid = muid;
            this.Opm = KDDefine.OPMode.OPM_Manual;// 구동 모두  MA:수동 AT: 자동  LM:현장수동
              
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

        static stateToStringID(mSat)
        {
            let strid;
            switch(mSat)
            {
                
                case KDDefine.AUTOStateType.AST_Drain_water:
                    strid="LT_ACT_STATE_DRAIN_WATER";
                break;
                case KDDefine.AUTOStateType.AST_Pupmping_water:
                    strid="LT_ACT_STATE_PUMPING_WATER";
                break;

                case KDDefine.AUTOStateType.AST_Open:
                    strid="LT_ACT_STATE_OPEN";
                break;
                case KDDefine.AUTOStateType.AST_Close:
                    strid="LT_ACT_STATE_CLOSE";
                break;
                case KDDefine.AUTOStateType.AST_Stop:
                    strid="LT_ACT_STATE_STOP";
                break;


                case KDDefine.AUTOStateType.AST_Off:
                    strid="LT_ACT_STATE_OFF";
                break;
                case KDDefine.AUTOStateType.AST_On:
                    strid="LT_ACT_STATE_ON";
                break;
                case KDDefine.AUTOStateType.AST_Off_finish:
                    strid="LT_ACT_STATE_OFF";
                break;
              

                
                case KDDefine.ONOFFOperationTypeEnum.OPT_Timed_On_Open:
                    strid="LT_ACT_STATE_OPEN";
                break;
                case KDDefine.ONOFFOperationTypeEnum.OPT_Timed_On_Close:
                    strid="LT_ACT_STATE_CLOSE";
                break;
                case KDDefine.ONOFFOperationTypeEnum.OPT_Stop:
                    strid="LT_ACT_STATE_STOP";
                break;



                case KDDefine.ONOFFOperationTypeEnum.OPT_Off:
                    strid="LT_ACT_STATE_OFF";
                break;
                case KDDefine.ONOFFOperationTypeEnum.OPT_Timed_On:
                case KDDefine.ONOFFOperationTypeEnum.OPT_On:
                    strid="LT_ACT_STATE_ON";
                break;

                default:
                    strid="LT_ACT_STATE_IDLE";
                    break;
            }

            return strid;
        }
      


}




