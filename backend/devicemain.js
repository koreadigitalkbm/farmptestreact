const ModbusRTU = require("modbus-serial");
const ModbusComm = new ModbusRTU();

const KDCommon = require("./kdcommon");
const Systemconfig = require("../frontend/myappf/src/commonjs/devsystemconfig");
const AutoControlconfig = require("../frontend/myappf/src/commonjs/autocontrolconfig");
const AutoControl = require("./autocontrol");
const backGlobal = require("./backGlobal");

const SensorInterface = require("./sensorinterface.js");
const ActuatorInterface = require("./actuatorinterface.js");
const SystemInformations = require("../frontend/myappf/src/commonjs/systeminformations");

var mSensorintf;
var mActuatorintf;
var mAutoControllist = []; //자동제어

function deviceInit() {
  console.log("------------deviceInit------------------- ");
  let sconfig = KDCommon.Readfilejson(KDCommon.systemconfigfilename);
  if (sconfig === null) {
    sconfig = new Systemconfig();
    KDCommon.Writefilejson(KDCommon.systemconfigfilename, sconfig);
  }
  backGlobal.localsysteminformations = new SystemInformations();
  backGlobal.localsysteminformations.Systemconfg = sconfig;

  console.log("deviceuniqid : ", backGlobal.localsysteminformations.Systemconfg.deviceuniqid + " comport : " + backGlobal.localsysteminformations.Systemconfg.comport);

  return backGlobal.localsysteminformations.Systemconfg.deviceuniqid;
}

// 노드 단일쓰레드이기때문에 함수를 여러개 구별할 필요 없음 하나의 루프에서 다 해결해야함.
//통신포트를 사용하는 함수들은 여기서 호출, 구현이 복잡하니 단일 통신포트롤  모든 기능이 되도록 해보자.
async function devicemaintask() {
  console.log("------------main start-------------------");

  try {
    backGlobal.systemlog.memlog("devicemaintask start");

    if (ModbusComm.isOpen == false) {
      var mconn = ModbusComm.connectRTUBuffered(backGlobal.localsysteminformations.Systemconfg.comport, {
        baudRate: 115200,
        stopBits: 1,
        dataBits: 8,
        parity: "none",
        flowControl: false,
      });
      await mconn;
      console.info("connect comport : " + ModbusComm.isOpen);
    }
    if (ModbusComm.isOpen == true) {
      await ModbusComm.setTimeout(200);
      mSensorintf = new SensorInterface(backGlobal.localsysteminformations, ModbusComm);
      mActuatorintf = new ActuatorInterface(backGlobal.localsysteminformations, ModbusComm);
      backGlobal.sensorinterface = mSensorintf;
      backGlobal.actuatorinterface = mActuatorintf;

      //장비 초기화 잘 되었으면 자동제어 목록을 가져옴.
      Autocontrolload(null);

      backGlobal.systemlog.memlog("초기화 완료.. 자동제어목록갯수: " + mAutoControllist.length);

      while (true) {
        await mSensorintf.ReadSensorAll();
        await KDCommon.delay(500);

        await mActuatorintf.ReadStatus();
        await KDCommon.delay(500);

        const clocknow = new Date();
        const totalsec = clocknow.getHours() * 3600 + clocknow.getMinutes() * 60 + clocknow.getSeconds();
        let opcmdlist=[];
        for (const mactl of mAutoControllist) {
          if (mactl.ischangebycontrol(mSensorintf.mSensors, totalsec) === true) {
          }
        }
        mActuatorintf.setoperationAuto(opcmdlist);

        //          for (const msensor of mSensorintf.mSensors) {
        //          console.log("read sensor: " + msensor.GetValuestring(true,true));
        //      }
        //backGlobal.systemlog.memlog("modbusTask run: " + modbusTask_count);
        //console.log("modbusTask run: " + modbusTask_count);
      }
    }
  } catch (error) {
    console.error("maintask  catch error : " + error.toString());
  } finally {
    console.log("------------main stop by error finally-------------------");
    //에러발생시 다시시작
    setTimeout(devicemaintask, 1000);
  }
}

function Autocontrolload(isonlyoneitem) {
  let mcfglist = KDCommon.Readfilejson(KDCommon.autocontrolconfigfilename);

  ////{{ 자동제어 테스트로 임시로 생성 나중에 지움
  if (mcfglist === null) {
    let m1 = new AutoControlconfig();
    let m2 = new AutoControlconfig();
    mcfglist = [];
    mcfglist.push(m1);
    mcfglist.push(m2);
    KDCommon.Writefilejson(KDCommon.autocontrolconfigfilename, mcfglist);
  }
  /////}}}} 

  ///전체 다시 로드
  if (isonlyoneitem === null) {
    mAutoControllist = [];
    for (const mcfg of mcfglist) {
      mAutoControllist.push(new AutoControl(mcfg));
      console.log("Autocontrolload load: " + mcfg.Uid + ",name : " + mcfg.Name);
    }
  } else {
    //특정 한개만 다시로드  설정이 변경되었을경우 

    for (let i = 0; i < mAutoControllist.length; i++) {
      let ma = mAutoControllist[i];
      if (ma.mConfig.Uid === isonlyoneitem.Uid) {
        mAutoControllist[i] = new AutoControl(isonlyoneitem);
        console.log("Autocontrolload reload: " + isonlyoneitem.Uid + ",name : " + ma.mConfig.Name);
      }
    }
    //목록에 없으면 새로 만든거임
    mAutoControllist.push(new AutoControl(isonlyoneitem));
  }
}

function getdevicestatusall(reponsemsg) {}

exports.deviceInit = deviceInit;
exports.devicemaintask = devicemaintask;
