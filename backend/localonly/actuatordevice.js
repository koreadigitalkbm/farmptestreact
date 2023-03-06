const ActuatorStatus = require("../../frontend/myappf/src/commonjs/actuatorstatus");
const ActuatorOperation = require("../../frontend/myappf/src/commonjs/actuatoroperation");
const ActuatorBasic = require("../../frontend/myappf/src/commonjs/actuatorbasic");
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const SystemEvent = require("./systemevent");


//구동기 기본정적 정보와 상태정보, 마지막제어명령어등을 포함한다.
module.exports = class Actuatordevice {
  constructor(mBasicinfo) {
    this.Basicinfo = ActuatorBasic.Clonbyjsonobj(mBasicinfo);
    this.UniqID = this.Basicinfo.UniqID;
    this.AStatus = new ActuatorStatus(this.UniqID); // 구동기 상태 컨트롤러부터 읽어옴
    this.AOperation = new ActuatorOperation(this.UniqID, false, 0); // 구동기 명령어 이변수를 통해 해당구동기 작동하자
    this.LastCompleteOPID = 0; //명령어가 성공적으로 처리되었으면 여기에 남김. 이벤트기록시 사용
    this.LastCompleteState = 0;
    console.log("Actuatordevice  : " + this.UniqID);
  }

  
  //구동기상태변화가 있거나 먼가 이벤트가 발생했는지 확인
  getEventwithCheck() {
    let newevent = null;
    // 보낸 OPID 와 받은 OPID 같다면 명령어 정상적으로 수행됬음. 이벤트 남김
    if (this.AOperation.Opid === this.AStatus.Opid) {
      
      let isevent = false;
      if (this.AOperation.Opid != this.LastCompleteOPID) {

        console.log("getEventwithCheck UniqID:" + this.UniqID+" , LastCompleteState: " + this.LastCompleteState +  " ,sta:" + this.AStatus.Sat);
        //상태가 다를경우만 이벤트 기록 
        if(this.LastCompleteState != this.AStatus.Sat)
        {
          isevent = true;
        }

        this.LastCompleteOPID = this.AOperation.Opid;
        this.LastCompleteState = this.AStatus.Sat;

        
      } else {
        //OPID 은 같지만 상태가 다르다 : 타임드온 방식이면 지정시간동안 켜있다가 꺼짐으로 상태변경될수 있음.
        if (this.AStatus.Sat != this.LastCompleteState) {

          this.LastCompleteState = this.AStatus.Sat;
          isevent = true;
        }
      }

      if (isevent == true) {
        //let eparam = this.eventTonomalstring();
        //newevent = new SystemEvent(KDDefine.EVENTType.EVT_ACTUATOR, eparam);

        newevent= SystemEvent.createActuatorEvent(this.UniqID,this.AStatus.Sat);

      }
    }

    return newevent;
  }
};
