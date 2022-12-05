const SensorNode = require("./sensornode.js");
const SensorCompact = require("../common/commonjs/sensorcompact.js");
const Sensordevice = require("../common/commonjs/sensordevice.js");


class SensorInterface {
  constructor(sysconfig, modbuscomm) {
    this.modbusMaster = modbuscomm; //통신포트
    this.SensorNodes = []; // 센서노드 리스트
    this.mSensors = []; //읽은센서전체 리시트

    ///모델별로 구별해서 센서노드를  설정하자.
    if (sysconfig.productmodel === "KPC480") {
      const mysnode_sid_1 = new SensorNode(1, 140, modbuscomm);
      this.SensorNodes.push(mysnode_sid_1);
    }
  } 
    
  //센서 갱신
  sensorupdate(newsensorlist) {
    //업데이트 할때마다 에러카운트 증가
    for (const ms of this.mSensors) {
      ms.errorcount++;
    }

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
    for (const snode of this.SensorNodes) {
      let sensorlist = await snode.ReadSensorAll();
      if (sensorlist) {
        this.sensorupdate(sensorlist);
      }
      //   await KDCommon.delay(300);
    }
  }
}

module.exports = SensorInterface;
