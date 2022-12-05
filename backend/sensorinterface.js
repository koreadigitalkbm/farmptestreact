

class SensorInterface{
   
      constructor(modbuscomm) {
          this.modbusMaster = modbuscomm; //통신포트
          this.SensorNodes = [];  // 센서노드 리스트
          this.mSensors =[]; //읽은센서전체 리시트
      }

      //센서 갱신
      sensorupdate(newsensorlist) {
      }

      //연결된 센서노드로 부터 센서값을 전부 읽어드림
      async ReadSensorAll() {
        console.log("-SensorInterface ReadSensorAll------------------");
      }
      
}


module.exports = SensorInterface;

