//구동기 노드에 대한 인터페이스 클래스
const ActuatorNode = require("./actuatornode.js");
const ActuatorStatus = require("../../frontend/myappf/src/commonjs/actuatorstatus.js");
const Actuatordevice = require("../../frontend/myappf/src/commonjs/actuatordevice.js");
const ActuatorBasic = require("../../frontend/myappf/src/commonjs/actuatorbasic.js");
const SystemEvent = require("../../frontend/myappf/src/commonjs/systemevent");
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("../kdcommon");




const color = require('colors');


module.exports = class ActuatorInterface {
  constructor(mmain) {

    this.mMain= mmain;
    this.ActuatorNodes = []; // 구동기노드 리스트
    this.Actuators = []; // 구동기목록
    this.modbusMaster = this.mMain.ModbusComm; //통신포트

    console.log( '       '.bgMagenta, this.mMain.localsysteminformations )


    //
    let actuatorconfigfilename = KDCommon.actuatorconfigfilename;

    ///모델별로 구별해서 구동기노드를  설정하자.
    if (this.mMain.localsysteminformations.Systemconfg.productmodel === "KPC480") {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC480, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc480;
    }
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === "KPC200") {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC200, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc200;
    }
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === "VFC3300") {
        const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_VFC3300, this.modbusMaster);
        this.ActuatorNodes.push(myactnode_1);
        //장비별로 따로
        actuatorconfigfilename = KDCommon.actuatorconfigfilename_VFC3300;
    } 
    else {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_VFC24M, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
    }





    let actinfolist = KDCommon.Readfilejson(actuatorconfigfilename);
    ////설정파일이 없으면 디폴트로 생성
    if (actinfolist === null) {
      actinfolist = ActuatorBasic.CreateDefaultConfig(this.mMain.localsysteminformations.Systemconfg.productmodel);
      KDCommon.Writefilejson(actuatorconfigfilename, actinfolist);
      actinfolist = KDCommon.Readfilejson(actuatorconfigfilename);
    }
    ///


    console.log( '       '.bgCyan, actinfolist  )
    console.log( '       '.bgCyan, actinfolist  )
    console.log( '       '.bgCyan, actinfolist  )


    this.mMain.localsysteminformations.Actuators = actinfolist;
    for (const minfo of actinfolist) {
      this.Actuators.push(new Actuatordevice(minfo));
    }
  }
  //상태 갱신
  async stateupdate(actuatorlist, curactnode) {
    for (const actd of this.Actuators) {
      for (const readactdev of actuatorlist) {
        if (actd.UniqID === readactdev.Uid) {
          actd.AStatus.updatestatus(readactdev.Sat, readactdev.Opid, readactdev.Rmt);
          //console.log("-stateupdate uid: " + actd.UniqID + " , staus: "+actd.AStatus.Sat + ", opid :"+actd.AStatus.Opid  + ", ch: " + actd.Basicinfo.Channel);
          //현장수동모드이면
          if (readactdev.Sat === 299) {
            actd.AStatus.Opm = "LM";
          } else {
            // 기존값 유지, 자동,수동 변경
            actd.AStatus.Opm = actd.AOperation.Opmode;
          }
          //읽은 opid 가  마지막 명령어 opid 와 다르다면 명령어 처리가 안된상태거나  컨트롤러보드 리셋됨, 다시 명령어 전송
          if (actd.AOperation.Opid !== actd.AStatus.Opid && actd.AStatus.Opm !== "LM") {
            await curactnode.ControlNormal(actd.AOperation, actd.Basicinfo.Channel);
          } else {
            let newevt = actd.getEventwithCheck();
            if (newevt != null) {
              this.mMain.setSystemevent(newevt);
              console.log("-stateupdate uid: " + actd.UniqID + " , staus: " + actd.AStatus.Sat + ", opid :" + actd.AStatus.Opid + ", LastCompleteOPID: " + actd.LastCompleteOPID);
            }
          }

          break;
        }
      }
    }
  }

  //구동기 상태를 읽은후 구동기의 동작상태와 비교해서 작동시킴.
  async ReadStatus() {
    //console.log("-ActuatorInterface ControlAll------------------");
    for (const anode of this.ActuatorNodes) {
      let alist = await anode.ReadStatusAll();

      //mainObj.actuator_list = anode.actlist;     // 구동기노드가 하나만 있는것으로 일단은 가정 
      // console.log( anode.actlist.length )

      if (alist) {
        await this.stateupdate(alist, anode);
      }
    }
  }


  // 그냥테스트 함수
  setcontrolbychannel(opchannel, mcmd, mtimesec) {
    for (const actd of this.Actuators) {
      if (actd.Basicinfo.Channel === opchannel) {
        actd.AOperation.setoperation(mcmd, mtimesec, 0, "MA");
      }
    }
  }
  setACToperation(mloperation, opmode) {
    for (const actd of this.Actuators) {
      if (actd.UniqID === mloperation.Uid) {
        actd.AOperation.setoperation(mloperation.Opcmd, mloperation.Timesec, mloperation.Param, opmode);
      }
    }
  }

  // 수동제어
  setoperationmanual(manualoperation) {
    this.setACToperation(manualoperation, "MA");
  }
  //자동제어
  setoperationAuto(autooperationlist) {
    for (const mopcmd of autooperationlist) {
      this.setACToperation(mopcmd, "AT");
    }
  }

  //구동기상태 값을 전송한다.
  getactuatorstatus() {
    let malist = [];
    for (const actd of this.Actuators) {
      malist.push(actd.AStatus);
    }
    return malist;
  }
};
