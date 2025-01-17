//구동기 기본 정보
const ActuatorStatus = require("./actuatorstatus.js");
const KDDefine = require("./kddefine");
module.exports = class ActuatorBasic {
  static Clonbyjsonobj(mobj) {
    return Object.assign(new ActuatorBasic(0, 0, 0), mobj);
  }


  /*
  KPC880 컨트롤러 제어 채널 물리적번호

  typedef enum
{
      	OC_AC_CH1=0, 
        OC_AC_CH2=1,
        OC_AC_CH3=2,
        OC_AC_CH4=3,
        OC_AC_CH5=4,
        OC_AC_CH6=5,
        OC_AC_CH7=6,
        OC_AC_CH8=7,
        
        OC_DC_CH1=8, 
        OC_DC_CH2=9,
        OC_DC_CH3=10,
        OC_DC_CH4=11,
        OC_DC_CH5=12,
        OC_DC_CH6=13,
        OC_DC_CH7=14,
        OC_DC_CH8=15,
        
        
        OC_RELAY_CH1=16, //relay 1
        OC_RELAY_CH2=17,
        
        OC_DIO_CH1=18,  //air circulator
        OC_DIO_CH2=19,  // heatsnik  fan 
        
        OC_HDRV_CH1=20,  //  DC 정역 가능 
        OC_HDRV_CH2=21,  //DC 정역 가능 
        OC_HDRV_CH3=22,  //DC 정역 가능 
        OC_HDRV_CH4=23,  //DC 정역 가능 
        
        
        OC_PWM_CH1=24,  // on /off 주기를 설정해서 제어할수 있는 채널  (LED 디밍)
        OC_PWM_CH2=25,  //
        OC_PWM_CH3=26,  //
        OC_PWM_CH4=27,  //
        
        OC_PID_CH1=28,  // PID 로 제어 되는 채널  ( 히터)
        OC_PID_CH2=29,  //
        OC_MAX_CHANNEL
} OutChannel;

  */

  
  constructor(mnameid, mchannel, mdtype, mnodeid = 1, mhwtype = KDDefine.HardwareTypeEnum.HT_RELAY) {
    this.Name = "Actuator"; //구동장비 이름 다국어지원해야함으로 이름은 프론트엔드에서 가져옴
    this.Nid = mnameid; //  이름 정의된 문자열 ID
    this.Channel = mchannel; // 물리적 채널번호     가중중요함 각장비별 펌웨어참조 
    this.DevType = mdtype; // 실제 연결된 장비타입, 자동제어시 확인

    this.Nodeid = mnodeid; // 노드 주소 , 구동기구별을 위해
    this.HWType = mhwtype; // 릴레이, 계폐기, 기타
    

    this.UniqID = ActuatorStatus.makeactuatoruniqid(this.Nodeid, this.Channel, this.HWType);
  }

  /// 구동기목록 모델별로 디폴트 생성 json 파일에서 편집할경우 구조체가 변경되면  귀찮음.. 코드로 추가하고 파일삭제하면 자동생성되게 하자.
  static CreateDefaultActuator(modelname) {
    let mcfglist = [];
    
    console.log("CreateDefaultConfig modelname:" + modelname );

     if (modelname === KDDefine.PModel.KPC880E) {
      //히터1
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HEATER, 0, KDDefine.OutDeviceTypeEnum.ODT_HEATER));
 
      //쿨러
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COOLER, 1, KDDefine.OutDeviceTypeEnum.ODT_COOLER));
 
      //내부유동팬
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_FLOWFAN, 2, KDDefine.OutDeviceTypeEnum.ODT_FAN));
 
 
     //냉난방기
     mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_TEMP_CONTROLER, 28, KDDefine.OutDeviceTypeEnum.ODT_TEMP_CONTOLLER, 1, KDDefine.HardwareTypeEnum.HT_PID));
 
 
 
      
 
 
      //환기팬
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 5, KDDefine.OutDeviceTypeEnum.ODT_FLOWFAN));

      
       //펌프 relay
       mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_PUMP, 6, KDDefine.OutDeviceTypeEnum.ODT_PUMP));
 
      
      //led 화이트
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDWHITE, 7, KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE));
 
 
 
     }

    else if (modelname === KDDefine.PModel.KPC880D) {


      /*
      //히터1
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HEATER, 0, KDDefine.OutDeviceTypeEnum.ODT_HEATER));

      //쿨러
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COOLER, 1, KDDefine.OutDeviceTypeEnum.ODT_COOLER));
      */

      


      //펌프5
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_PUMP, 16, KDDefine.OutDeviceTypeEnum.ODT_PUMP));
      //환기솔밸브  사용안함
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRVALVE, 17, KDDefine.OutDeviceTypeEnum.ODT_VALVE));


      
      //led 화이트
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDWHITE, 8, KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE));
      

      //가습기
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HUMI_HEATER, 10, KDDefine.OutDeviceTypeEnum.ODT_HUMIDIFLER));
      
      //유동팬
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_FLOWFAN, 11, KDDefine.OutDeviceTypeEnum.ODT_FAN));

      //환기팬
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 12, KDDefine.OutDeviceTypeEnum.ODT_FLOWFAN));

      
      //양액A  DC 6번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEA, 13, KDDefine.OutDeviceTypeEnum.ODT_SOL_A));

      //양액B  DC 7번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEB, 14, KDDefine.OutDeviceTypeEnum.ODT_SOL_B));
      //양액C  DC 8번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEC_PH, 15, KDDefine.OutDeviceTypeEnum.ODT_SOL_C));


      
      
      //측창
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEFT1_WINDOW, 20, KDDefine.OutDeviceTypeEnum.ODT_WINDOW,1, KDDefine.HardwareTypeEnum.HT_SWITCH));
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_RIGHT1_WINDOW, 21, KDDefine.OutDeviceTypeEnum.ODT_WINDOW,1, KDDefine.HardwareTypeEnum.HT_SWITCH));

      //스크린
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COVER_SCREEN, 22, KDDefine.OutDeviceTypeEnum.ODT_SCREEN,1, KDDefine.HardwareTypeEnum.HT_SWITCH));

      

      

    }
    else if (modelname === KDDefine.PModel.KPC880B) {
     //히터1
     mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HEATER, 0, KDDefine.OutDeviceTypeEnum.ODT_HEATER));

     //쿨러
     mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COOLER, 1, KDDefine.OutDeviceTypeEnum.ODT_COOLER));

     //유동팬
     mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 2, KDDefine.OutDeviceTypeEnum.ODT_FLOWFAN));



    //냉난방기
    mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_TEMP_CONTROLER, 28, KDDefine.OutDeviceTypeEnum.ODT_TEMP_CONTOLLER, 1, KDDefine.HardwareTypeEnum.HT_PID));



     


      //펌프 relay
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_PUMP, 16, KDDefine.OutDeviceTypeEnum.ODT_PUMP));

      //환기팬
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_FLOWFAN, 11, KDDefine.OutDeviceTypeEnum.ODT_FAN));


      //환기밸브
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRVALVE, 12, KDDefine.OutDeviceTypeEnum.ODT_VALVE));




      //화이트
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDWHITE, 24, KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //red
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDRED, 25, KDDefine.OutDeviceTypeEnum.ODT_LED_RED, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //blue
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDBLUE, 26, KDDefine.OutDeviceTypeEnum.ODT_LED_BLUE, 1, KDDefine.HardwareTypeEnum.HT_PWM));




    }
    else if (modelname === KDDefine.PModel.KPC880A) {
      //히터1
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HEATER, 20, KDDefine.OutDeviceTypeEnum.ODT_HEATER));

      //쿨러
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COOLER, 21, KDDefine.OutDeviceTypeEnum.ODT_COOLER));

      //펌프5
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_PUMP, 16, KDDefine.OutDeviceTypeEnum.ODT_PUMP));

      //환기팬
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 18, KDDefine.OutDeviceTypeEnum.ODT_FAN));

      //화이트
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDWHITE, 24, KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //red
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDRED, 25, KDDefine.OutDeviceTypeEnum.ODT_LED_RED, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //blue
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDBLUE, 26, KDDefine.OutDeviceTypeEnum.ODT_LED_BLUE, 1, KDDefine.HardwareTypeEnum.HT_PWM));


      //냉난방기
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_TEMP_CONTROLER, 28, KDDefine.OutDeviceTypeEnum.ODT_TEMP_CONTOLLER, 1, KDDefine.HardwareTypeEnum.HT_PWM));




    }
     else if (modelname === KDDefine.PModel.KPC480 ) {
      //히터1
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HEATER, 0, KDDefine.OutDeviceTypeEnum.ODT_HEATER));

      //쿨러
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COOLER, 1, KDDefine.OutDeviceTypeEnum.ODT_COOLER));

      //습도히터  AC 3번//가습기PID
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HUMI_HEATER, 3, KDDefine.OutDeviceTypeEnum.ODT_HUMIDIFLER));

      //co2 솔밸브  AC 4번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_CO2_VALVE, 4, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //외부환기팬  AC 6번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 6, KDDefine.OutDeviceTypeEnum.ODT_FAN));


      

      //양액통 교반펌프 AC 12번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AGITATOR_PUMP, 12, KDDefine.OutDeviceTypeEnum.ODT_AG_PUMP));



      //가습기 물공급펌프 AC 13번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HUMIDIFIER_PUMP, 13, KDDefine.OutDeviceTypeEnum.ODT_PUMP));


      //양액펌프 AC 15번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_PUMP, 15, KDDefine.OutDeviceTypeEnum.ODT_PUMP));


      //양액A  DC 17번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEA, 17, KDDefine.OutDeviceTypeEnum.ODT_SOL_A));

      //양액B  DC 18번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEB, 18, KDDefine.OutDeviceTypeEnum.ODT_SOL_B));
      //양액C  DC 19번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_ECVALVEC_PH, 19, KDDefine.OutDeviceTypeEnum.ODT_SOL_C));

      //환기솔밸브  DC 20번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRVALVE, 20, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //화이트
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDWHITE, 24, KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //red
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDRED, 25, KDDefine.OutDeviceTypeEnum.ODT_LED_RED, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //blue
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDBLUE, 26, KDDefine.OutDeviceTypeEnum.ODT_LED_BLUE, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //냉난방기
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_TEMP_CONTROLER, 29, KDDefine.OutDeviceTypeEnum.ODT_TEMP_CONTOLLER, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      


    } 
    else if ( modelname === KDDefine.PModel.KPC300) {
      //히터1
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HEATER, 0, KDDefine.OutDeviceTypeEnum.ODT_HEATER));

      //쿨러
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_COOLER, 1, KDDefine.OutDeviceTypeEnum.ODT_COOLER));

      
      //환기팬  AC 6번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRFAN, 6, KDDefine.OutDeviceTypeEnum.ODT_FAN));


      

      //교반펌프 AC 12번
     // mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AGITATOR_PUMP, 12, KDDefine.OutDeviceTypeEnum.ODT_AG_PUMP));



      //히터펌프 AC 13번
     // mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_HUMIDIFIER_PUMP, 13, KDDefine.OutDeviceTypeEnum.ODT_PUMP));


      //관수펌프 DC 16번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_PUMP, 16, KDDefine.OutDeviceTypeEnum.ODT_PUMP));

      
      //환기솔밸브  DC 20번
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_AIRVALVE, 20, KDDefine.OutDeviceTypeEnum.ODT_VALVE));

      //화이트
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDWHITE, 24, KDDefine.OutDeviceTypeEnum.ODT_LED_WHITE, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //red
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDRED, 25, KDDefine.OutDeviceTypeEnum.ODT_LED_RED, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //blue
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_LEDBLUE, 26, KDDefine.OutDeviceTypeEnum.ODT_LED_BLUE, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      //냉난방기
      mcfglist.push(new ActuatorBasic(KDDefine.ActuatorNameID.NID_TEMP_CONTROLER, 29, KDDefine.OutDeviceTypeEnum.ODT_TEMP_CONTOLLER, 1, KDDefine.HardwareTypeEnum.HT_PWM));

      


    }
    else if (modelname === KDDefine.PModel.VFC3300) {
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
