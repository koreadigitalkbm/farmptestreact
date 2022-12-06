//구동기노드로 부터 상태값을 읽어 간략히 저장
module.exports = class ActuatorOperation{
        constructor(channel) {
            this.Opcmd = 0;
            this.Timesec = 0;
            this.Param = 0;
            this.Opid = 0;
            this.Channel=channel; 
              
        }
        //구동기 동작시  opid를 갱신 
        setoperation(mcmd,mtime,mparam)
        {
            this.Opcmd=mcmd;
            this.Timesec=mtime; 
            this.Param = mparam;
            this.Opid =((this.Opid +1)&0xFFFF);

        }

}




