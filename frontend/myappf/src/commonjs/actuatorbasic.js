//구동기 기본 정보
const ActuatorStatus = require("./actuatorstatus.js");
const KDDefine = require("./kddefine");
module.exports = class ActuatorBasic {
  static Clonbyjsonobj(mobj) {
    return Object.assign(new ActuatorBasic(0, 0, 0), mobj);
  }

  constructor(mnameid, mchannel, mdtype, mnodeid = 1, mhwtype = KDDefine.HardwareTypeEnum.HT_RELAY) {
    this.Name = "Actuator"; //구동장비 이름 다국어지원해야함으로 이름은 프론트엔드에서 가져옴
    this.Nid = mnameid; //  이름 정의된 문자열 ID
    this.Channel = mchannel; // 물리적 채널번호     가중중요함
    this.DevType = mdtype; // 실제 연결된 장비타입, 자동제어시 확인

    this.Nodeid = mnodeid; // 노드 주소 , 구동기구별을 위해
    this.HWType = mhwtype; // 릴레이, 계폐기, 기타

    this.UniqID = ActuatorStatus.makeactuatoruniqid(this.Nodeid, this.Channel, this.HWType);
  }

  /// 구동기목록 모델별로 디폴트 생성 json 파일에서 편집할경우 구조체가 변경되면  귀찮음.. 코드로 추가하고 파일삭제하면 자동생성되게 하자.
  static CreateDefaultActuator(modelname) {
    let mcfglist = [];

    console.log("CreateDefaultConfig modelname:" + modelname + " KDDefine.PModel.KPC200:" + KDDefine.PModel.KPC200);

    if (modelname === KDDefine.PModel.KPC480 || modelname === KDDefine.PModel.KPC300) {
      //히터1
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HEATER, 0, KDDefine.OutDeviceTypeEnum.ODT_HEATER));

      //쿨러
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COOLER, 1, KDDefine.OutDeviceTypeEnum.ODT_COOLER));

      //습도히터  AC 3번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HUMI_HEATER, 3, KDDefine.OutDeviceTypeEnum.ODT_HEATER));

      //co2 솔밸브  AC 4번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_CO2_VALVE, 4, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //환기팬  AC 6번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 6, KDDefine.OutDeviceTypeEnum.ODT_FAN));

      //펌프 AC 15번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_PUMP, 15, KDDefine.OutDeviceTypeEnum.ODT_PUMP));

      //양액A  DC 17번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEA, 17, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //양액B  DC 18번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEB, 18, KDDefine.OutDeviceTypeEnum.ODT_VALVE));
      //양액C  DC 19번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEC, 19, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //환기솔밸브  DC 20번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 20, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //화이트
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDWHITE, 24, KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //red
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDRED, 25, KDDefine.OutDeviceTypeEnum.ODT_LED_RED, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //blue
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDBLUE, 26, KDDefine.OutDeviceTypeEnum.ODT_LED_BLUE, 1, KDDefine.HardwareTypeEnum.HT_PWM));
    } else if (modelname === KDDefine.PModel.VFC3300) {
      // mhlee VFC3300 <<< 이전 인도어팜 V2

      //led
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LED, 0, KDDefine.OutDeviceTypeEnum.ODT_LED));

      //쿨러
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COOLER, 1, KDDefine.OutDeviceTypeEnum.ODT_COOLER));

      //유동팬
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_FLOWFAN, 2, KDDefine.OutDeviceTypeEnum.ODT_FAN));

      //환기팬
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 3, KDDefine.OutDeviceTypeEnum.ODT_FAN));

      //관수펌프
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_WATERPUMP, 4, KDDefine.OutDeviceTypeEnum.ODT_PUMP));

      //C액(산)
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEC_PH, 6, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //B액(EC)
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEB, 7, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //A액(EC)
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEA, 8, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //식물재배기 1차2차
    } else if (modelname === KDDefine.PModel.KPC200) {
      //히터1
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HEATER, 0, KDDefine.OutDeviceTypeEnum.ODT_HEATER));

      //쿨러
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COOLER, 1, KDDefine.OutDeviceTypeEnum.ODT_COOLER));

      //펌프5
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_PUMP, 4, KDDefine.OutDeviceTypeEnum.ODT_PUMP));

      //환기팬
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 6, KDDefine.OutDeviceTypeEnum.ODT_FAN));

      //화이트
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDWHITE, 24, KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //red
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDRED, 25, KDDefine.OutDeviceTypeEnum.ODT_LED_RED, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //blue
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDBLUE, 26, KDDefine.OutDeviceTypeEnum.ODT_LED_BLUE, 1, KDDefine.HardwareTypeEnum.HT_PWM));
    } else {
      ///기타 디폴트

      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ACTUATOR, 0, KDDefine.OutDeviceTypeEnum.ODT_RELAY));
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ACTUATOR, 1, KDDefine.OutDeviceTypeEnum.ODT_RELAY));
    }

    return mcfglist;
  }
};
