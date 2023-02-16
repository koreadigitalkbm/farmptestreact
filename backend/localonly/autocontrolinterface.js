//구동기 노드에 대한 인터페이스 클래스

const KDCommon = require("../kdcommon");
const AutoControlUtil = require("../../frontend/myappf/src/commonjs/autocontrolutil");
const KDDefine          = require("../../frontend/myappf/src/commonjs/kddefine");
const AutoControl = require("./autocontrol");



module.exports = class AutoControlInterface {
  constructor(mmain) {
    this.mMain= mmain;
    this.mAutoControllist = []; //자동제어 목록

    //자동제어 목록을 가져옴.
    this.Autocontrolload();
  }

  // 전체 자동제어목록을 확인하고 상태가 변경되면 구동기명령어를 리턴함. 
  getOpsByControls() {
    let opcmdlist = [];
    const totalsec = KDCommon.getCurrentTotalsec();
    for (const mactl of this.mAutoControllist) {
          let mlist = mactl.getOperationsByControl(this.mMain.sensorinterface.mSensors, this.mMain.actuatorinterface.Actuators);
          opcmdlist.push(...mlist);
          if(mactl.NewEvent !=null)
          {
            
            this.mMain.setSystemevent(mactl.NewEvent);
            //이벤트 저장햇으면 삭제
            mactl.NewEvent=null;

          }
    }

    return opcmdlist;
  }

  // 카메라 촬영 자동제어
  getOpsForCamera() {
    let opcmdlist = [];
    const totalsec = KDCommon.getCurrentTotalsec();
    for (const mactl of this.mAutoControllist) {
          let mlist = mactl.getOperationsforcamera();
          opcmdlist.push(...mlist);
    }

    return opcmdlist;
  }
  //자동제어 설정을 리셋하고 초기값으로 되돌린다.
  async AutocontrolReset() {

    await KDCommon.Deletefile(KDCommon.autocontrolconfigfilename);

    this.Autocontrolload();

  }


  //자동제어 설정변경저장하고 다시 표시함.
  AutocontrolUpdate(isonlyoneitem) {
    let isnew = true;
    if (isonlyoneitem == null) {
      return;
    }

    for (let i = 0; i < this.mAutoControllist.length; i++) {
      let ma = this.mAutoControllist[i];
      if (ma.mConfig.Uid === isonlyoneitem.Uid) {
        //설정이 변경되면 내용만 복사하고 상태는 초기화한다. 다시 제어되도록
        this.mAutoControllist[i] = new AutoControl(isonlyoneitem);
        isnew = false;
        console.log("AutocontrolUpdat: " + isonlyoneitem.Uid + ",name : " + ma.mConfig.Name);

        break;
        
      }
    }
    //목록에 없으면 새로 만든거임
    if (isnew == true) {
      this.mAutoControllist.push(new AutoControl(isonlyoneitem));
    }


    //자동제어 목록저장
    let mcfglist = [];
    for (const mactl of this.mAutoControllist) {
      mcfglist.push(mactl.mConfig);
    }
    KDCommon.Writefilejson(KDCommon.autocontrolconfigfilename, mcfglist);


    
  }

  // 자동제어불러옴
  Autocontrolload() {
    let mcfglist = KDCommon.Readfilejson(KDCommon.autocontrolconfigfilename);

    if (mcfglist === null) {
      console.log("Autocontrollad  default set");

      mcfglist = AutoControlUtil.CreateDefaultConfig(this.mMain.localsysteminformations.Systemconfg.productmodel);
      KDCommon.Writefilejson(KDCommon.autocontrolconfigfilename, mcfglist);
    }

    ////{{ 자동제어 테스트로 임시로 생성 나중에 지움
    //let t1 = AutoControlUtil.getTestconfig();
    //mcfglist.push(t1);
    /////}}}}

    ///전체 읽어옴
    this.mAutoControllist = [];
    for (const mcfg of mcfglist) {
      this.mAutoControllist.push(new AutoControl(mcfg));
      console.log("Autocontrollad load: " + mcfg.Uid + ",name : " + mcfg.Name);
    }

    
  }

  //자동제어의 설정만 리턴함
  getautocontrolconfigall() {
    
    let Autocfgs = [];
    for (const mactl of this.mAutoControllist) {
      Autocfgs.push(mactl.mConfig);
    }
    return Autocfgs;

    //console.log("updatesysteminfo : " + Autocfgs.length);
  }
};
