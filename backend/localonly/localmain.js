// 백엔드 장비에서 구동되는 로직전부

const color = require("colors");
const ModbusRTU = require("modbus-serial");
const ModbusComm = new ModbusRTU();

const moment =require("moment");

const KDCommon = require("../kdcommon");

const SensorInterface = require("./sensorinterface.js");
const ActuatorInterface = require("./actuatorinterface.js");
const AutoControlInterface = require("./autocontrolinterface");
const DailyCurrentDatas = require("./dailydatas");

const DatabaseInterface = require("../dbinterface");
const devicesystemlog = require("./devicesystemlog");
const LocalAPI = require("./localapi");

const Systemconfig = require("../../frontend/myappf/src/commonjs/devsystemconfig");
const SystemInformations = require("../../frontend/myappf/src/commonjs/systeminformations");


var dbinf = new DatabaseInterface();

// 노드 단일쓰레드이기때문에 함수를 여러개 구별할 필요 없음 하나의 루프에서 다 해결해야함.
//통신포트를 사용하는 함수들은 여기서 호출, 구현이 복잡하니 단일 통신포트롤  모든 기능이 되도록 해보자.
async function devicemaintask(mainclass) {
  console.log("------------main start-------------------" + mainclass.systemlog);
  let last_minute = 0;

  try {
    mainclass.systemlog.memlog("devicemaintask start");

    if (ModbusComm.isOpen == false) {
      var mconn = ModbusComm.connectRTUBuffered(mainclass.localsysteminformations.Systemconfg.comport, {
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
      // console.log( '       '.bgMagenta, mainclass.localsysteminformations  )

      await ModbusComm.setTimeout(200);
      // 메인 루프코드에서 에러가 나면 모든 객체를 다시 생성하자.
      mainclass.sensorinterface = new SensorInterface(mainclass.localsysteminformations, ModbusComm);
      mainclass.actuatorinterface = new ActuatorInterface(mainclass.localsysteminformations, ModbusComm, mainclass);
      mainclass.autocontrolinterface = new AutoControlInterface(mainclass);
      mainclass.dailydatas = new DailyCurrentDatas();

      mainclass.systemlog.memlog("초기화 완료.. 자동제어목록갯수: " + mainclass.autocontrolinterface.mAutoControllist.length);

      while (true) {
        await mainclass.sensorinterface.ReadSensorAll();
        await KDCommon.delay(500);

        await mainclass.actuatorinterface.ReadStatus();
        await KDCommon.delay(500);

        let opcmdlist = mainclass.autocontrolinterface.getOpsByControls();

        mainclass.actuatorinterface.setoperationAuto(opcmdlist);
        await KDCommon.delay(500);

        for (const msensor of mainclass.sensorinterface.mSensors) {
       //   console.log("read sensor ID: " + msensor.UniqID + ", value:" + msensor.GetValuestring(true, true));
        }

        //1분 단위로 먼가 처리하는 루틴
        {
          const date = new Date();
          const curminute = date.getMinutes();
          if (last_minute != curminute) {
            last_minute = curminute;
            let simplesensors=mainclass.sensorinterface.getsensorssimple();

            mainclass.dailydatas.updateSensor(simplesensors);

            const curdatetime= moment().local().format('YYYY-MM-DD HH:mm:ss');

            mainclass.mAPI.setsensordatatoserver(mainclass.localsysteminformations.Systemconfg.deviceuniqid,curdatetime,simplesensors);

            dbinf.setsensordata(mainclass.localsysteminformations.Systemconfg.deviceuniqid, curdatetime, mainclass.sensorinterface.mSensors);

          }
        }
      }
    }
  } catch (error) {
    mainclass.systemlog.memlog(" maintask  catch error : " + error.toString());
  } finally {
    console.log("------------main stop by error finally-------------------");
    //에러발생시 20 초후 다시시작  천천히 시작해야 로그기록을 볼수 있음.
    setTimeout(devicemaintask, 20000, mainclass);
  }
}

module.exports = class LocalMain {
  constructor(fversion) {
    this.localsysteminformations = null;
    this.dailydatas = null;
    this.sensorinterface = null;
    this.actuatorinterface = null;
    this.autocontrolinterface = null;
    this.systemlog = new devicesystemlog();
    this.deviceInit();

    this.mAPI = new LocalAPI(fversion, this);

    //3초후 메인시작
    setTimeout(devicemaintask, 3000, this);
  }

  deviceInit() {
    console.log("------------deviceInit------------------- ");
    let sconfig = KDCommon.Readfilejson(KDCommon.systemconfigfilename);
    if (sconfig === null) {
      sconfig = new Systemconfig();
      KDCommon.Writefilejson(KDCommon.systemconfigfilename, sconfig);
    }
    this.localsysteminformations = new SystemInformations();
    this.localsysteminformations.Systemconfg = sconfig;

    console.log("deviceuniqid : " + this.localsysteminformations.Systemconfg.deviceuniqid + " comport : " + this.localsysteminformations.Systemconfg.comport);
    console.log("device model : " + this.localsysteminformations.Systemconfg.productmodel);
  }
};
