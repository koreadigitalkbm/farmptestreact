
class ActuatorInterface{
   
  constructor(sysconfig,modbuscomm) {
      this.modbusMaster = modbuscomm; //통신포트
      this.ActuatorNodes = [];  // 센서노드 리스트
      
  }

  //센서 갱신
  sensorupdate(newsensorlist) {
  }

  //연결된 센서노드로 부터 센서값을 전부 읽어드림
  async ControlAll() {
    console.log("-ActuatorInterface ControlAll------------------");
  }
  
  
}


module.exports = ActuatorInterface;

