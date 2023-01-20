//센서노드에 대한 인터페이스 클래스

const SensorNode = require("./sensornode.js");
const SensorCompact = require("../../frontend/myappf/src/commonjs/sensorcompact.js");
const Sensordevice = require("../../frontend/myappf/src/commonjs/sensordevice.js");

class SensorInterface {
  constructor(mmain) {
    
    this.mMain= mmain;
    this.SensorNodes = []; // 센서노드 리스트
    this.mSensors = []; //읽은센서전체 리시트
    this.modbusMaster = this.mMain.ModbusComm; //통신포트
    
    
    ///모델별로 구별해서 센서노드를  설정하자.
    if (this.mMain.localsysteminformations.Systemconfg.productmodel === "KPC480") {
      const mysnode_sid_1 = new SensorNode(1, 140, this.modbusMaster);
      this.SensorNodes.push(mysnode_sid_1);
    }
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === "KPC200") {
      const mysnode_sid_1 = new SensorNode(1, 140, this.modbusMaster);
      this.SensorNodes.push(mysnode_sid_1);
    }
     else {
      const mysnode_sid_1 = new SensorNode(11, 40, this.modbusMaster);
      this.SensorNodes.push(mysnode_sid_1);
    }
  }

  //센서 갱신
  sensorupdate(newsensorlist) {
    //
    for (const newsensor of newsensorlist) {
      let isnew = true;
      for (const oldsensor of this.mSensors) {
        //기존에 있는센서면 값만 업데이트
        if (oldsensor.UniqID === newsensor.Uid) {
          oldsensor.Setupdatevalue(newsensor.Val);
          isnew = false;
          break;
        }
      }

      //새로운센서이면
      if (isnew === true) {
        let sdev = new Sensordevice(newsensor);
        this.mSensors.push(sdev);
      }
    }
  }


  //연결된 센서노드로 부터 센서값을 전부 읽어드림
  async ReadSensorAll() {
    //   console.log("-SensorInterface ReadSensorAll------------------");

    //센서 상태를 읽을때마다 에러카운트 증가
    let deleteindex = -1;
    for (let i = 0; i < this.mSensors.length; i++) {
      let ms = this.mSensors[i];
      ms.errorcount++;
      // 에러 카운트가 20이상 된다면 센서 끊김상태임 추후 처리
      // 에러 카운트가 1000(10분)이상 된다면 센서 삭제, 삭제해도 되나..
      if (ms.errorcount > 1000) {
        deleteindex = i;
      }
    }
    if (deleteindex >= 0) {
      this.mSensors.splice(deleteindex, 1);
    }


    for (const snode of this.SensorNodes) {
      let sensorlist = await snode.ReadSensorAll();

      if (sensorlist) {
        this.sensorupdate(sensorlist);
      }
    }
  }
//센서 값을 컴팩트하게 만들어서 전송한다. 
  getsensorssimple() {
    let mslist = [];
    for (const ms of this.mSensors) {
      let newcs = new SensorCompact(0, 0, 0);
      newcs.Uid = ms.UniqID;
      newcs.Val = ms.value;
      mslist.push(newcs);
    }
    return mslist;
  }
  
}

module.exports = SensorInterface;
