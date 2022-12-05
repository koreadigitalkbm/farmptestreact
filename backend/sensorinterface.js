
const SensorNode = require("./sensornode.js");

class SensorInterface{
   
      constructor(sysconfig,modbuscomm) {
          this.modbusMaster = modbuscomm; //통신포트
          this.SensorNodes = [];  // 센서노드 리스트
          this.mSensors =[]; //읽은센서전체 리시트

          
         ///모델별로 구별해서 센서노드를  설정하자.
          if(sysconfig.productmodel === "KPC480")
          {
            const mysnode_sid_1 = new SensorNode(1,140, modbuscomm);
            this.SensorNodes.push(mysnode_sid_1);

          }

          
          

      }

      //센서 갱신
      sensorupdate(newsensorlist) {
      }

      //연결된 센서노드로 부터 센서값을 전부 읽어드림
      async ReadSensorAll() {
        console.log("-SensorInterface ReadSensorAll------------------");
        for (const snode of this.SensorNodes) {
            let sensorlist = await snode.ReadSensorAll();
            if (sensorlist) {
          //    mss.push(...sensorlist);
            }
         //   await KDCommon.delay(300);
          }

      }
      
}


module.exports = SensorInterface;

