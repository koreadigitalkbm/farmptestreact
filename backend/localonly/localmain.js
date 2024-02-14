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
const AutoControlUtil = require("../../frontend/myappf/src/commonjs/autocontrolutil");
const Systemconfig = require("../../frontend/myappf/src/commonjs/devsystemconfig");
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const SystemInformations = require("../../frontend/myappf/src/commonjs/systeminformations");
const SystemEvent = require("./systemevent");

const BackLocalGlobal = require("../backGlobal");
const KDUtil = require("../../frontend/myappf/src/commonjs/kdutil");

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
      
      mainclass.setSystemevent(SystemEvent.createDevSystemEvent(mainclass.autocontrolinterface.getDatenowformatWithTimezone(),KDDefine.SysEventCode.SEC_Bootup), 0, 0);

      mainclass.systemlog.memlog("초기화 완료.. 자동제어목록갯수: " + mainclass.autocontrolinterface.mAutoControllist.length);

      while (true) {
       
        //1초단위로 처리하는 함수
        {
          const cursec = KDCommon.getSecondsonly();//date.getSeconds();
          if (last_sec != cursec) {
           // console.log("mainloop  sec_step: " + sec_step);
            last_sec = cursec;
            switch (sec_step) {
              case 0:
                await mainclass.sensorinterface.ReadSensorAll();

                //                for (const msensor of mainclass.sensorinterface.mSensors) {
                //                    console.log("read sensor ID: " + msensor.UniqID + ", value:" + msensor.GetValuestring(true, true));
                //              }
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
          const curminute = KDCommon.getMinutesonly(); //date.getMinutes();
          if (last_minute != curminute) {
            last_minute = curminute;

            const curdatetime = mainclass.autocontrolinterface.getDatenowformatWithTimezone();

            let simplesensors = mainclass.sensorinterface.getsensorssimple();

            mainclass.dailydatas.updateSensor(curdatetime,simplesensors);

          //  console.log("curdatetime : " +curdatetime);
          //  const newdatastr = mainclass.autocontrolinterface.getDatenowformatWithTimezone();
          //  const curdatetime =moment.utc().add(mainclass.localsysteminformations.Systemconfg.timezoneoffsetminutes, 'minutes').format("YYYY-MM-DD HH:mm:ss");
          //  console.log("newdatastr : " +newdatastr + " curdatetime : " + curdatetime +  " tz:" + moment.utc().format("YYYY-MM-DD HH:mm:ss"));

            //로컬에 저장
            mainclass.localDBinterface.setsensordata(mainclass.mydeviceuniqid, curdatetime, mainclass.sensorinterface.mSensors);

            //서버로 보냄
            mainclass.mAPI.setsensordatatoserver(mainclass.mydeviceuniqid, curdatetime, simplesensors);

            //카메라 촬영, 카메라 자동제어확인후 시간이 됬으면 촬영후 저장
            const opcmdlist = mainclass.autocontrolinterface.getOpsForCamera();

            if (opcmdlist.length > 0) {
              //LED 명령어 보내고 이미지 촬영될때 까지 기다림.
              let lawimg = null;

              if (opcmdlist[0] == "manualcapture") {
                lawimg = KDCommon.ReadfileBase64(mainclass.actuatorinterface.cameramanualcapturefilepath);
                mainclass.actuatorinterface.cameramanualcapturefilepath = null;
                console.log("cameramanaul save....");
              } else {
                lawimg = await mainclass.actuatorinterface.CaptureImagewithLED(true,opcmdlist[0]);
              }

              if (lawimg != null) {
                console.log("getOpsForCamera : " + opcmdlist[0] + " curdatetime:" + curdatetime);

                let camtype=1;
                          if(opcmdlist[0] == KDDefine.CameraType.CT_USB)
                          {
                            camtype=2;
                          }

                //로컬에 저장
                // 퍼플릭폴더에 있으므로 파일이름을 알면 이미지를 다운받을수 있기 때문에 뒤부분에 랜덤한 숫자로 10자리 표시
                let capfilename = "cameara_"+ "c"+camtype + "_t_" + curdatetime + "_" + KDUtil.GetRandom10() + ".jpg";
                capfilename = KDCommon.FilenameCheck(capfilename);

                
                          

                mainclass.localDBinterface.setimagefiledata(mainclass.mydeviceuniqid, curdatetime,camtype, capfilename, lawimg, true);
                //서버로 보냄
                mainclass.mAPI.setcameradatatoserver(mainclass.mydeviceuniqid, curdatetime, camtype, capfilename, lawimg, true);
                //최근데이터목록 갱신
                mainclass.dailydatas.updateCpatureimage(capfilename);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    mainclass.systemlog.memlog(" maintask  catch error : " + error.toString());
  } finally {
    console.log("------------main stop by error finally-------------------");
    //에러발생시 60 초후 다시시작  천천히 시작해야 로그기록을 볼수 있음.
    setTimeout(devicemaintask, 60000, mainclass);
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
    this.mydeviceuniqid = "IF0000";
    this.systemlog = new devicesystemlog();
    // 시스템 기본 정보를 읽어옴.
    this.deviceInit();
    //장비 ID 는 여러군데서 사용하는 중요한 지표이므로  메인에 저장해둠.
    this.mydeviceuniqid = this.localsysteminformations.Systemconfg.deviceuniqid;

    this.mAPI = new LocalAPI(fversion, this);
  }

  Inititalize() {
    

    this.mAPI.firebasedbsetup();

    //3초후 메인시작
    setTimeout(devicemaintask, 3000, this);
  }

  savesystemconfig(newconfig) {
    //저장하고 다시 읽어와 갱신
    console.log("---------------------------------savesystemconfig: " +newconfig);
    KDCommon.Writefilejson(KDCommon.systemconfigfilename, newconfig);
    this.localsysteminformations.Systemconfg = KDCommon.Readfilejson(KDCommon.systemconfigfilename);
  }

  savesystemaials(newalias) {
    //저장하고 다시 읽어와 갱신
    KDCommon.Writefilejson(KDCommon.systemaliasfilename, newalias);
    this.localsysteminformations.Alias = KDCommon.Readfilejson(KDCommon.systemaliasfilename);
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

    //별칭파일
    let malias = KDCommon.Readfilejson(KDCommon.systemaliasfilename);
    if (malias === null) {
      malias = AutoControlUtil.CreateDefaultAlias(sconfig.productmodel);
      KDCommon.Writefilejson(KDCommon.systemaliasfilename, malias);
    }
    this.localsysteminformations.Alias = malias;
    console.log("deviceuniqid : " + this.mydeviceuniqid + " comport : " + this.localsysteminformations.Systemconfg.comport);
    console.log("device model : " + this.localsysteminformations.Systemconfg.productmodel);

    
    if(this.localsysteminformations.Systemconfg.timezoneoffsetminutes==null)
    {
      
      this.localsysteminformations.Systemconfg.timezoneoffsetminutes=9*60;
      console.log("timezoneoffsetminutes unidefined : " + this.localsysteminformations.Systemconfg.timezoneoffsetminutes);

    }
    else
    {
      console.log("timezoneoffsetminutes  : " + this.localsysteminformations.Systemconfg.timezoneoffsetminutes);

    }
    

  }
  
  
  //시스템에 이벤트가 발생하면 기록하고 서버로 보냄
  setSystemevent(mnewevt) {
    this.dailydatas.updateEvent(mnewevt);

    //로컬 db로 보냄
    let events = [];
    events.push(mnewevt);
    this.localDBinterface.seteventdata(this.mydeviceuniqid, events);

    //서버로 보냄
    this.mAPI.seteventdatatoserver(this.mydeviceuniqid, events);
  }
};
