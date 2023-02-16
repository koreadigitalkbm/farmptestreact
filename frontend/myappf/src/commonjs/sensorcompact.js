//센서값을 계속 읽어서 저장, 또는 전송 해야함으로 간단한 구조
 class SensorCompact{
        constructor(nodeid, sensorcode,sensorvalue) {
            let channel = (sensorcode >> 8) & 0xff;
            let Sensortype =  (sensorcode & 0xff);
            //this.nodeID = nodeid;

            this.Val = sensorvalue;
            this.Uid = "S"+nodeid.toString().padStart(2,'0') +"C"+channel.toString().padStart(2,'0') + "T"+Sensortype.toString().padStart(2,'0') ; // 센서를 구별하는 고유ID  센서노드번호와 하드웨어 채널  센서타입정보로 생성한다. S11C1T23
              //console.log("SensorCompact  : " + this.Uid );
        }
       
    

}


module.exports = SensorCompact;

