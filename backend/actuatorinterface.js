
//구동기 노드에 대한 인터페이스 클래스

const ActuatorNode = require("./actuatornode.js");
const Actuatordevice = require("../frontend/myappf/src/commonjs/actuatordevice.js");

class ActuatorInterface{
   
  constructor(sysconfig,modbuscomm) {
      this.modbusMaster = modbuscomm; //통신포트
      this.ActuatorNodes = [];  // 구동기노드 리스트

      this.Actuators = [];  // 구동기목록
   
       ///모델별로 구별해서 센서노드를  설정하자.
    if (sysconfig.productmodel === "KPC480") {
      const myactnode_1 = new ActuatorNode(1, 28, modbuscomm);
      this.ActuatorNodes.push(myactnode_1);
    }
    else{
        const myactnode_1 = new ActuatorNode(1,24, modbuscomm);
        this.ActuatorNodes.push(myactnode_1);
    }

    //임시로 너음
       this.Actuators.push(new Actuatordevice(1,0,Actuatordevice.HardwareTypeEnum.HT_RELAY));
       this.Actuators.push(new Actuatordevice(1,1,Actuatordevice.HardwareTypeEnum.HT_RELAY));


  }

  //상태 갱신
  stateupdate(actuatorlist) {

    for (const actd of this.Actuators) {
      for (const readactdev of actuatorlist) {
        if(actd.UniqID === readactdev.Uid)
        {
          actd.Status = readactdev.Sat;
          console.log("-ActuatorInterface stateupdate ------------------ : " + actd.UniqID);
          break;
        }
      }
    }

  }


  //연결된 센서노드로 부터 센서값을 전부 읽어드림
  async ControlAll() {
    console.log("-ActuatorInterface ControlAll------------------");
    for (const anode of this.ActuatorNodes) {
      let alist = await anode.ReadStatusAll();
      if (alist) {
        this.stateupdate(alist);
      }
      //   await KDCommon.delay(300);
    }




  }
  
  
}


module.exports = ActuatorInterface;

