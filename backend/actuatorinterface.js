
//구동기 노드에 대한 인터페이스 클래스
const ActuatorNode = require("./actuatornode.js");
const ActuatorStatus = require("../frontend/myappf/src/commonjs/actuatorstatus.js");
const Actuatordevice = require("../frontend/myappf/src/commonjs/actuatordevice.js");
const ActuatorBasic = require("../frontend/myappf/src/commonjs/actuatorbasic.js");
const KDCommon = require("./kdcommon");



module.exports =  class ActuatorInterface{
   
  constructor(sysinfo,modbuscomm) {
      this.modbusMaster = modbuscomm; //통신포트
      this.ActuatorNodes = [];  // 구동기노드 리스트
      this.Actuators = [];  // 구동기목록

      //
      let actuatorconfigfilename = "../common/local_files/actuatorconfig.json";

       ///모델별로 구별해서 구동기노드를  설정하자.
    if (sysinfo.Systemconfg.productmodel === "KPC480") {
      const myactnode_1 = new ActuatorNode(1, 28, modbuscomm);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = "../common/local_files/actuatorconfig_kpc480.json";
    }
    else{
        const myactnode_1 = new ActuatorNode(1,24, modbuscomm);
        this.ActuatorNodes.push(myactnode_1);
        actuatorconfigfilename = "../common/local_files/actuatorconfig.json";
    }




    let actinfolist = KDCommon.Readfilejson(actuatorconfigfilename);
    ////{{임시생성 추후 삭제
    if (actinfolist === null) {
      actinfolist=[];
      let act1 = new ActuatorBasic("구동기1",0);
      let act2 = new ActuatorBasic("구동기2",1);
      actinfolist.push(act1);
      actinfolist.push(act2);
      KDCommon.Writefilejson(actuatorconfigfilename, actinfolist);
      actinfolist = KDCommon.Readfilejson(actuatorconfigfilename);
    } 
     ////}} 임시생성  

    sysinfo.Actuators = actinfolist;
    for (const minfo of actinfolist) {
      this.Actuators.push(new Actuatordevice(minfo));
    }

  } 
  //상태 갱신
  async stateupdate(actuatorlist, curactnode) {

    for (const actd of this.Actuators) {
      for (const readactdev of actuatorlist) {
        if(actd.UniqID === readactdev.Uid)
        {
          actd.AStatus.Sat = readactdev.Sat;
          actd.AStatus.Opid = readactdev.Opid;
          actd.AStatus.Rmt = readactdev.Rmt;
          //console.log("-stateupdate uid: " + actd.UniqID + " , staus: "+actd.AStatus.Sat + ", opid :"+actd.AStatus.Opid  + ", ch: " + actd.Basicinfo.Channel);

          //현장수동모드이면 
          if(readactdev.Sat === 299)
          {
            actd.AStatus.Opm ="LM";
          }
          else{// 기존값 자동 수동 변경
            actd.AStatus.Opm =actd.AOperation.Opmode;
          }

          //읽은 opid 가  마지막 명령어 opid 와 다르다면 명령어 처리가 안된상태거나  컨트롤러보드 리셋됨, 다시 명령어 전송
          if( actd.AOperation.Opid !== actd.AStatus.Opid && actd.AStatus.Opm !=="LM" )
          {
            await  curactnode.ControlNormal(actd.AOperation, actd.Basicinfo.Channel); 
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

      if (alist) {
        await  this.stateupdate(alist,anode);
      }
    }
  }
  // 그냥테스트 함수
  setcontrolbychannel(opchannel, mcmd, mtimesec)
  {
    for (const actd of this.Actuators) {
      if(actd.Basicinfo.Channel === opchannel)
      {
        actd.AOperation.setoperation(mcmd,mtimesec,0,"MA");
      }
    }
  }
  setoperation(mloperation, opmode)
  {
    for (const actd of this.Actuators) {
      if(actd.UniqID === mloperation.Uid)
      {
        actd.AOperation.setoperation(mloperation.Opcmd,mloperation.Timesec,mloperation.Param,opmode);
      }
    }
 }

  // 수동제어 
  setoperationmanual(manualoperation)
  {
    this.setoperation (manualoperation,"MA");
    
 }


  setoperationAuto(autooperationlist)
  {
    for (const mopcmd of autooperationlist) {
      this.setoperation (mopcmd,"AT");
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



  
}



