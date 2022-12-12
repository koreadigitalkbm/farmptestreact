
//구동기 노드에 대한 인터페이스 클래스

const KDCommon = require("./kdcommon");
const AutoControlconfig = require("../frontend/myappf/src/commonjs/autocontrolconfig");
const AutoControlUtil = require("../frontend/myappf/src/commonjs/autocontrolutil");
const AutoControl = require("./autocontrol");
const backGlobal = require("./backGlobal");

module.exports =  class AutoControlInterface{
   
  constructor() {
      
    this.mAutoControllist = []; //자동제어 목록
    //자동제어 목록을 가져옴.
    this.Autocontrolload(null);
          

  } 
  
  
getOpsByControls()
{
  let opcmdlist=[];
  const totalsec = KDCommon.getCurrentTotalsec();
  for (const mactl of this.mAutoControllist) {
    let mlist= mactl.getOperationsByControl(backGlobal.sensorinterface.mSensors,backGlobal.actuatorinterface.Actuators);
    opcmdlist.push(...mlist);
   }

   return opcmdlist;

}


 Autocontrolload(isonlyoneitem) {
  let mcfglist = KDCommon.Readfilejson(KDCommon.autocontrolconfigfilename);


  if (mcfglist === null) {
    mcfglist = AutoControlUtil.CreateDefaultConfig(backGlobal.localsysteminformations.Systemconfg.productmodel)
    KDCommon.Writefilejson(KDCommon.autocontrolconfigfilename, mcfglist);
  }

  
    ////{{ 자동제어 테스트로 임시로 생성 나중에 지움
    let t1=AutoControlUtil.getTestconfig();
    mcfglist.push(t1);
  /////}}}} 


  ///전체 다시 로드
  if (isonlyoneitem === null) {
    this.mAutoControllist = [];
    for (const mcfg of mcfglist) {
      this.mAutoControllist.push(new AutoControl(mcfg));
      console.log("Autocontrolload load: " + mcfg.Uid + ",name : " + mcfg.Name);
    }
  } else {
    //특정 한개만 다시로드  설정이 변경되었을경우 
    let isnew=true;
    for (let i = 0; i < this.mAutoControllist.length; i++) {
      let ma = this.mAutoControllist[i];
      if (ma.mConfig.Uid === isonlyoneitem.Uid) {
        this.mAutoControllist[i] = new AutoControl(isonlyoneitem);
        isnew=false;
        break;
        console.log("Autocontrolload reload: " + isonlyoneitem.Uid + ",name : " + ma.mConfig.Name);
      }
    }
    //목록에 없으면 새로 만든거임
    if(isnew ==true)
    {
      this.mAutoControllist.push(new AutoControl(isonlyoneitem));
    }
  }

  this.updatesysteminfo();

}

updatesysteminfo()
{
  //전역변수에 자동제어 설정 저장
  backGlobal.localsysteminformations.Autocontrolcfg=[];
  for (const mactl of this.mAutoControllist) {
    backGlobal.localsysteminformations.Autocontrolcfg.push(mactl.mConfig);  
   }

   //console.log("updatesysteminfo : " + backGlobal.localsysteminformations.Autocontrolcfg.length);

  
}


  
}



