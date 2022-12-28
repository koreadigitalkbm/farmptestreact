//메모리에 하루동안의 데이터만 저장해보자

const KDCommon = require("./kdcommon");
const backGlobal = require("./backGlobal");

module.exports = class DailyCurrentDatas {
  constructor() {
    this.DSensors = []; //센서데이터
    this.DEvents = []; //자동제어, 구동기변경, 기타 로그
  }

  updateEvent(curdata) {
    //배열 1000개 넘어가면 앞부분 100개 삭제
    if (this.DEvents.length >= 1000) {
      this.DEvents.splice(0, 100);
    }
    let newitem = new DailyEvent(curdata);
    this.DEvents.push(newitem);
  }

  updateSensor(curdata) {
    //배열 1000개 넘어가면 앞부분 100개 삭제
    if (this.DSensors.length >= 1000) {
      this.DSensors.splice(0, 100);
    }
    let newitem = new DailySensor(curdata);
    this.DSensors.push(newitem);

  //  for (const msensor of newitem.SLIST) {
  //    console.log("updateSensor time : " + newitem.DT + ", ID: " + msensor.Uid + ", value:" + msensor.Val);
  //  }
  }
};
class DailyEvent {
  constructor(emsg) {
    this.DT = new Date();
    this.EMSG = emsg; //
  }
}
class DailySensor {
  constructor(dsensors) {
    this.DT = new Date();
    this.SLIST = dsensors; //센서
  }
}
