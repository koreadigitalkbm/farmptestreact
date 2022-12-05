//센서값을 계속 읽어서 저장해야함으로 간단한 구조
 class SensorCompact{
        constructor(nodeid, sensorcode,sensorvalue) {
            this.channel = (sensorcode >> 8) & 0xff;
            this.Sensortype =  (sensorcode & 0xff);
            this.nodeID = nodeid;
            this.value = sensorvalue;
            this.UniqID = "S"+this.nodeID +"C"+this.channel + "T"+this.Sensortype ; // 센서를 구별하는 고유ID  센서노드번호와 하드웨어 채널  센서타입정보로 생성한다. S11C1T23
        }
    //  console.log("SensorDevice  : " + this.value );

}


module.exports = SensorCompact;

