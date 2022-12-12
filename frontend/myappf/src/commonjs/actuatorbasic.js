


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
          if (modelname == "KPC480") {
            let actd = new ActuatorBasic("구동기1",0);
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
          else{

            let act1 = new ActuatorBasic("구동기1",0);
            let act2 = new ActuatorBasic("구동기2",1);
            actinfolist.push(act1);
            actinfolist.push(act2);
            

          }
          return mcfglist;

          }
    


}





