


//구동기 기본 정보 
const ActuatorStatus = require("./actuatorstatus.js");
const KDDefine = require("./kddefine");
module.exports =  class ActuatorBasic{
    
    static Clonbyjsonobj(mobj) {
        return Object.assign(new ActuatorBasic("n0",0), mobj);
      }

        constructor(mname,mchannel) {
            this.Name =mname;           //구동장비 이름
            this.HWType=KDDefine.HardwareTypeEnum.HT_RELAY;              // 릴레이, 계폐기, 기타
            this.DevType=KDDefine.OutDeviceTypeEnum.ODT_RELAY;          // 실제 연결된 장비타입, 자동제어시 확인
            this.Nodeid=1;              // 노드 주소 , 구동기구별을 위해
            this.Channel=mchannel;      // 물리적 채널번호    
            this.UniqID = ActuatorStatus.makeactuatoruniqid(this.Nodeid,this.Channel ,this.HWType);
        }
        makeuid()
        {
          this.UniqID = ActuatorStatus.makeactuatoruniqid(this.Nodeid,this.Channel ,this.HWType);
        }

        /// 구동기목록 모델별로 디폴트 생성 json 파일에서 편집할경우 구조체가 변경되면  귀찮음.. 코드로 추가하고 파일삭제하면 자동생성되게 하자.
        static CreateDefaultConfig(modelname) {
          let mcfglist = [];
          let actd = {};

          if (modelname == "KPC480") {
            actd = new ActuatorBasic("구동기1",0);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);
           
            actd = new ActuatorBasic("구동기2",1);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);

            actd = new ActuatorBasic("구동기3",2);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);


            actd = new ActuatorBasic("구동기4",3);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);


            actd = new ActuatorBasic("펌프17",16);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);

            
            actd = new ActuatorBasic("솔밸브18",17);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);


            actd = new ActuatorBasic("히터19",18);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_HEATER;
            mcfglist.push(actd);

            actd = new ActuatorBasic("쿨러20",19);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_COOLER;
            mcfglist.push(actd);


            actd = new ActuatorBasic("LED화이트25",24);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE;
            actd.HWType = KDDefine.HardwareTypeEnum.HT_PWM;
            actd.makeuid();
            mcfglist.push(actd);

            actd = new ActuatorBasic("LED레드26",25);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_LED_RED;
            actd.HWType = KDDefine.HardwareTypeEnum.HT_PWM;
            actd.makeuid();
            mcfglist.push(actd);

            actd = new ActuatorBasic("LED블루27",26);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_LED_BLUE;
            actd.HWType = KDDefine.HardwareTypeEnum.HT_PWM;
            actd.makeuid();
            mcfglist.push(actd);

          }
          else if (modelname == 'VFC3300') {              // mhlee VFC3300 <<< 이전 인도어팜 V2

            // ODT_RELAY: 0, // 단순접점
            // ODT_PUMP: 1, //
            // ODT_FAN: 2,
            // ODT_VALVE: 3,
            // ODT_LED: 4,
            // ODT_COOLER: 5,
            // ODT_HEATER: 6,
            // ODT_POWER: 7,
            // ODT_NOZZLE: 8,
            
            // ODT_LED_WHITE: 30,
            // ODT_LED_RED: 31,
            // ODT_LED_BLUE: 32,
            // ODT_LED_GREEN: 33,
            // ODT_LED_IR: 34,
            // ODT_LED_UVA: 35,
            // ODT_LED_UVB: 36,
        
            // ODT_ETC: 99,
            // ODT_DELETE: 9999, //장치삭제

            actd = new ActuatorBasic("LED", 0);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_LED;
            mcfglist.push(actd);
           
            actd = new ActuatorBasic("냉방기", 1);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_COOLER;
            mcfglist.push(actd);

            actd = new ActuatorBasic("유동팬", 2);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_FAN;
            mcfglist.push(actd);

            actd = new ActuatorBasic("환기팬", 3);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_FAN;
            mcfglist.push(actd);

            actd = new ActuatorBasic("관수펌프",4);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_PUMP;
            mcfglist.push(actd);
            
            actd = new ActuatorBasic("C액(산)",6);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);

            actd = new ActuatorBasic("B액(EC)",7);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);

            actd = new ActuatorBasic("A액(EC)",8);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);

          }

          else if (modelname == "KPC200") {
            actd = new ActuatorBasic("히터1",0);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_HEATER;
            mcfglist.push(actd);

            actd = new ActuatorBasic("쿨러2",1);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_COOLER;
            mcfglist.push(actd);

            actd = new ActuatorBasic("펌프5",4);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);



            actd = new ActuatorBasic("환기팬7",6);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);
           
            actd = new ActuatorBasic("팰티어다운팬3",2);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);

            actd = new ActuatorBasic("팰티어업팬4",3);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);


            actd = new ActuatorBasic("히트싱크팬6",5);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);


            
            
            actd = new ActuatorBasic("솔밸브18",17);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_RELAY;
            mcfglist.push(actd);


            


            actd = new ActuatorBasic("LED화이트25",24);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE;
            actd.HWType = KDDefine.HardwareTypeEnum.HT_PWM;
            actd.makeuid();
            mcfglist.push(actd);

            actd = new ActuatorBasic("LED레드26",25);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_LED_RED;
            actd.HWType = KDDefine.HardwareTypeEnum.HT_PWM;
            actd.makeuid();
            mcfglist.push(actd);

            actd = new ActuatorBasic("LED블루27",26);
            actd.DevType = KDDefine.OutDeviceTypeEnum.ODT_LED_BLUE;
            actd.HWType = KDDefine.HardwareTypeEnum.HT_PWM;
            actd.makeuid();
            mcfglist.push(actd);




          }
          else{

            let act1 = new ActuatorBasic("구동기1",0);
            let act2 = new ActuatorBasic("구동기2",1);
            actinfolist.push(act1);
            actinfolist.push(act2);
            

          }
          return mcfglist;

          }
    


}





