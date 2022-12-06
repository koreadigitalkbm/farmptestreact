
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

    //임시로 너음, 나중에 파일에서 가져오자
       this.Actuators.push(new Actuatordevice(1,0,Actuatordevice.HardwareTypeEnum.HT_RELAY));
       this.Actuators.push(new Actuatordevice(1,1,Actuatordevice.HardwareTypeEnum.HT_RELAY));


  } 
  //상태 갱신
  stateupdate(actuatorlist) {

    for (const actd of this.Actuators) {
      for (const readactdev of actuatorlist) {
        if(actd.UniqID === readactdev.Uid)
        {
          actd.AStatus.Sat = readactdev.Sat;
          actd.AStatus.Opid = readactdev.Opid;
          actd.AStatus.Rmt = readactdev.Rmt;

          console.log("-stateupdate uid: " + actd.UniqID + " , staus: "+actd.AStatus.Sat );
          break;
        }
      }
    }

  }


  //구동기 상태를 읽은후 구동기의 동작상태와 비교해서 작동시킴.
  async ControlAll() {
    console.log("-ActuatorInterface ControlAll------------------");
    for (const anode of this.ActuatorNodes) {
      let alist = await anode.ReadStatusAll();
      if (alist) {
        this.stateupdate(alist);
      }
    }
  }
  
  
}


module.exports = ActuatorInterface;

