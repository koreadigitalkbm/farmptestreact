

const color = require('colors');

const ModbusRTU = require("modbus-serial");
const ModbusComm = new ModbusRTU();

const KDCommon = require("./kdcommon");
const Systemconfig = require("../frontend/myappf/src/commonjs/devsystemconfig");

const backGlobal = require("./backGlobal");

const SensorInterface = require("./sensorinterface.js");
const ActuatorInterface = require("./actuatorinterface.js");
const AutoControlInterface = require("./autocontrolinterface");
const DailyCurrentDatas = require("./dailydatas");
const SystemInformations = require("../frontend/myappf/src/commonjs/systeminformations");

var mSensorintf;
var mActuatorintf;
var mAutocontrolintf;
var mDailyData;

var mAutoControllist = []; //자동제어


/**
 * 
 * 단일쓰레드 이므로 전역변수 충돌로인한 문제 없음.
 * 
 */
 global.mainObj = {
  gpio : [],
  actuator_list : []


}




function deviceInit() {
  console.log("------------deviceInit------------------- ");
  let sconfig = KDCommon.Readfilejson(KDCommon.systemconfigfilename);
  if (sconfig === null) {
    sconfig = new Systemconfig();
    KDCommon.Writefilejson(KDCommon.systemconfigfilename, sconfig);
  }
  backGlobal.localsysteminformations = new SystemInformations();
  backGlobal.localsysteminformations.Systemconfg = sconfig;

  console.log("deviceuniqid : " + backGlobal.localsysteminformations.Systemconfg.deviceuniqid + " comport : " + backGlobal.localsysteminformations.Systemconfg.comport);
  console.log("device model : " + backGlobal.localsysteminformations.Systemconfg.productmodel);

  return backGlobal.localsysteminformations.Systemconfg.deviceuniqid;
}

// 노드 단일쓰레드이기때문에 함수를 여러개 구별할 필요 없음 하나의 루프에서 다 해결해야함.
//통신포트를 사용하는 함수들은 여기서 호출, 구현이 복잡하니 단일 통신포트롤  모든 기능이 되도록 해보자.
async function devicemaintask() {
  console.log("------------main start-------------------");
  let last_minute = 0;

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

      // console.log( '       '.bgMagenta, backGlobal.localsysteminformations  )

      await ModbusComm.setTimeout(200);
      mSensorintf = new SensorInterface(backGlobal.localsysteminformations, ModbusComm);

      mActuatorintf = new ActuatorInterface(backGlobal.localsysteminformations, ModbusComm);

      mAutocontrolintf = new AutoControlInterface();
      mDailyData = new DailyCurrentDatas();

      backGlobal.dailydatas = mDailyData;
      backGlobal.sensorinterface = mSensorintf;
      backGlobal.actuatorinterface = mActuatorintf;
      backGlobal.autocontrolinterface = mAutocontrolintf;

      backGlobal.systemlog.memlog("초기화 완료.. 자동제어목록갯수: " + mAutocontrolintf.mAutoControllist.length);

      while (true) {
        await mSensorintf.ReadSensorAll();
        await KDCommon.delay(500);

        await mActuatorintf.ReadStatus();
        await KDCommon.delay(500);

        let opcmdlist = mAutocontrolintf.getOpsByControls();
        mActuatorintf.setoperationAuto(opcmdlist);
        await KDCommon.delay(500);

        for (const msensor of mSensorintf.mSensors) {
          //    console.log("read sensor ID: " + msensor.UniqID + ", value:"+ msensor.GetValuestring(true,true));
        }

        //
        {
          const date = new Date();
          const curminute = date.getMinutes();
          if (last_minute != curminute) {
            last_minute = curminute;
            backGlobal.dailydatas.updateSensor(mSensorintf.getsensorssimple());
          }
        }
      }
    } 
  } catch (error) {
    backGlobal.systemlog.memlog(" maintask  catch error : " + error.toString());
  } finally {
    console.log("------------main stop by error finally-------------------");
    //에러발생시 20 초후 다시시작  천천히 시작해야 로그기록을 볼수 있음.
    setTimeout(devicemaintask, 20000);
  }


}



setInterval(() => {     // mhlee for debugging...
  try {
    for(let i=0; i<mainObj.actuator_list.length; i++) {
      mainObj.gpio[i] = mainObj.actuator_list[i].Sat
    }
    console.log( mainObj.gpio.slice(0, 12).join(',').brightCyan )     
  } 
  catch (error) {
    console.log( error )      
    
  }
}, 1000 );




exports.deviceInit = deviceInit;
exports.devicemaintask = devicemaintask;
