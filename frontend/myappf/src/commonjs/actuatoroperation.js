//구동기노드로 부터 상태값을 읽어 간략히 저장
module.exports = class ActuatorOperation{
        constructor(mniqid) {
            this.Opcmd = 0;
            this.Timesec = 0;
            this.Param = 0;
            this.Opid = 0;
            this.Opmode = "MA";//기본수동
            this.Uid=mniqid; 
              
        }
        
        //구동기 동작시  opid를 갱신 
        setoperation(mcmd,mtime,mparam, opmode)
        {
            this.Opcmd=mcmd;
            this.Timesec=mtime; 
            this.Param = mparam;
            this.Opmode = opmode;
            this.Opid =((this.Opid +1)&0xFFFF);
        }

}




