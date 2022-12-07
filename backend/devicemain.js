const ModbusRTU = require("modbus-serial");
const ModbusComm = new ModbusRTU();

const KDCommon = require("./kdcommon");
const Systemconfig = require("./devsystemconfig");
const backGlobal = require("./backGlobal");

const SensorInterface = require("./sensorinterface.js");
const ActuatorInterface = require("./actuatorinterface.js");
const Sensordevice = require("../frontend/myappf/src/commonjs/sensordevice");
const SystemInformations = require("../frontend/myappf/src/commonjs/systeminformations");

const systemconfigfilename = "../common/local_files/systemconfig.json";

//루프로 동작하는 함수에서 한개라도 에러가 발생하면 전체 함수를 재시작하기위해
var istaskStopByerror = false;

var mSensorintf;
var mActuatorintf;


function deviceInit() {
  console.log("------------deviceInit------------------- ");
  let sconfig = KDCommon.Readfilejson(systemconfigfilename);
  if (sconfig === null) {
    sconfig = new Systemconfig();
    KDCommon.Writefilejson(systemconfigfilename, sconfig);
  }
  backGlobal.localsysteminformations = new SystemInformations();
  backGlobal.localsysteminformations.Systemconfg=sconfig;

  console.log("deviceuniqid : ", backGlobal.localsysteminformations.Systemconfg.deviceuniqid + " comport : " + backGlobal.localsysteminformations.Systemconfg.comport);

  return backGlobal.localsysteminformations.Systemconfg.deviceuniqid;
}

async function devicemaintask() {
  istaskStopByerror = false;
  console.log("------------main start-------------------");
  backGlobal.systemlog.memlog("devicemaintask start");
 
  try {
    const promisearray = [modbusTask(), controltask()];
    await Promise.all(promisearray);

    console.log("------------main stop -------------------");
  } catch (error) {
    istaskStopByerror = true;
    console.error("maintask error : " + error.toString());
  } finally {
    console.log("------------main stop by error-------------------");

    //에러발생시 다시시작
    setTimeout(devicemaintask, 1000);
  }
}

//통신포트를 사용하는 함수들은 여기서 호출, 구현이 복잡하니 단일 통신포트롤  모든 기능이 되도록 해보자.
async function modbusTask() {
  let modbusTask_count = 0;

  console.log("------------modbusTask start-------------------");

   

  try {
    if (ModbusComm.isOpen == false) {
      var mconn = ModbusComm.connectRTUBuffered(backGlobal.localsysteminformations.Systemconfg.comport, {
        baudRate: 115200,
        stopBits: 1,
        dataBits: 8,
        parity: "none",
        flowControl: false,
      });

      var mmm = await mconn;
      console.info("connect comport : " + ModbusComm.isOpen);
    }
    if (ModbusComm.isOpen == true) {
      await ModbusComm.setTimeout(200);

      mSensorintf =new SensorInterface(backGlobal.localsysteminformations,ModbusComm);
      mActuatorintf=new ActuatorInterface(backGlobal.localsysteminformations,ModbusComm);

      backGlobal.sensorinterface = mSensorintf;
      backGlobal.actuatorinterface = mActuatorintf;



      while (true) {
        if (istaskStopByerror == true) {
          return "modbusTask";
        }
          
          modbusTask_count++;
      

          await mActuatorintf.ControlAll();
          await KDCommon.delay(500);
          await mSensorintf.ReadSensorAll();
          await KDCommon.delay(500);
          
          
          

//          for (const msensor of mSensorintf.mSensors) {
  //          console.log("read sensor: " + msensor.GetValuestring(true,true));
    //      }
          //backGlobal.systemlog.memlog("modbusTask run: " + modbusTask_count);
          //console.log("modbusTask run: " + modbusTask_count);

        
      }
    }
  } catch (error) {
    console.log("modbusTask : catch...... error:" + error.toString());
    istaskStopByerror = true;
    throw error;
  }

  return "modbusTask";
}

async function controltask() {
  let sec_count = 0;

  try {
    while (true) {
      await KDCommon.delay(1000);
      sec_count++;
        //console.log("controltask run: " + sec_count);
    }
  } catch (error) {
    console.log("controltask : catch...... ");
    istaskStopByerror = true;
    throw error;
  }

  return "controltask";
}

function getdevicestatusall(reponsemsg)
{

  
}

exports.deviceInit = deviceInit;
exports.devicemaintask = devicemaintask;
