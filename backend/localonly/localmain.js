// 백엔드 장비에서 구동되는 로직전부

const color = require("colors");
const moment = require("moment");
const ModbusRTU = require("modbus-serial");

const KDCommon = require("../kdcommon");
const SensorInterface = require("./sensorinterface.js");
const ActuatorInterface = require("./actuatorinterface.js");
const AutoControlInterface = require("./autocontrolinterface");
const DailyCurrentDatas = require("./dailydatas");
const DatabaseInterface = require("../dbinterface");
const devicesystemlog = require("../devicesystemlog");
const LocalAPI = require("./localapi");
const CameraInterface = require("./camerainterface");
const Systemconfig = require("../../frontend/myappf/src/commonjs/devsystemconfig");
const SystemInformations = require("../../frontend/myappf/src/commonjs/systeminformations");

const BackLocalGlobal = require("./backGlobal");

// 노드 단일쓰레드이기때문에 함수를 여러개 구별할 필요 없음 하나의 루프에서 다 해결해야함.
//통신포트를 사용하는 함수들은 여기서 호출, 구현이 복잡하니 단일 통신포트롤  모든 기능이 되도록 해보자.
async function devicemaintask(mainclass) {
  console.log("------------main start-------------------");
  let last_minute = 0;
  let last_sec = 0;
  let last_hour = 0;
  let sec_step = 0;

  try {
    mainclass.systemlog.memlog("devicemaintask start");

    //통신 객체는 한번만 생성하자 여러번생성안됨.
    if (mainclass.ModbusComm == null) {
      mainclass.ModbusComm = new ModbusRTU();
    }

    if (mainclass.ModbusComm.isOpen == false) {
      var mconn = mainclass.ModbusComm.connectRTUBuffered(mainclass.localsysteminformations.Systemconfg.comport, {
        baudRate: 115200,
        stopBits: 1,
        dataBits: 8,
        parity: "none",
        flowControl: false,
      });
      await mconn;
      console.info("connect comport : " + mainclass.ModbusComm.isOpen);
    }
    if (mainclass.ModbusComm.isOpen == true) {
      // console.log( '       '.bgMagenta, mainclass.localsysteminformations  )

      await mainclass.ModbusComm.setTimeout(200);
      // 메인 루프코드에서 에러가 나면 모든 객체를 다시 생성하자.
      mainclass.sensorinterface = new SensorInterface(mainclass);
      mainclass.actuatorinterface = new ActuatorInterface(mainclass);
      mainclass.autocontrolinterface = new AutoControlInterface(mainclass);
      mainclass.localDBinterface = new DatabaseInterface(mainclass);
      mainclass.dailydatas = new DailyCurrentDatas();

      mainclass.systemlog.memlog("초기화 완료.. 자동제어목록갯수: " + mainclass.autocontrolinterface.mAutoControllist.length);

      while (true) {
        const date = new Date();

        //1초단위로 처리하는 함수
        {
          const cursec = date.getSeconds();
          if (last_sec != cursec) {
            last_sec = cursec;
            switch (sec_step) {
              case 0:
                await mainclass.sensorinterface.ReadSensorAll();
                for (const msensor of mainclass.sensorinterface.mSensors) {
                     console.log("read sensor ID: " + msensor.UniqID + ", value:" + msensor.GetValuestring(true, true));
                }
                sec_step++;
                break;
              case 1:
                await mainclass.actuatorinterface.ReadStatus();
                sec_step++;
                break;
              case 2:
                {
                  let opcmdlist = mainclass.autocontrolinterface.getOpsByControls();
                  mainclass.actuatorinterface.setoperationAuto(opcmdlist);
                  sec_step++;
                }
                break;

              default:
                sec_step = 0;
                break;
            }
          }
        }

        //1분 단위로 먼가 처리하는 루틴
        {
          const curminute = date.getMinutes();
          if (last_minute != curminute) {
            last_minute = curminute;
            let simplesensors = mainclass.sensorinterface.getsensorssimple();

            mainclass.dailydatas.updateSensor(simplesensors);
            const curdatetime = moment().local().format("YYYY-MM-DD HH:mm:ss");

            //로컬에 저장
            mainclass.localDBinterface.setsensordata(mainclass.mydeviceuniqid, curdatetime, mainclass.sensorinterface.mSensors);

            //서버로 보냄
            mainclass.mAPI.setsensordatatoserver(mainclass.mydeviceuniqid, curdatetime, simplesensors);

            //카메라 촬영, 카메라 자동제어확인후 시간이 됬으면 촬영후 저장
            let opcmdlist = mainclass.autocontrolinterface.getOpsForCamera();

            if(opcmdlist.length >0)
            {
              
              
              const curdatetime = moment().local().format("YYYY-MM-DD HH:mm:ss");
              let lawimg = CameraInterface.Captureimage();
              
              console.log("getOpsForCamera : " + opcmdlist[0] +" curdatetime:"+curdatetime);


              //로컬에 저장
              mainclass.localDBinterface.setimagefiledata(mainclass.mydeviceuniqid, curdatetime, 1, "BEG", lawimg);

              //서버로 보냄
              mainclass.mAPI.setcameradatatoserver(mainclass.mydeviceuniqid, curdatetime, 1, "BEG", lawimg);
            


            }


          }

          /*
          //한시간 단위로 먼가 처리하는 루틴
          {
            const curhour = date.getHours();
            if (last_hour != curhour) {
              last_hour = curhour;
              const curdatetime = moment().local().format("YYYY-MM-DD HH:mm:ss");
              let lawimg = CameraInterface.Captureimage();

              //로컬에 저장
              mainclass.localDBinterface.setimagefiledata(mainclass.mydeviceuniqid, curdatetime, 1, "BEG", lawimg);

              //서버로 보냄
              mainclass.mAPI.setcameradatatoserver(mainclass.mydeviceuniqid, curdatetime, 1, "BEG", lawimg);
            }
          }
*/

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
    this.sensorinterface = null;
    this.actuatorinterface = null;
    this.autocontrolinterface = null;
    this.localDBinterface = null;
    this.ModbusComm = null;
    this.dailydatas = null;
    this.systemlog = new devicesystemlog();
    this.mydeviceuniqid = "IF0000";

    // 시스템 기본 정보를 읽어옴.
    this.deviceInit();

    //장비 ID 는 여러군데서 사용하는 중요한 지표이므로  메인에 저장해둠.
    this.mydeviceuniqid = this.localsysteminformations.Systemconfg.deviceuniqid;
    this.mAPI = new LocalAPI(fversion, this);
    //전역변수로 필요한 객체저장
    BackLocalGlobal.systemlog = this.systemlog;

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

    console.log("deviceuniqid : " + BackLocalGlobal.mylocaldeviceid + " comport : " + this.localsysteminformations.Systemconfg.comport);
    console.log("device model : " + this.localsysteminformations.Systemconfg.productmodel);
  }

  //시스템에 이벤트가 발생하면 기록하고 서버로 보냄
  setSystemevent(mnewevt)
  {
    this.dailydatas.updateEvent(mnewevt);

    //로컬 db로 보냄
    
    //서버로 보냄

  }


};
