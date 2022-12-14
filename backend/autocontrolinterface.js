//구동기 노드에 대한 인터페이스 클래스

const KDCommon = require("./kdcommon");
const AutoControlconfig = require("../frontend/myappf/src/commonjs/autocontrolconfig");
const AutoControlUtil = require("../frontend/myappf/src/commonjs/autocontrolutil");
const AutoControl = require("./autocontrol");
const backGlobal = require("./backGlobal");

module.exports = class AutoControlInterface {
  constructor() {
    this.mAutoControllist = []; //자동제어 목록
    //자동제어 목록을 가져옴.
    this.Autocontrolload();
  }

  getOpsByControls() {
    let opcmdlist = [];
    const totalsec = KDCommon.getCurrentTotalsec();
    for (const mactl of this.mAutoControllist) {
      let mlist = mactl.getOperationsByControl(backGlobal.sensorinterface.mSensors, backGlobal.actuatorinterface.Actuators);
      opcmdlist.push(...mlist);
    }

    return opcmdlist;
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


    this.updatesysteminfo();
  }

  // 자동제어불러옴
  Autocontrolload() {
    let mcfglist = KDCommon.Readfilejson(KDCommon.autocontrolconfigfilename);

    if (mcfglist === null) {
      mcfglist = AutoControlUtil.CreateDefaultConfig(backGlobal.localsysteminformations.Systemconfg.productmodel);
      KDCommon.Writefilejson(KDCommon.autocontrolconfigfilename, mcfglist);
    }

    ////{{ 자동제어 테스트로 임시로 생성 나중에 지움
    let t1 = AutoControlUtil.getTestconfig();
    mcfglist.push(t1);
    /////}}}}

    ///전체 읽어옴
    this.mAutoControllist = [];
    for (const mcfg of mcfglist) {
      this.mAutoControllist.push(new AutoControl(mcfg));
      console.log("Autocontrollad load: " + mcfg.Uid + ",name : " + mcfg.Name);
    }

    this.updatesysteminfo();
  }

  updatesysteminfo() {
    //전역변수에 자동제어 설정 저장
    backGlobal.Autocontrolcfg = [];
    for (const mactl of this.mAutoControllist) {
      backGlobal.Autocontrolcfg.push(mactl.mConfig);
    }

    //console.log("updatesysteminfo : " + backGlobal.Autocontrolcfg.length);
  }
};
