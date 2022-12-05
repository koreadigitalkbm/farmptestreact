//구동기노드로 부터 상태값을 읽어 간략히 저장
module.exports = class ActuatorCompact{
        constructor(nodeid, channel,hwtype) {
            this.Sat = 0;
            this.Rmt = 0;
            this.Uid = "N"+nodeid.toString().padStart(2,'0') +"C"+channel.toString().padStart(2,'0') + "T"+hwtype.toString().padStart(2,'0') ; // 구둥기를 구별하는 고유ID  노드번호와 하드웨어 채널  타입정보로 생성한다. N11C1T23
              
        }
    
        updatestatus(mStatus,mRemain)
        {
            this.Sat=mStatus;
            this.Rmt=mRemain; 
        }

}




