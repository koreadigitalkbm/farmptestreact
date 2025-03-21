//구동기 노드에 대한 인터페이스 클래스
const ActuatorNode = require("./actuatornode.js");
const Actuatordevice = require("./actuatordevice");

const ActuatorStatus = require("../../frontend/myappf/src/commonjs/actuatorstatus.js");

const ActuatorBasic = require("../../frontend/myappf/src/commonjs/actuatorbasic.js");
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("../kdcommon");

const CameraInterface = require("./camerainterface");

var exec = require("child_process").exec;

const color = require("colors");

module.exports = class ActuatorInterface {
  constructor(mmain) {
    this.mMain = mmain;
    this.ActuatorNodes = []; // 구동기노드 리스트
    this.Actuators = []; // 구동기목록
    this.modbusMaster = this.mMain.ModbusComm; //통신포트
    //카메라 촬영준비 시간 이 변수를 설정하면 카메라 촬영모드로 동작시킴.
    this.cameracapturecount = 0;
    this.cameramanualcapturefilepath=null;
    this.iskpc480=false; //KPC480 장비일경우 예외처리

    //console.log("       ".bgMagenta, this.mMain.localsysteminformations);

    //
    let actuatorconfigfilename = KDCommon.actuatorconfigfilename;

    ///모델별로 구별해서 구동기노드를  설정하자.
    if (this.mMain.localsysteminformations.Systemconfg.productmodel === KDDefine.PModel.KPC880E) {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC880, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc880e;

    }
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === KDDefine.PModel.KPC880D) {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC880, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc880d;

    }
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === KDDefine.PModel.KPC880B) {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC880, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc880b;

    }
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === KDDefine.PModel.KPC880NB) {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC880, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc880nb;

    }
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === KDDefine.PModel.KPC880TB) {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC880, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc880tb;

    }
    
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === KDDefine.PModel.KPC880A) {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC880, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc880a;

    }
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === "KPC480") {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC480, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc480;

      this.iskpc480=true;

    }
    else if (this.mMain.localsysteminformations.Systemconfg.productmodel === "KPC300") {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC300, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc300;

    } else if (this.mMain.localsysteminformations.Systemconfg.productmodel === "KPC200") {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_KPC200, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_kpc200;
    } else if (this.mMain.localsysteminformations.Systemconfg.productmodel === "VFC3300") {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_VFC3300, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
      //장비별로 따로
      actuatorconfigfilename = KDCommon.actuatorconfigfilename_vfc3300;
    } else {
      const myactnode_1 = new ActuatorNode(1, ActuatorNode.ACTNODEType.ANT_VFC24M, this.modbusMaster);
      this.ActuatorNodes.push(myactnode_1);
    }

    let actinfolist = KDCommon.Readfilejson(actuatorconfigfilename);
    ////설정파일이 없으면 디폴트로 생성
    if (actinfolist === null) {
      actinfolist = ActuatorBasic.CreateDefaultActuator(this.mMain.localsysteminformations.Systemconfg.productmodel);
      KDCommon.Writefilejson(actuatorconfigfilename, actinfolist);
      actinfolist = KDCommon.Readfilejson(actuatorconfigfilename);
    }
    ///

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
            actd.AStatus.Opm = KDDefine.OPMode.OPM_Local;
          } else {
            // 기존값 유지, 자동,수동 변경
            actd.AStatus.Opm = actd.AOperation.Opmode;
          }
          //읽은 opid 가  마지막 명령어 opid 와 다르다면 명령어 처리가 안된상태거나  컨트롤러보드 리셋됨, 다시 명령어 전송
          //console.log("-stateupdate uid: " + actd.UniqID + " , staus: " + actd.AStatus.Sat + ", opid :" + actd.AStatus.Opid + ", LastCompleteOPID: " + actd.LastCompleteOPID);

          if (actd.AOperation.Opid !== actd.AStatus.Opid && actd.AStatus.Opm !== KDDefine.OPMode.OPM_Local) {
            await curactnode.ControlNormal(actd.AOperation, actd.Basicinfo.Channel);
          } else {
            let newevt = actd.getEventwithCheck(this.mMain.autocontrolinterface.getDatenowformatWithTimezone() );
            if (newevt != null) {
              this.mMain.setSystemevent(newevt);
              //console.log("-stateupdate uid: " + actd.UniqID + " , staus: " + actd.AStatus.Sat + ", opid :" + actd.AStatus.Opid + ", LastCompleteOPID: " + actd.LastCompleteOPID);
            }
          }


          break;
        }
      }
    }
  }

  //구동기 상태를 읽은후 구동기의 동작상태와 비교해서 작동시킴.
  async ReadStatus() {
    for (const anode of this.ActuatorNodes) {
      if (this.cameracapturecount > 0) {
        this.cameracapturecount--;
        console.log("ReadStatus cameracapturecount:" + this.cameracapturecount);
        await anode.FixedLEDon(this.iskpc480);
      } else {
        let alist = await anode.ReadStatusAll();
        if (alist) {
          await this.stateupdate(alist, anode);
        }
      }
    }
  }

  // 그냥테스트 함수
  setcontrolbychannel(opchannel, mcmd, mtimesec) {
    for (const actd of this.Actuators) {
      if (actd.Basicinfo.Channel === opchannel) {
        actd.AOperation.setoperation(mcmd, mtimesec, 0, KDDefine.OPMode.OPM_Manual);
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

  //카메라 촬영시 바드시 LED 켜야함으로
  async LEDonforcamera(isdirect) {
    
    let timeoutmsec=6000;

    //로컬메인함수에서 호출될경우 명령어 바로보냄
    if(isdirect ==true)
    {
      for (const anode of this.ActuatorNodes)
      {
        await anode.FixedLEDon(this.iskpc480);
      }
      timeoutmsec=3000;
    }
    else{
      /// 메뉴얼 촬영이면 http  콜백함수이므로 메인루프에서 제어되도록 해야함.
      this.cameracapturecount = 6;
      timeoutmsec=6000;
    }
    
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(""), timeoutmsec);
    });

    return await promise;
  }

  async setRTCTime(mmin) {
    
    
      for (const anode of this.ActuatorNodes)
      {
        await anode.SetRTCTimeTotalminute(mmin);
      }
     
  }

  async CaptureImagewithLED(islocal, cameratype)
  {
    await this.LEDonforcamera(islocal );
    const lawimg = await CameraInterface.CaptureStillimage(this.iskpc480,cameratype);
    // this.cameracapturecount = 0;
    console.log("CapturImagewithLED ", 'size is : ', lawimg.length);

    return lawimg;

  }


  async cameraoperation(mops) {
    console.log("cameraoperation  Uid :  " + mops.Uid + " Opmode:  " + mops.Opmode + " param: " + mops.Param);

    let filename = mops.Param;

    try {
      let filepath = "../frontend/myappf/public/cameraimage/" + this.mMain.mydeviceuniqid + "/manual/";

      if (mops.Opmode === true) {
        
        const lawimg = await this.CaptureImagewithLED(false,KDDefine.CameraType.CT_MANUAL);
        
        if (lawimg != null) {

          //수동촬영은 한장만 있으면 됨으로 기존촬영파일 삭제
          KDCommon.removeallfiles(filepath);
          KDCommon.mkdirRecursive(filepath);
          filepath = filepath + filename;
          KDCommon.WritefileBase64(filepath, lawimg);
          /// 썸네일 이미지도 만들자 나중에
          filepath = filepath.replace(".jpg", "_thum.jpg");
          KDCommon.WritefileBase64(filepath, lawimg);

          //  //서버로 보냄
          await this.mMain.mAPI.setcameradatatoserver(this.mMain.mydeviceuniqid, "time", 1, filename, lawimg, false);
        }
      } else {
        // 수동촬영된 사진을  일반사진처럼 저장하고 디비에도 저장하고 서버에도 저장한다.
        
        this.cameramanualcapturefilepath=filepath + mops.Param;
        console.log("cameraoperation  manualsave : "+ this.cameramanualcapturefilepath);

      }
    } catch (error) {
      console.log(color.bgRed(error));
    }

    //사진촬영
  }
/*
  // 수동제어
  setoperationmanual(manualoperation) {
    //카메라 촬영 별도로
    if (manualoperation.Opcmd == KDDefine.ONOFFOperationTypeEnum.OPT_Camera_TakeSave) {
      this.cameraoperation(manualoperation);
    } else {
      this.setACToperation(manualoperation, KDDefine.OPMode.OPM_Manual);
    }
  }
*/
  setoperationmanual(manualoperation) {
    if (Array.isArray(manualoperation)) {
        // 배열인 경우 각 요소를 반복 처리
        manualoperation.forEach(operation => this.processOperationmanual(operation));
    } else {
        // 단일 객체인 경우 처리
        this.processOperationmanual(manualoperation);
    }
}

  // 개별 operation 처리 로직을 별도 함수로 분리
processOperationmanual(operation) {
  if (operation.Opcmd === KDDefine.ONOFFOperationTypeEnum.OPT_Camera_TakeSave) {
      this.cameraoperation(operation);
  } else {
      this.setACToperation(operation, KDDefine.OPMode.OPM_Manual);
  }
}

  //자동제어
  setoperationAuto(autooperationlist) {
    for (const mopcmd of autooperationlist) {
      this.setACToperation(mopcmd, KDDefine.OPMode.OPM_Auto);
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
